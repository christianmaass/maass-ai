import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@supabaseClient';
import { withRateLimit, RATE_LIMITS, userKeyGenerator } from '@lib/rateLimiter';
import { logger, createPerformanceTimer, extractUserIdFromRequest } from '@lib/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialize performance tracking and logging context
  const performanceTimer = createPerformanceTimer('submit-response-total');
  const userId = extractUserIdFromRequest(req) || req.body.user_id;

  logger.info('Response Submission Started', {
    userId,
    endpoint: '/api/submit-response',
    caseId: req.body.case_id,
    responseLength: req.body.response_text?.length || 0,
    timeSpent: req.body.time_spent_seconds,
  });

  if (req.method !== 'POST') {
    logger.warn('Invalid Method for Response Submission', { userId, method: req.method });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, case_id, response_text, time_spent_seconds } = req.body;

    if (!user_id || !case_id || !response_text) {
      logger.error('Missing Required Parameters for Response Submission', {
        userId,
        user_id,
        case_id,
        responseTextProvided: !!response_text,
      });
      return res.status(400).json({ error: 'user_id, case_id, and response_text are required' });
    }

    const supabase = getSupabaseClient();

    // User Response speichern
    const { data: savedResponse, error: saveError } = await supabase
      .from('user_responses')
      .insert({
        user_id,
        case_id,
        response_text,
        time_spent_seconds: time_spent_seconds || null,
      })
      .select()
      .single();

    if (saveError) {
      logger.error('Database Response Save Failed', {
        userId,
        caseId: case_id,
        error: saveError.message,
        operation: 'response-save',
      });
      return res.status(500).json({ error: 'Failed to save response' });
    }

    // Log successful response submission (Business Event)
    logger.businessEvent('Response Submitted Successfully', {
      userId,
      caseId: case_id,
      responseId: savedResponse.id,
      responseLength: response_text.length,
      timeSpent: time_spent_seconds || 0,
    });

    // Log final performance metrics
    const totalDuration = performanceTimer.end({
      userId,
      responseId: savedResponse.id,
      success: true,
    });

    logger.info('Response Submission Completed Successfully', {
      userId,
      caseId: case_id,
      responseId: savedResponse.id,
      totalDuration,
      responseLength: response_text.length,
    });

    res.status(200).json({
      response: savedResponse,
      message: 'Response saved successfully',
    });
  } catch (error) {
    // Log comprehensive error information
    const totalDuration = performanceTimer.end({
      userId,
      success: false,
      error: (error as any)?.message || (error instanceof Error ? error.message : String(error)),
    });

    logger.error('Response Submission Failed', {
      userId,
      caseId: req.body.case_id,
      error: (error as any)?.message || (error instanceof Error ? error.message : String(error)),
      stack: (error as any)?.stack || (error instanceof Error ? error.stack : undefined),
      totalDuration,
      operation: 'response-submission',
    });

    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with general rate limiting (100 requests per minute)
export default withRateLimit(
  {
    ...RATE_LIMITS.general,
    keyGenerator: userKeyGenerator,
    onLimitReached: (req, res) => {
      const retryAfter = Math.ceil(RATE_LIMITS.general.windowMs / 1000);
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Du hast zu viele Antworten eingereicht. Bitte warte einen Moment.',
        retryAfter,
      });
    },
  },
  handler,
);
