import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/guards';
import { getCacheStats, isCacheEnabled } from '@/lib/cache';

export const runtime = 'nodejs';

/**
 * GET /api/cache/status - Cache-Status und Statistiken abrufen
 * Admin-only: Nur Administratoren können Cache-Status abrufen
 */
export async function GET() {
  try {
    // Prüfe, ob User Admin ist
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const stats = getCacheStats();
    const enabled = isCacheEnabled();

    return NextResponse.json({
      ok: true,
      cache: {
        status: enabled,
        ...stats,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting cache status:', error);
    return NextResponse.json(
      { error: 'Failed to get cache status' },
      { status: 500 }
    );
  }
}
