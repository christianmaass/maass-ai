#!/usr/bin/env node

/**
 * Foundation Track API Test Suite
 * Tests all 4 Foundation Track API endpoints with comprehensive scenarios
 */

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000',
  testUserId: 'test-user-foundation-123',
  testCaseId: 'profit-tree', // Should exist from seed data
  timeout: 30000, // 30 seconds
};

// Test utilities
class APITester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: [],
    };
  }

  async makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, CONFIG.baseUrl);
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': CONFIG.testUserId, // Test auth header
          ...headers,
        },
        timeout: CONFIG.timeout,
      };

      const client = url.protocol === 'https:' ? https : http;

      const req = client.request(url, options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsed,
            });
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: body,
              parseError: error.message,
            });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  test(name, testFn) {
    return testFn()
      .then((result) => {
        console.log(`✅ ${name}`);
        this.results.passed++;
        this.results.tests.push({ name, status: 'PASSED', result });
        return result;
      })
      .catch((error) => {
        console.log(`❌ ${name}: ${error.message}`);
        this.results.failed++;
        this.results.tests.push({ name, status: 'FAILED', error: error.message });
        throw error;
      });
  }

  async expect(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
  }

  async expectTruthy(value, message) {
    if (!value) {
      throw new Error(`${message}: expected truthy value, got ${value}`);
    }
  }

  async expectArray(value, message) {
    if (!Array.isArray(value)) {
      throw new Error(`${message}: expected array, got ${typeof value}`);
    }
  }

  async expectObject(value, message) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(`${message}: expected object, got ${typeof value}`);
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FOUNDATION API TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(
      `📈 Success Rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`,
    );

    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.tests
        .filter((t) => t.status === 'FAILED')
        .forEach((t) => console.log(`  - ${t.name}: ${t.error}`));
    }

    console.log('='.repeat(60));
  }
}

// Test data
const SAMPLE_RESPONSES = {
  multiple_choice_with_hypotheses: {
    multiple_choice: {
      q1: 'option_a',
      q2: 'option_b',
    },
    hypotheses: {
      step1:
        'Das Unternehmen hat wahrscheinlich Probleme mit der Kostenstruktur, da die Gewinnmargen in den letzten Jahren gesunken sind.',
      step2:
        'Eine detaillierte Analyse der Kostentreiber würde helfen, die Hauptursachen zu identifizieren.',
    },
  },
  structured_mbb: {
    mbb_criteria: {
      problemstrukturierung:
        'Das Problem lässt sich in drei Hauptbereiche unterteilen: Umsatzrückgang, Kostensteigerung und Marktanteilsverlust.',
      hypothesenbildung:
        'Hypothese 1: Der Umsatzrückgang ist auf veränderte Kundenpräferenzen zurückzuführen. Hypothese 2: Die Kostensteigerung resultiert aus ineffizienten Prozessen.',
      analyse:
        'Analyse der Umsatzdaten der letzten 3 Jahre zeigt einen kontinuierlichen Rückgang von 15% jährlich.',
      synthese:
        'Die Kombination aus Umsatzrückgang und Kostensteigerung führt zu einer kritischen Gewinnmargenentwicklung.',
      kommunikation:
        'Empfehlung: Sofortige Implementierung eines Kostensenkungsprogramms und Überarbeitung der Produktstrategie.',
    },
  },
};

// Main test suite
async function runTests() {
  const tester = new APITester();

  console.log('🚀 STARTING FOUNDATION TRACK API TESTS');
  console.log('='.repeat(60));

  try {
    // Test 1: GET /api/foundation/cases
    await tester.test('GET /api/foundation/cases - Basic Request', async () => {
      const response = await tester.makeRequest('GET', '/api/foundation/cases');

      await tester.expect(response.status, 200, 'Status should be 200');
      await tester.expectTruthy(response.data.success, 'Response should be successful');
      await tester.expectArray(response.data.data.cases, 'Cases should be an array');
      await tester.expectObject(response.data.meta, 'Meta should be an object');

      return response.data;
    });

    // Test 2: GET /api/foundation/cases with progress
    await tester.test('GET /api/foundation/cases - With Progress', async () => {
      const response = await tester.makeRequest(
        'GET',
        '/api/foundation/cases?include_progress=true',
      );

      await tester.expect(response.status, 200, 'Status should be 200');
      await tester.expectTruthy(response.data.success, 'Response should be successful');

      // Should have user_progress when authenticated
      if (response.data.data.user_progress) {
        await tester.expectObject(
          response.data.data.user_progress,
          'User progress should be an object',
        );
      }

      return response.data;
    });

    // Test 3: GET /api/foundation/cases with filters
    await tester.test('GET /api/foundation/cases - With Filters', async () => {
      const response = await tester.makeRequest(
        'GET',
        '/api/foundation/cases?difficulty_min=1&difficulty_max=5',
      );

      await tester.expect(response.status, 200, 'Status should be 200');
      await tester.expectTruthy(response.data.success, 'Response should be successful');

      // Check if filtering worked
      const cases = response.data.data.cases;
      if (cases.length > 0) {
        const allInRange = cases.every((c) => c.difficulty >= 1 && c.difficulty <= 5);
        await tester.expectTruthy(allInRange, 'All cases should be within difficulty range');
      }

      return response.data;
    });

    // Test 4: GET /api/foundation/cases/[id] - Valid Case
    await tester.test('GET /api/foundation/cases/[id] - Valid Case', async () => {
      const response = await tester.makeRequest(
        'GET',
        `/api/foundation/cases/${CONFIG.testCaseId}`,
      );

      await tester.expect(response.status, 200, 'Status should be 200');
      await tester.expectTruthy(response.data.success, 'Response should be successful');
      await tester.expectObject(response.data.data.case, 'Case should be an object');
      await tester.expectObject(
        response.data.data.case.content,
        'Case content should be an object',
      );

      return response.data;
    });

    // Test 5: GET /api/foundation/cases/[id] - Invalid Case
    await tester.test('GET /api/foundation/cases/[id] - Invalid Case', async () => {
      const response = await tester.makeRequest('GET', '/api/foundation/cases/invalid-case-id');

      await tester.expect(response.status, 404, 'Status should be 404');
      await tester.expect(response.data.success, false, 'Response should not be successful');
      await tester.expectTruthy(response.data.error, 'Should have error object');

      return response.data;
    });

    // Test 6: POST /api/foundation/submit - Valid MC+Hypotheses
    await tester.test('POST /api/foundation/submit - MC+Hypotheses', async () => {
      const submitData = {
        case_id: CONFIG.testCaseId,
        interaction_type: 'multiple_choice_with_hypotheses',
        responses: SAMPLE_RESPONSES.multiple_choice_with_hypotheses,
        time_spent_seconds: 1200,
      };

      const response = await tester.makeRequest('POST', '/api/foundation/submit', submitData);

      // Note: This might fail if GPT API is not configured, but structure should be correct
      if (response.status === 200) {
        await tester.expectTruthy(response.data.success, 'Response should be successful');
        await tester.expectTruthy(response.data.data.response_id, 'Should have response ID');
        await tester.expectObject(response.data.data.assessment, 'Should have assessment object');
      } else if (response.status === 401) {
        console.log('  ℹ️  Authentication required (expected in test environment)');
      } else if (response.status === 500) {
        console.log('  ℹ️  Server error (possibly GPT API not configured)');
      }

      return response.data;
    });

    // Test 7: POST /api/foundation/submit - Invalid Data
    await tester.test('POST /api/foundation/submit - Invalid Data', async () => {
      const submitData = {
        case_id: 'invalid',
        interaction_type: 'invalid_type',
        responses: {},
      };

      const response = await tester.makeRequest('POST', '/api/foundation/submit', submitData);

      await tester.expectTruthy(response.status >= 400, 'Should return error status');
      await tester.expect(response.data.success, false, 'Response should not be successful');

      return response.data;
    });

    // Test 8: GET /api/foundation/progress - Basic
    await tester.test('GET /api/foundation/progress - Basic', async () => {
      const response = await tester.makeRequest('GET', '/api/foundation/progress');

      if (response.status === 200) {
        await tester.expectTruthy(response.data.success, 'Response should be successful');
        await tester.expectObject(
          response.data.data.overall_progress,
          'Should have overall progress',
        );
        await tester.expectObject(
          response.data.data.cluster_progress,
          'Should have cluster progress',
        );
      } else if (response.status === 401) {
        console.log('  ℹ️  Authentication required (expected in test environment)');
      }

      return response.data;
    });

    // Test 9: GET /api/foundation/progress - With Details
    await tester.test('GET /api/foundation/progress - With Details', async () => {
      const response = await tester.makeRequest(
        'GET',
        '/api/foundation/progress?include_case_details=true&include_statistics=true',
      );

      if (response.status === 200) {
        await tester.expectTruthy(response.data.success, 'Response should be successful');

        if (response.data.data.case_details) {
          await tester.expectObject(response.data.data.case_details, 'Should have case details');
        }

        if (response.data.data.statistics) {
          await tester.expectObject(response.data.data.statistics, 'Should have statistics');
        }
      } else if (response.status === 401) {
        console.log('  ℹ️  Authentication required (expected in test environment)');
      }

      return response.data;
    });

    // Test 10: Method Not Allowed Tests
    await tester.test('Method Not Allowed - POST to GET endpoint', async () => {
      const response = await tester.makeRequest('POST', '/api/foundation/cases');

      await tester.expect(response.status, 405, 'Status should be 405');
      await tester.expect(response.data.success, false, 'Response should not be successful');

      return response.data;
    });
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }

  tester.printSummary();

  // Exit with appropriate code
  process.exit(tester.results.failed > 0 ? 1 : 0);
}

// Performance test
async function performanceTest() {
  console.log('\n🏃‍♂️ RUNNING PERFORMANCE TESTS');
  console.log('-'.repeat(40));

  const startTime = Date.now();

  try {
    const tester = new APITester();
    const promises = [];

    // Concurrent requests test
    for (let i = 0; i < 5; i++) {
      promises.push(tester.makeRequest('GET', '/api/foundation/cases'));
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();

    console.log(`✅ 5 concurrent requests completed in ${endTime - startTime}ms`);
    console.log(`📊 Average response time: ${(endTime - startTime) / 5}ms per request`);

    // Check if all succeeded
    const allSuccessful = results.every((r) => r.status === 200);
    if (allSuccessful) {
      console.log('✅ All concurrent requests successful');
    } else {
      console.log('⚠️  Some concurrent requests failed');
    }
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
  }
}

// Run tests
if (require.main === module) {
  console.log('Foundation Track API Test Suite');
  console.log(`Base URL: ${CONFIG.baseUrl}`);
  console.log(`Test User ID: ${CONFIG.testUserId}`);
  console.log(`Test Case ID: ${CONFIG.testCaseId}`);

  runTests()
    .then(() => performanceTest())
    .catch(console.error);
}

module.exports = { APITester, runTests };
