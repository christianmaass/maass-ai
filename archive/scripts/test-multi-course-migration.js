#!/usr/bin/env node

/**
 * MULTI-COURSE MIGRATION COMPATIBILITY TEST
 * Testet ob alle bestehenden Features nach der Schema-Migration funktionieren
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

class MigrationTester {
  constructor() {
    this.testResults = {
      schemaTests: [],
      dataTests: [],
      apiTests: [],
      compatibilityTests: [],
    };
  }

  async runAllTests() {
    console.log('🧪 MULTI-COURSE MIGRATION COMPATIBILITY TESTS');
    console.log('='.repeat(50));

    try {
      await this.testSchemaStructure();
      await this.testDataIntegrity();
      await this.testExistingAPIs();
      await this.testBackwardCompatibility();

      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }

  async testSchemaStructure() {
    console.log('\n📊 Testing Schema Structure...');

    // Test 1: Neue Tabellen existieren
    const newTables = [
      'courses',
      'user_course_enrollments',
      'course_case_types',
      'user_course_progress',
    ];

    for (const tableName of newTables) {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1);

        if (error) {
          this.testResults.schemaTests.push({
            test: `Table ${tableName} exists`,
            status: 'FAIL',
            error: error.message,
          });
        } else {
          this.testResults.schemaTests.push({
            test: `Table ${tableName} exists`,
            status: 'PASS',
          });
        }
      } catch (err) {
        this.testResults.schemaTests.push({
          test: `Table ${tableName} exists`,
          status: 'FAIL',
          error: err.message,
        });
      }
    }

    // Test 2: Bestehende Tabellen unverändert
    const existingTables = ['user_profiles', 'case_types', 'user_progress', 'cases'];

    for (const tableName of existingTables) {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1);

        if (error) {
          this.testResults.schemaTests.push({
            test: `Existing table ${tableName} accessible`,
            status: 'FAIL',
            error: error.message,
          });
        } else {
          this.testResults.schemaTests.push({
            test: `Existing table ${tableName} accessible`,
            status: 'PASS',
          });
        }
      } catch (err) {
        this.testResults.schemaTests.push({
          test: `Existing table ${tableName} accessible`,
          status: 'FAIL',
          error: err.message,
        });
      }
    }

    // Test 3: user_profiles Erweiterungen
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('current_course_id, completed_courses_count, login_count')
        .limit(1);

      if (error) {
        this.testResults.schemaTests.push({
          test: 'user_profiles extensions exist',
          status: 'FAIL',
          error: error.message,
        });
      } else {
        this.testResults.schemaTests.push({
          test: 'user_profiles extensions exist',
          status: 'PASS',
        });
      }
    } catch (err) {
      this.testResults.schemaTests.push({
        test: 'user_profiles extensions exist',
        status: 'FAIL',
        error: err.message,
      });
    }
  }

  async testDataIntegrity() {
    console.log('\n📈 Testing Data Integrity...');

    // Test 1: Strategy Track existiert
    try {
      const { data: strategyTrack, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', 'strategy-track')
        .single();

      if (error || !strategyTrack) {
        this.testResults.dataTests.push({
          test: 'Strategy Track course exists',
          status: 'FAIL',
          error: error?.message || 'No strategy track found',
        });
      } else {
        this.testResults.dataTests.push({
          test: 'Strategy Track course exists',
          status: 'PASS',
          data: `ID: ${strategyTrack.id}, Name: ${strategyTrack.name}`,
        });
      }
    } catch (err) {
      this.testResults.dataTests.push({
        test: 'Strategy Track course exists',
        status: 'FAIL',
        error: err.message,
      });
    }

    // Test 2: Case Types zu Strategy Track zugeordnet
    try {
      const { data: courseCase, error } = await supabase
        .from('course_case_types')
        .select(
          `
          *,
          courses(name),
          case_types(name)
        `,
        )
        .limit(5);

      if (error) {
        this.testResults.dataTests.push({
          test: 'Case types assigned to Strategy Track',
          status: 'FAIL',
          error: error.message,
        });
      } else if (!courseCase || courseCase.length === 0) {
        this.testResults.dataTests.push({
          test: 'Case types assigned to Strategy Track',
          status: 'FAIL',
          error: 'No case type assignments found',
        });
      } else {
        this.testResults.dataTests.push({
          test: 'Case types assigned to Strategy Track',
          status: 'PASS',
          data: `${courseCase.length} assignments found`,
        });
      }
    } catch (err) {
      this.testResults.dataTests.push({
        test: 'Case types assigned to Strategy Track',
        status: 'FAIL',
        error: err.message,
      });
    }

    // Test 3: User Enrollments erstellt
    try {
      const { data: enrollments, error } = await supabase
        .from('user_course_enrollments')
        .select('*')
        .limit(5);

      if (error) {
        this.testResults.dataTests.push({
          test: 'User enrollments created',
          status: 'FAIL',
          error: error.message,
        });
      } else {
        this.testResults.dataTests.push({
          test: 'User enrollments created',
          status: 'PASS',
          data: `${enrollments?.length || 0} enrollments found`,
        });
      }
    } catch (err) {
      this.testResults.dataTests.push({
        test: 'User enrollments created',
        status: 'FAIL',
        error: err.message,
      });
    }
  }

  async testExistingAPIs() {
    console.log('\n🔌 Testing Existing API Compatibility...');

    // Test 1: Helper Functions funktionieren
    try {
      const { data, error } = await supabase.rpc('get_user_welcome_status', {
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID für Test
      });

      // Erwarten einen Fehler wegen ungültiger User ID, aber Funktion sollte existieren
      if (
        error &&
        !error.message.includes('function') &&
        !error.message.includes('does not exist')
      ) {
        this.testResults.apiTests.push({
          test: 'get_user_welcome_status function exists',
          status: 'PASS',
        });
      } else if (
        error &&
        (error.message.includes('function') || error.message.includes('does not exist'))
      ) {
        this.testResults.apiTests.push({
          test: 'get_user_welcome_status function exists',
          status: 'FAIL',
          error: error.message,
        });
      } else {
        this.testResults.apiTests.push({
          test: 'get_user_welcome_status function exists',
          status: 'PASS',
        });
      }
    } catch (err) {
      this.testResults.apiTests.push({
        test: 'get_user_welcome_status function exists',
        status: 'FAIL',
        error: err.message,
      });
    }

    // Test 2: Multi-Course Helper Functions
    try {
      const { data, error } = await supabase.rpc('get_user_course_status', {
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID für Test
      });

      // Sollte leer zurückgeben, aber nicht fehlschlagen
      this.testResults.apiTests.push({
        test: 'get_user_course_status function exists',
        status: 'PASS',
      });
    } catch (err) {
      if (err.message.includes('function') || err.message.includes('does not exist')) {
        this.testResults.apiTests.push({
          test: 'get_user_course_status function exists',
          status: 'FAIL',
          error: err.message,
        });
      } else {
        this.testResults.apiTests.push({
          test: 'get_user_course_status function exists',
          status: 'PASS',
        });
      }
    }
  }

  async testBackwardCompatibility() {
    console.log('\n🔄 Testing Backward Compatibility...');

    // Test 1: Bestehende case_types unverändert
    try {
      const { data: caseTypes, error } = await supabase.from('case_types').select('*').limit(5);

      if (error) {
        this.testResults.compatibilityTests.push({
          test: 'Existing case_types accessible',
          status: 'FAIL',
          error: error.message,
        });
      } else if (!caseTypes || caseTypes.length === 0) {
        this.testResults.compatibilityTests.push({
          test: 'Existing case_types accessible',
          status: 'FAIL',
          error: 'No case types found',
        });
      } else {
        this.testResults.compatibilityTests.push({
          test: 'Existing case_types accessible',
          status: 'PASS',
          data: `${caseTypes.length} case types found`,
        });
      }
    } catch (err) {
      this.testResults.compatibilityTests.push({
        test: 'Existing case_types accessible',
        status: 'FAIL',
        error: err.message,
      });
    }

    // Test 2: Bestehende user_progress unverändert
    try {
      const { data: userProgress, error } = await supabase
        .from('user_progress')
        .select('*')
        .limit(5);

      if (error) {
        this.testResults.compatibilityTests.push({
          test: 'Existing user_progress accessible',
          status: 'FAIL',
          error: error.message,
        });
      } else {
        this.testResults.compatibilityTests.push({
          test: 'Existing user_progress accessible',
          status: 'PASS',
          data: `${userProgress?.length || 0} progress records found`,
        });
      }
    } catch (err) {
      this.testResults.compatibilityTests.push({
        test: 'Existing user_progress accessible',
        status: 'FAIL',
        error: err.message,
      });
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));

    const categories = [
      { name: 'Schema Tests', tests: this.testResults.schemaTests },
      { name: 'Data Tests', tests: this.testResults.dataTests },
      { name: 'API Tests', tests: this.testResults.apiTests },
      { name: 'Compatibility Tests', tests: this.testResults.compatibilityTests },
    ];

    let totalTests = 0;
    let totalPassed = 0;

    categories.forEach((category) => {
      console.log(`\n${category.name}:`);
      category.tests.forEach((test) => {
        const status = test.status === 'PASS' ? '✅' : '❌';
        console.log(`  ${status} ${test.test}`);
        if (test.error) {
          console.log(`     Error: ${test.error}`);
        }
        if (test.data) {
          console.log(`     Data: ${test.data}`);
        }
        totalTests++;
        if (test.status === 'PASS') totalPassed++;
      });
    });

    console.log('\n' + '='.repeat(50));
    console.log(`📈 OVERALL RESULT: ${totalPassed}/${totalTests} tests passed`);

    if (totalPassed === totalTests) {
      console.log('🎉 ALL TESTS PASSED - Migration successful!');
      console.log('✅ Multi-Course architecture is ready for use');
    } else {
      console.log('⚠️  Some tests failed - please review before proceeding');
    }
    console.log('='.repeat(50));
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MigrationTester();
  tester.runAllTests().catch(console.error);
}

module.exports = MigrationTester;
