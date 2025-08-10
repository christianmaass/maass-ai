/**
 * WP-D1: Direct API Testing Script
 * Systematic testing of all 13 migrated backend APIs
 *
 * TESTING SCOPE:
 * - 4 Foundation APIs (withAuth middleware)
 * - 5 Admin APIs (requireRole('admin') middleware)
 * - 4 User APIs (withAuth middleware)
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test configuration
const API_BASE_URL = 'http://localhost:3001/api';
const ADMIN_EMAIL = 'christian@christianmaass.com';
const TEST_USER_EMAIL = 'christian@thomann.de';

/**
 * Generate JWT Token for testing
 */
async function generateJWTToken(email, password = 'test123') {
  try {
    console.log(`🔑 Generating JWT token for: ${email}`);

    // Sign in user to get JWT token
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(`❌ Failed to generate token for ${email}:`, error.message);
      return null;
    }

    console.log(`✅ JWT token generated for: ${email}`);
    return data.session.access_token;
  } catch (error) {
    console.error(`❌ Error generating JWT token:`, error.message);
    return null;
  }
}

/**
 * Test API endpoint
 */
async function testAPIEndpoint(method, endpoint, token, body = null, expectedStatus = 200) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🧪 Testing ${method} ${endpoint}`);

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const responseData = await response.text();

    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    const success = response.status === expectedStatus;
    const statusIcon = success ? '✅' : '❌';

    console.log(
      `${statusIcon} ${method} ${endpoint} - Status: ${response.status} (Expected: ${expectedStatus})`,
    );

    if (!success) {
      console.log(`   Response: ${responseData.substring(0, 200)}...`);
    }

    return {
      endpoint,
      method,
      status: response.status,
      expectedStatus,
      success,
      response: parsedData,
    };
  } catch (error) {
    console.error(`❌ Error testing ${method} ${endpoint}:`, error.message);
    return {
      endpoint,
      method,
      status: 'ERROR',
      expectedStatus,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Test Foundation APIs (withAuth middleware)
 */
async function testFoundationAPIs(userToken) {
  console.log('\n🏗️  TESTING FOUNDATION APIs (withAuth middleware)');
  console.log('='.repeat(60));

  const results = [];

  // 1. GET /api/foundation/cases
  results.push(await testAPIEndpoint('GET', '/foundation/cases', userToken));

  // 2. GET /api/foundation/progress
  results.push(await testAPIEndpoint('GET', '/foundation/progress', userToken));

  // 3. POST /api/foundation/submit
  const submitBody = {
    case_id: 1,
    response_text: 'Test response for API testing',
    response_type: 'text',
  };
  results.push(await testAPIEndpoint('POST', '/foundation/submit', userToken, submitBody));

  // 4. POST /api/foundation/generate-content
  const generateBody = {
    prompt: 'Generate test content for API testing',
    case_id: 1,
  };
  results.push(
    await testAPIEndpoint('POST', '/foundation/generate-content', userToken, generateBody),
  );

  return results;
}

/**
 * Test Admin APIs (requireRole('admin') middleware)
 */
async function testAdminAPIs(adminToken, userToken) {
  console.log('\n👑 TESTING ADMIN APIs (requireRole middleware)');
  console.log('='.repeat(60));

  const results = [];

  // Test with Admin Token (should succeed)
  console.log('\n🔑 Testing with ADMIN token (should succeed):');

  // 1. GET /api/admin/users
  results.push(await testAPIEndpoint('GET', '/admin/users', adminToken));

  // 2. GET /api/admin/check-role
  results.push(await testAPIEndpoint('GET', '/admin/check-role', adminToken));

  // 3. GET /api/admin/logs
  results.push(await testAPIEndpoint('GET', '/admin/logs', adminToken));

  // 4. POST /api/admin/create-test-user-direct
  const createUserBody = {
    email: `test-${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    role: 'test_user',
  };
  results.push(
    await testAPIEndpoint(
      'POST',
      '/admin/create-test-user-direct',
      adminToken,
      createUserBody,
      201,
    ),
  );

  // Test with User Token (should fail with 403)
  console.log('\n🚫 Testing with USER token (should fail with 403):');

  // 5. GET /api/admin/users (should fail)
  results.push(await testAPIEndpoint('GET', '/admin/users', userToken, null, 403));

  // 6. GET /api/admin/check-role (should fail)
  results.push(await testAPIEndpoint('GET', '/admin/check-role', userToken, null, 403));

  return results;
}

/**
 * Test User APIs (withAuth middleware)
 */
async function testUserAPIs(userToken) {
  console.log('\n👤 TESTING USER APIs (withAuth middleware)');
  console.log('='.repeat(60));

  const results = [];

  // 1. GET /api/user-tariff
  results.push(await testAPIEndpoint('GET', '/user-tariff', userToken));

  // 2. GET /api/test-user/[userId] (use a test user ID)
  results.push(await testAPIEndpoint('GET', '/test-user/test-user-123', userToken));

  // 3. PUT /api/user/update-profile
  const updateProfileBody = {
    first_name: 'Updated',
    last_name: 'Name',
  };
  results.push(await testAPIEndpoint('PUT', '/user/update-profile', userToken, updateProfileBody));

  // 4. GET /api/cases/user-case-history (newly created)
  results.push(await testAPIEndpoint('GET', '/cases/user-case-history', userToken));

  return results;
}

/**
 * Test Authentication (should fail without token)
 */
async function testAuthenticationFailures() {
  console.log('\n🔒 TESTING AUTHENTICATION FAILURES (should fail with 401)');
  console.log('='.repeat(60));

  const results = [];

  // Test without token (should fail with 401)
  results.push(await testAPIEndpoint('GET', '/foundation/cases', null, null, 401));
  results.push(await testAPIEndpoint('GET', '/admin/users', null, null, 401));
  results.push(await testAPIEndpoint('GET', '/user-tariff', null, null, 401));

  return results;
}

/**
 * Main testing function
 */
async function runAPITests() {
  console.log('🚀 WP-D1: Direct API Testing Started');
  console.log('Testing all 13 migrated backend APIs');
  console.log('='.repeat(60));

  try {
    // Generate JWT tokens
    console.log('\n🔑 GENERATING JWT TOKENS');
    console.log('='.repeat(60));

    const adminToken = await generateJWTToken(ADMIN_EMAIL);
    const userToken = await generateJWTToken(TEST_USER_EMAIL);

    if (!adminToken || !userToken) {
      console.error('❌ Failed to generate required JWT tokens. Exiting.');
      return;
    }

    // Run all tests
    const allResults = [];

    // Test Foundation APIs
    const foundationResults = await testFoundationAPIs(userToken);
    allResults.push(...foundationResults);

    // Test Admin APIs
    const adminResults = await testAdminAPIs(adminToken, userToken);
    allResults.push(...adminResults);

    // Test User APIs
    const userResults = await testUserAPIs(userToken);
    allResults.push(...userResults);

    // Test Authentication Failures
    const authFailureResults = await testAuthenticationFailures();
    allResults.push(...authFailureResults);

    // Generate summary
    console.log('\n📊 WP-D1 API TESTING SUMMARY');
    console.log('='.repeat(60));

    const totalTests = allResults.length;
    const successfulTests = allResults.filter((r) => r.success).length;
    const failedTests = totalTests - successfulTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Successful: ${successfulTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((successfulTests / totalTests) * 100).toFixed(1)}%`);

    // List failed tests
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      allResults
        .filter((r) => !r.success)
        .forEach((result) => {
          console.log(
            `   ${result.method} ${result.endpoint} - Status: ${result.status} (Expected: ${result.expectedStatus})`,
          );
        });
    }

    console.log('\n🎯 WP-D1: Direct API Testing Completed');
  } catch (error) {
    console.error('❌ Fatal error during API testing:', error);
  }
}

// Run tests if called directly
if (require.main === module) {
  runAPITests();
}

module.exports = {
  runAPITests,
  testFoundationAPIs,
  testAdminAPIs,
  testUserAPIs,
  testAuthenticationFailures,
};
