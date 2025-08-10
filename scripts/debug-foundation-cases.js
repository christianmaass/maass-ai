require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function debugFoundationCases() {
  console.log('🔍 Debugging Foundation Cases...');

  try {
    // Check if we can connect to Supabase
    console.log('📡 Testing Supabase connection...');

    const { data: cases, error } = await supabase
      .from('foundation_cases')
      .select('id, title, cluster, tool')
      .order('id');

    if (error) {
      console.error('❌ Error fetching foundation cases:', error);
      return;
    }

    console.log('✅ Successfully connected to Supabase');
    console.log(`📊 Found ${cases?.length || 0} Foundation Cases:`);

    if (cases && cases.length > 0) {
      cases.forEach((case_, index) => {
        console.log(
          `${index + 1}. ID: "${case_.id}" | Title: "${case_.title}" | Tool: "${case_.tool}"`,
        );
      });
    } else {
      console.log('⚠️  No Foundation Cases found in database');
    }

    // Test specific case lookup
    if (cases && cases.length > 0) {
      const firstCaseId = cases[0].id;
      console.log(`\n🧪 Testing specific case lookup for ID: "${firstCaseId}"`);

      const { data: specificCase, error: specificError } = await supabase
        .from('foundation_cases')
        .select('content, title, id')
        .eq('id', firstCaseId)
        .single();

      if (specificError) {
        console.error('❌ Error fetching specific case:', specificError);
      } else {
        console.log('✅ Successfully fetched specific case:', specificCase.title);
        console.log('📄 Content structure keys:', Object.keys(specificCase.content || {}));
      }
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugFoundationCases();
