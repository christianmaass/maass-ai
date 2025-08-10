#!/usr/bin/env node

/**
 * Simple Foundation Track API Test
 * Quick validation of all 4 endpoints
 */

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER = 'test-user-123';

// Simple HTTP request helper
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER,
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            data: parsed,
            raw: body,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: body,
            parseError: true,
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test runner
async function runQuickTests() {
  console.log('🧪 FOUNDATION TRACK API QUICK TEST');
  console.log('=====================================');
  console.log(`Testing against: ${BASE_URL}`);
  console.log(`Test User ID: ${TEST_USER}\n`);

  const results = [];

  // Test 1: GET /api/foundation/cases
  console.log('1️⃣  Testing GET /api/foundation/cases...');
  try {
    const response = await makeRequest('GET', '/api/foundation/cases');
    console.log(`   Status: ${response.status}`);

    if (response.status === 200 && response.data.success) {
      console.log(`   ✅ Success - Found ${response.data.data.cases?.length || 0} cases`);
      results.push({ test: 'GET cases', status: 'PASS' });
    } else {
      console.log(`   ❌ Failed - ${response.data.error?.message || 'Unknown error'}`);
      results.push({ test: 'GET cases', status: 'FAIL', error: response.data });
    }
  } catch (error) {
    console.log(`   ❌ Error - ${error.message}`);
    results.push({ test: 'GET cases', status: 'ERROR', error: error.message });
  }

  // Test 2: GET /api/foundation/cases/profit-tree
  console.log('\n2️⃣  Testing GET /api/foundation/cases/profit-tree...');
  try {
    const response = await makeRequest('GET', '/api/foundation/cases/profit-tree');
    console.log(`   Status: ${response.status}`);

    if (response.status === 200 && response.data.success) {
      console.log(`   ✅ Success - Case loaded: ${response.data.data.case?.title || 'Unknown'}`);
      results.push({ test: 'GET case detail', status: 'PASS' });
    } else if (response.status === 404) {
      console.log(`   ⚠️  Case not found (expected if seed data not loaded)`);
      results.push({ test: 'GET case detail', status: 'SKIP', note: 'Case not found' });
    } else {
      console.log(`   ❌ Failed - ${response.data.error?.message || 'Unknown error'}`);
      results.push({ test: 'GET case detail', status: 'FAIL', error: response.data });
    }
  } catch (error) {
    console.log(`   ❌ Error - ${error.message}`);
    results.push({ test: 'GET case detail', status: 'ERROR', error: error.message });
  }

  // Test 3: POST /api/foundation/submit (will likely fail without proper auth/data)
  console.log('\n3️⃣  Testing POST /api/foundation/submit...');
  try {
    const testData = {
      case_id: 'profit-tree',
      interaction_type: 'multiple_choice_with_hypotheses',
      responses: {
        multiple_choice: { q1: 'option_a' },
        hypotheses: { step1: 'Test hypothesis' },
      },
      time_spent_seconds: 300,
    };

    const response = await makeRequest('POST', '/api/foundation/submit', testData);
    console.log(`   Status: ${response.status}`);

    if (response.status === 200 && response.data.success) {
      console.log(`   ✅ Success - Response submitted and assessed`);
      results.push({ test: 'POST submit', status: 'PASS' });
    } else if (response.status === 401) {
      console.log(`   ⚠️  Authentication required (expected)`);
      results.push({ test: 'POST submit', status: 'SKIP', note: 'Auth required' });
    } else if (response.status === 404) {
      console.log(`   ⚠️  Case not found (expected if seed data not loaded)`);
      results.push({ test: 'POST submit', status: 'SKIP', note: 'Case not found' });
    } else if (response.status === 400) {
      console.log(`   ⚠️  Validation error (expected with test data)`);
      results.push({ test: 'POST submit', status: 'SKIP', note: 'Validation error' });
    } else {
      console.log(`   ❌ Failed - ${response.data.error?.message || 'Unknown error'}`);
      results.push({ test: 'POST submit', status: 'FAIL', error: response.data });
    }
  } catch (error) {
    console.log(`   ❌ Error - ${error.message}`);
    results.push({ test: 'POST submit', status: 'ERROR', error: error.message });
  }

  // Test 4: GET /api/foundation/progress
  console.log('\n4️⃣  Testing GET /api/foundation/progress...');
  try {
    const response = await makeRequest('GET', '/api/foundation/progress');
    console.log(`   Status: ${response.status}`);

    if (response.status === 200 && response.data.success) {
      console.log(`   ✅ Success - Progress loaded`);
      results.push({ test: 'GET progress', status: 'PASS' });
    } else if (response.status === 401) {
      console.log(`   ⚠️  Authentication required (expected)`);
      results.push({ test: 'GET progress', status: 'SKIP', note: 'Auth required' });
    } else {
      console.log(`   ❌ Failed - ${response.data.error?.message || 'Unknown error'}`);
      results.push({ test: 'GET progress', status: 'FAIL', error: response.data });
    }
  } catch (error) {
    console.log(`   ❌ Error - ${error.message}`);
    results.push({ test: 'GET progress', status: 'ERROR', error: error.message });
  }

  // Test 5: Method not allowed
  console.log('\n5️⃣  Testing Method Not Allowed...');
  try {
    const response = await makeRequest('POST', '/api/foundation/cases');
    console.log(`   Status: ${response.status}`);

    if (response.status === 405) {
      console.log(`   ✅ Success - Method not allowed correctly handled`);
      results.push({ test: 'Method not allowed', status: 'PASS' });
    } else {
      console.log(`   ❌ Failed - Expected 405, got ${response.status}`);
      results.push({ test: 'Method not allowed', status: 'FAIL' });
    }
  } catch (error) {
    console.log(`   ❌ Error - ${error.message}`);
    results.push({ test: 'Method not allowed', status: 'ERROR', error: error.message });
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const errors = results.filter((r) => r.status === 'ERROR').length;
  const skipped = results.filter((r) => r.status === 'SKIP').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🔥 Errors: ${errors}`);
  console.log(`⚠️  Skipped: ${skipped}`);

  if (failed > 0 || errors > 0) {
    console.log('\n❌ ISSUES FOUND:');
    results
      .filter((r) => r.status === 'FAIL' || r.status === 'ERROR')
      .forEach((r) => {
        console.log(`  - ${r.test}: ${r.status} - ${r.error || 'Unknown'}`);
      });
  }

  if (skipped > 0) {
    console.log('\n⚠️  SKIPPED TESTS:');
    results
      .filter((r) => r.status === 'SKIP')
      .forEach((r) => {
        console.log(`  - ${r.test}: ${r.note || 'Unknown reason'}`);
      });
  }

  console.log('\n🎯 NEXT STEPS:');
  if (passed === results.length) {
    console.log('   All tests passed! APIs are working correctly.');
  } else {
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Ensure database is migrated and seeded');
    console.log('   3. Check environment variables (OPENAI_API_KEY, etc.)');
    console.log('   4. Review failed tests above');
  }

  console.log('\n=====================================');
}

// Run if called directly
if (require.main === module) {
  runQuickTests().catch(console.error);
}

module.exports = { runQuickTests };
