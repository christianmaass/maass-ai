/**
 * LOG DASHBOARD COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - Role-based access control via isAdmin()
 * - JWT token management via getAccessToken()
 * - No direct supabase.auth calls
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { ScrollArea } from '@ui/scroll-area';
import { useAuth } from '@contexts/AuthContext';

interface LogEntry {
  timestamp: string;
  level: number;
  levelName: string;
  message: string;
  context: any;
}

interface LogStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  openaiCost: number;
  avgResponseTime: number;
  rateLimitHits: number;
}

export default function LogDashboard() {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user: _user, getAccessToken, isAdmin, isAuthenticated } = useAuth();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({
    totalLogs: 0,
    errorCount: 0,
    warningCount: 0,
    openaiCost: 0,
    avgResponseTime: 0,
    rateLimitHits: 0,
  });
  const [isLive, setIsLive] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate real-time log fetching (in production, this would be WebSocket or SSE)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(async () => {
      try {
        // Use navaa Auth Guidelines - check authentication and admin role
        if (!isAuthenticated() || !isAdmin()) {
          console.error('User not authenticated or not admin for log fetching');
          return;
        }

        // Get JWT token for API call (MANDATORY per navaa Guidelines)
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.error('Failed to get access token for log fetching');
          return;
        }

        const response = await fetch('/api/admin/logs', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const newLogs = await response.json();
          setLogs((prev) => [...newLogs, ...prev].slice(0, 1000)); // Keep last 1000 logs

          // Update stats
          calculateStats(newLogs);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    }, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval);
  }, [isLive, getAccessToken, isAdmin, isAuthenticated]);

  const calculateStats = (logEntries: LogEntry[]) => {
    const errorCount = logEntries.filter((log) => log.levelName === 'ERROR').length;
    const warningCount = logEntries.filter((log) => log.levelName === 'WARN').length;

    const openaiLogs = logEntries.filter(
      (log) => log.context?.category === 'openai_usage' && log.context?.cost,
    );
    const totalCost = openaiLogs.reduce((sum, log) => sum + (log.context.cost || 0), 0);

    const performanceLogs = logEntries.filter(
      (log) => log.context?.duration && log.context?.operation,
    );
    const avgResponseTime =
      performanceLogs.length > 0
        ? performanceLogs.reduce((sum, log) => sum + log.context.duration, 0) /
          performanceLogs.length
        : 0;

    const rateLimitHits = logEntries.filter((log) => log.message.includes('Rate Limit Hit')).length;

    setStats({
      totalLogs: logEntries.length,
      errorCount,
      warningCount,
      openaiCost: totalCost,
      avgResponseTime: Math.round(avgResponseTime),
      rateLimitHits,
    });
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedLevel === 'all') return true;
    return log.levelName === selectedLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-500';
      case 'WARN':
        return 'bg-yellow-500';
      case 'INFO':
        return 'bg-blue-500';
      case 'DEBUG':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('de-DE');
  };

  const formatContext = (context: any) => {
    if (!context) return '';

    // Show key context information
    const keyInfo: string[] = [];
    if (context.userId) keyInfo.push(`User: ${context.userId.slice(0, 8)}`);
    if (context.endpoint) keyInfo.push(`Endpoint: ${context.endpoint}`);
    if (context.duration) keyInfo.push(`${context.duration}ms`);
    if (context.cost) keyInfo.push(`$${context.cost.toFixed(4)}`);
    if (context.operation) keyInfo.push(`Op: ${context.operation}`);

    return keyInfo.join(' | ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Log Dashboard</h2>
          <p className="text-muted-foreground">Real-time monitoring and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant={isLive ? 'default' : 'outline'} onClick={() => setIsLive(!isLive)}>
            {isLive ? '🔴 Live' : '⏸️ Paused'}
          </Button>
          <Button variant="outline" onClick={() => setLogs([])}>
            Clear Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <span className="text-2xl">🚨</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errorCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <span className="text-2xl">⚠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warningCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OpenAI Cost</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.openaiCost.toFixed(4)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <span className="text-2xl">⚡</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <span className="text-2xl">🛡️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rateLimitHits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Log Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" onClick={() => setSelectedLevel('all')}>
            All
          </TabsTrigger>
          <TabsTrigger value="ERROR" onClick={() => setSelectedLevel('ERROR')}>
            Errors
          </TabsTrigger>
          <TabsTrigger value="WARN" onClick={() => setSelectedLevel('WARN')}>
            Warnings
          </TabsTrigger>
          <TabsTrigger value="INFO" onClick={() => setSelectedLevel('INFO')}>
            Info
          </TabsTrigger>
          <TabsTrigger value="DEBUG" onClick={() => setSelectedLevel('DEBUG')}>
            Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Log Stream</CardTitle>
              <CardDescription>
                Real-time application logs ({filteredLogs.length} entries)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
                <div className="space-y-2">
                  {filteredLogs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground hover:bg-muted/50"
                    >
                      <Badge className={`${getLevelColor(log.levelName)} text-white`}>
                        {log.levelName}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatTimestamp(log.timestamp)}</span>
                          {formatContext(log.context) && (
                            <span className="text-xs">• {formatContext(log.context)}</span>
                          )}
                        </div>
                        <p className="font-medium">{log.message}</p>
                        {log.context && Object.keys(log.context).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-sm text-muted-foreground cursor-pointer">
                              Show Context
                            </summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No logs found for the selected filter.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
