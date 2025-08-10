// =====================================================
// TEST SCRIPT: COURSES API MIT FOUNDATION CASES
// =====================================================
// Testet den erweiterten /api/courses Endpunkt

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function testCoursesAPI() {
  console.log('🚀 TESTING COURSES API MIT FOUNDATION CASES');
  console.log('==========================================');

  try {
    // Test 1: Direkte Datenbankabfrage - Courses
    console.log('\n📋 TEST 1: Courses Tabelle');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true);

    if (coursesError) {
      console.error('❌ Courses Error:', coursesError);
      return;
    }

    console.log(`✅ Courses gefunden: ${courses?.length || 0}`);
    courses?.forEach((course) => {
      console.log(`   - ${course.name} (${course.slug})`);
    });

    // Test 2: Foundation Cases Zuordnung
    console.log('\n📋 TEST 2: Foundation Cases Zuordnung');
    const { data: foundationCases, error: fcError } = await supabase
      .from('course_foundation_cases')
      .select(
        `
        course_id,
        foundation_case_id,
        sequence_order,
        foundation_cases (
          id,
          title,
          difficulty
        )
      `,
      )
      .eq('is_required', true)
      .order('sequence_order', { ascending: true });

    if (fcError) {
      console.error('❌ Foundation Cases Error:', fcError);
      return;
    }

    console.log(`✅ Foundation Cases Zuordnungen: ${foundationCases?.length || 0}`);

    // Gruppiere nach Kurs
    const casesByCourse = {};
    foundationCases?.forEach((fc) => {
      if (!casesByCourse[fc.course_id]) {
        casesByCourse[fc.course_id] = [];
      }
      casesByCourse[fc.course_id].push(fc);
    });

    Object.entries(casesByCourse).forEach(([courseId, cases]) => {
      const course = courses?.find((c) => c.id === courseId);
      console.log(`\n   📚 ${course?.name || courseId}:`);
      cases.forEach((fc) => {
        const foundationCase = Array.isArray(fc.foundation_cases)
          ? fc.foundation_cases[0]
          : fc.foundation_cases;
        console.log(
          `      ${fc.sequence_order}. ${foundationCase?.title} (Difficulty: ${foundationCase?.difficulty})`,
        );
      });
    });

    // Test 3: Simuliere API-Response Format
    console.log('\n📋 TEST 3: API Response Format Simulation');
    const apiResponse = courses?.map((course) => {
      const courseCases = foundationCases?.filter((fc) => fc.course_id === course.id) || [];
      const formattedCases = courseCases.map((fc) => {
        const foundationCase = Array.isArray(fc.foundation_cases)
          ? fc.foundation_cases[0]
          : fc.foundation_cases;
        return {
          case_id: fc.foundation_case_id,
          title: foundationCase?.title || '',
          difficulty: foundationCase?.difficulty || 0,
          sequence_order: fc.sequence_order,
        };
      });

      return {
        id: course.id,
        slug: course.slug,
        name: course.name,
        description: course.description,
        foundation_cases: formattedCases,
        foundation_cases_count: formattedCases.length,
        user_enrolled: false, // Würde in echter API aus user_course_enrollments kommen
      };
    });

    console.log('✅ API Response Format:');
    apiResponse?.forEach((course) => {
      console.log(`\n   📚 ${course.name}:`);
      console.log(`      - Foundation Cases: ${course.foundation_cases_count}`);
      console.log(`      - User Enrolled: ${course.user_enrolled}`);
      if (course.foundation_cases && course.foundation_cases.length > 0) {
        console.log(`      - Erste 3 Cases:`);
        course.foundation_cases.slice(0, 3).forEach((fc) => {
          console.log(`         ${fc.sequence_order}. ${fc.title} (Difficulty: ${fc.difficulty})`);
        });
      }
    });

    // Test 4: Validierung
    console.log('\n📋 TEST 4: Validierung');
    const strategyTrack = apiResponse?.find((c) => c.slug === 'strategy-track');
    if (strategyTrack) {
      console.log(
        `✅ Strategy Track gefunden: ${strategyTrack.foundation_cases_count} Foundation Cases`,
      );
      if (strategyTrack.foundation_cases_count === 12) {
        console.log('✅ Korrekte Anzahl Foundation Cases (12)');
      } else {
        console.log(
          `❌ Falsche Anzahl Foundation Cases: ${strategyTrack.foundation_cases_count} (erwartet: 12)`,
        );
      }
    } else {
      console.log('❌ Strategy Track nicht gefunden');
    }

    console.log('\n==========================================');
    console.log('🎉 COURSES API TEST ABGESCHLOSSEN');
    console.log('==========================================');
  } catch (error) {
    console.error('❌ Unerwarteter Fehler:', error);
  }
}

// Führe Test aus
testCoursesAPI()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test fehlgeschlagen:', error);
    process.exit(1);
  });
