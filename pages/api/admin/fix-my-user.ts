/**
 * FIX MY USER
 * Repariert fehlende User-Tracking-Felder für spezifischen User
 *
 * @version 1.0.0
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    console.log(`🛠️ Fixing user tracking fields for: ${userId}`);

    // SCHRITT 1: Aktuelle User-Daten abrufen
    const { data: currentUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('User fetch error:', fetchError);
      return res.status(500).json({
        error: 'User not found',
        details: fetchError.message,
      });
    }

    // SCHRITT 2: Fehlende/null Felder identifizieren und reparieren
    const updates = {};

    // login_count: Falls null/undefined, setze auf 1
    if (currentUser.login_count === null || currentUser.login_count === undefined) {
      updates.login_count = 1;
    }

    // onboarding_completed: Falls null/undefined, setze auf false
    if (
      currentUser.onboarding_completed === null ||
      currentUser.onboarding_completed === undefined
    ) {
      updates.onboarding_completed = false;
    }

    // first_login_at: Falls null, verwende created_at
    if (currentUser.first_login_at === null || currentUser.first_login_at === undefined) {
      updates.first_login_at = currentUser.created_at;
    }

    // last_login_at: Falls null, verwende updated_at oder created_at
    if (currentUser.last_login_at === null || currentUser.last_login_at === undefined) {
      updates.last_login_at = currentUser.updated_at || currentUser.created_at;
    }

    // last_activity_track: Falls null, setze Default
    if (currentUser.last_activity_track === null || currentUser.last_activity_track === undefined) {
      updates.last_activity_track = 'Onboarding';
    }

    // last_activity_at: Falls null, verwende updated_at
    if (currentUser.last_activity_at === null || currentUser.last_activity_at === undefined) {
      updates.last_activity_at = currentUser.updated_at || currentUser.created_at;
    }

    // SCHRITT 3: Updates ausführen (nur wenn nötig)
    if (Object.keys(updates).length === 0) {
      return res.status(200).json({
        success: true,
        message: 'User already has all tracking fields',
        userId,
        updatesNeeded: false,
        currentData: currentUser,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`Applying updates:`, updates);

    const { data: updatedUser, error: updateError } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('User update error:', updateError);
      return res.status(500).json({
        error: 'User update failed',
        details: updateError.message,
      });
    }

    // SCHRITT 4: Verifikation
    const { data: verifiedUser, error: verifyError } = await supabase
      .from('user_profiles')
      .select(
        'id, email, login_count, onboarding_completed, first_login_at, last_login_at, last_activity_track, last_activity_at, created_at, updated_at',
      )
      .eq('id', userId)
      .single();

    if (verifyError) {
      console.error('Verification error:', verifyError);
      return res.status(500).json({
        error: 'Verification failed',
        details: verifyError.message,
      });
    }

    console.log('✅ User tracking fields successfully fixed');

    return res.status(200).json({
      success: true,
      message: 'User tracking fields successfully updated',
      userId,
      updatesNeeded: true,
      appliedUpdates: updates,
      beforeData: currentUser,
      afterData: verifiedUser,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Fix user error:', error);
    return res.status(500).json({
      error: 'Fix user failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
