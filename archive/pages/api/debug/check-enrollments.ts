/**
 * DEBUG API: CHECK USER ENROLLMENTS
 * Direkte Datenbank-Abfrage für User-Einschreibungen
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface JWTPayload {
  sub: string;
  email?: string;
  aud?: string;
  role?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Dev-only guard: disable in non-development environments
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.decode(token) as JWTPayload;

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.sub;
    console.log('🔍 Checking enrollments for user:', userId);

    // Query user_course_enrollments table
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('user_course_enrollments')
      .select(
        `
        id,
        user_id,
        course_id,
        enrolled_at,
        is_active,
        status,
        progress_percentage,
        last_activity_at,
        created_at,
        updated_at,
        courses (
          id,
          name,
          slug
        )
      `,
      )
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (enrollmentError) {
      console.error('❌ Error querying enrollments:', enrollmentError);
      return res.status(500).json({
        error: 'Database query failed',
        details: enrollmentError.message,
      });
    }

    console.log('✅ Found enrollments:', enrollments?.length || 0);

    // Format enrollments data
    const formattedEnrollments =
      enrollments?.map((enrollment: any) => {
        const courseRel = Array.isArray(enrollment.courses)
          ? enrollment.courses[0]
          : enrollment.courses;
        return {
          id: enrollment.id,
          user_id: enrollment.user_id,
          course_id: enrollment.course_id,
          enrolled_at: enrollment.enrolled_at,
          is_active: enrollment.is_active,
          status: enrollment.status,
          progress_percentage: enrollment.progress_percentage,
          last_activity_at: enrollment.last_activity_at,
          created_at: enrollment.created_at,
          updated_at: enrollment.updated_at,
          course_name: courseRel?.name,
          course_slug: courseRel?.slug,
        };
      }) || [];

    // Also check if user_course_enrollments table exists and has correct structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'user_course_enrollments')
      .order('ordinal_position');

    if (tableError) {
      console.warn('⚠️ Could not check table structure:', tableError);
    }

    return res.status(200).json({
      success: true,
      user_id: userId,
      enrollments: formattedEnrollments,
      enrollment_count: formattedEnrollments.length,
      table_structure: tableInfo || null,
      debug_info: {
        query_timestamp: new Date().toISOString(),
        table_exists: !tableError,
        raw_enrollments: enrollments,
      },
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
