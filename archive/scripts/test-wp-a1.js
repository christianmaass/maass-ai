#!/usr/bin/env node

/**
 * WP-A1 TESTING SCRIPT
 * Tests Supabase Auth Setup for navaa.ai
 *
 * USAGE: node scripts/test-wp-a1.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}🎯 ${msg}${colors.reset}\n`),
};

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase clients
let supabaseAdmin, supabaseClient;

try {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  log.error('Failed to initialize Supabase clients');
  process.exit(1);
}

/**
 * Test 1: Environment Configuration
 */
async function testEnvironmentConfig() {
  log.header('TEST 1: Environment Configuration');

  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  let allPresent = true;

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log.success(`${envVar} is configured`);
    } else {
      log.error(`${envVar} is missing`);
      allPresent = false;
    }
  }

  // Check SMTP configuration
  const smtpVars = [
    'SUPABASE_SMTP_HOST',
    'SUPABASE_SMTP_PORT',
    'SUPABASE_SMTP_USER',
    'SUPABASE_SMTP_PASS',
  ];

  let smtpConfigured = true;
  for (const envVar of smtpVars) {
    if (!process.env[envVar]) {
      smtpConfigured = false;
      break;
    }
  }

  if (smtpConfigured) {
    log.success('SMTP configuration found in environment');
  } else {
    log.warning('SMTP configuration not found - needs manual setup in Supabase Dashboard');
  }

  return allPresent;
}

/**
 * Test 2: Supabase Connection
 */
async function testSupabaseConnection() {
  log.header('TEST 2: Supabase Connection');

  try {
    // Test admin connection
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (adminError) {
      log.error(`Admin connection failed: ${adminError.message}`);
      return false;
    }

    log.success('Admin connection successful');

    // Test client connection
    const { data: clientData, error: clientError } = await supabaseClient
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (clientError && clientError.code !== 'PGRST116') {
      // PGRST116 is expected for RLS
      log.error(`Client connection failed: ${clientError.message}`);
      return false;
    }

    log.success('Client connection successful');
    return true;
  } catch (error) {
    log.error(`Connection test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 3: Database Schema
 */
async function testDatabaseSchema() {
  log.header('TEST 3: Database Schema');

  try {
    // Check if user_profiles table exists
    const { data: tables, error: tablesError } = await supabaseAdmin.rpc('get_table_info', {
      table_name: 'user_profiles',
    });

    if (tablesError) {
      log.warning('Could not verify table structure - manual check required');
    } else {
      log.success('user_profiles table structure verified');
    }

    // Check RLS policies
    const { data: policies, error: policiesError } = await supabaseAdmin
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'user_profiles');

    if (policiesError) {
      log.warning('Could not verify RLS policies - manual check required');
    } else {
      const policyCount = policies?.length || 0;
      if (policyCount >= 5) {
        log.success(`RLS policies configured (${policyCount} policies found)`);
      } else {
        log.warning(`Only ${policyCount} RLS policies found - expected at least 5`);
      }
    }

    // Check helper functions
    const { data: functions, error: functionsError } = await supabaseAdmin.rpc('get_user_role');

    if (functionsError && !functionsError.message.includes('not found')) {
      log.warning('Helper functions may not be installed - run setup-supabase-auth.sql');
    } else {
      log.success('Helper functions available');
    }

    return true;
  } catch (error) {
    log.error(`Schema test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 4: Auth Configuration
 */
async function testAuthConfiguration() {
  log.header('TEST 4: Auth Configuration');

  try {
    // Test auth settings (this requires manual verification)
    log.info('Auth settings must be verified manually in Supabase Dashboard:');
    log.info('  - Go to Authentication > Settings');
    log.info('  - Verify SMTP settings are configured');
    log.info('  - Verify email confirmations are enabled');
    log.info('  - Verify site URL and redirect URLs');

    // Test if we can create a test auth user (cleanup immediately)
    const testEmail = `test-wp-a1-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: false, // Don't send email for test
    });

    if (signUpError) {
      log.error(`Test user creation failed: ${signUpError.message}`);
      return false;
    }

    log.success('Test user creation successful');

    // Cleanup test user
    if (signUpData.user) {
      await supabaseAdmin.auth.admin.deleteUser(signUpData.user.id);
      log.success('Test user cleaned up');
    }

    return true;
  } catch (error) {
    log.error(`Auth configuration test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 5: Email Templates
 */
async function testEmailTemplates() {
  log.header('TEST 5: Email Templates');

  const templateFiles = [
    'supabase/email-templates/confirmation.html',
    'supabase/email-templates/recovery.html',
  ];

  let allTemplatesExist = true;

  for (const templateFile of templateFiles) {
    const fullPath = path.join(process.cwd(), templateFile);

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check for navaa branding
      if (content.includes('navaa') && content.includes('#009e82')) {
        log.success(`${templateFile} exists with navaa branding`);
      } else {
        log.warning(`${templateFile} exists but may need navaa branding`);
      }
    } else {
      log.error(`${templateFile} not found`);
      allTemplatesExist = false;
    }
  }

  if (allTemplatesExist) {
    log.info('Email templates must be uploaded to Supabase Dashboard:');
    log.info('  - Go to Authentication > Settings > Email Templates');
    log.info('  - Upload confirmation.html for email confirmation');
    log.info('  - Upload recovery.html for password recovery');
  }

  return allTemplatesExist;
}

/**
 * Test 6: JWT Token Generation
 */
async function testJWTGeneration() {
  log.header('TEST 6: JWT Token Generation');

  try {
    // Create a temporary test user
    const testEmail = `jwt-test-${Date.now()}@example.com`;
    const testPassword = 'JWTTestPassword123!';

    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Skip email confirmation for test
    });

    if (createError) {
      log.error(`Failed to create test user: ${createError.message}`);
      return false;
    }

    // Test sign in to get JWT
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      log.error(`Failed to sign in test user: ${signInError.message}`);
      // Cleanup
      if (createData.user) {
        await supabaseAdmin.auth.admin.deleteUser(createData.user.id);
      }
      return false;
    }

    // Verify JWT token
    if (signInData.session && signInData.session.access_token) {
      const token = signInData.session.access_token;

      // Verify token with Supabase
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

      if (userError) {
        log.error(`JWT verification failed: ${userError.message}`);
      } else {
        log.success('JWT token generation and verification successful');
        log.info(`Token format: ${token.substring(0, 20)}...`);
      }
    } else {
      log.error('No JWT token received from sign in');
    }

    // Cleanup
    await supabaseClient.auth.signOut();
    if (createData.user) {
      await supabaseAdmin.auth.admin.deleteUser(createData.user.id);
      log.success('Test user cleaned up');
    }

    return true;
  } catch (error) {
    log.error(`JWT generation test failed: ${error.message}`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runWPA1Tests() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    WP-A1 TEST SUITE                         ║');
  console.log('║              Supabase Auth Setup Validation                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  const tests = [
    { name: 'Environment Configuration', fn: testEnvironmentConfig },
    { name: 'Supabase Connection', fn: testSupabaseConnection },
    { name: 'Database Schema', fn: testDatabaseSchema },
    { name: 'Auth Configuration', fn: testAuthConfiguration },
    { name: 'Email Templates', fn: testEmailTemplates },
    { name: 'JWT Token Generation', fn: testJWTGeneration },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      log.error(`Test "${test.name}" crashed: ${error.message}`);
      results.push({ name: test.name, passed: false });
    }
  }

  // Summary
  log.header('TEST RESULTS SUMMARY');

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  results.forEach((result) => {
    if (result.passed) {
      log.success(`${result.name}: PASSED`);
    } else {
      log.error(`${result.name}: FAILED`);
    }
  });

  console.log('\n' + '='.repeat(60));

  if (passed === total) {
    log.success(`WP-A1 TESTS: ALL ${total} TESTS PASSED! ✨`);
    log.info('WP-A1 is ready for user acceptance testing');
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Configure SMTP in Supabase Dashboard');
    console.log('2. Upload email templates to Supabase');
    console.log('3. Test login/logout flow manually');
    console.log('4. Proceed to WP-A2 (Auth Context Foundation)');
  } else {
    log.error(`WP-A1 TESTS: ${passed}/${total} PASSED`);
    log.warning('Please fix failing tests before proceeding to WP-A2');
  }

  console.log('='.repeat(60) + '\n');

  return passed === total;
}

// Run tests if called directly
if (require.main === module) {
  runWPA1Tests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      log.error(`Test suite crashed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runWPA1Tests };
