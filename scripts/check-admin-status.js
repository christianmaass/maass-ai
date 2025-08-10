const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdminStatus() {
  console.log('🔍 Checking Admin Status in Database...\n');

  try {
    // Get all admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_profiles')
      .select('id, email, role, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: true });

    if (adminError) {
      console.error('❌ Error fetching admin users:', adminError);
      return;
    }

    console.log('👑 CURRENT ADMIN USERS:');
    console.log('========================');

    if (adminUsers.length === 0) {
      console.log('⚠️  NO ADMIN USERS FOUND!');
      console.log('   You need to manually set a user as admin.');
      console.log('   See instructions below.\n');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString('de-DE')}`);
        console.log('');
      });
    }

    // Get all regular users for reference
    const { data: allUsers, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: true });

    if (!usersError && allUsers) {
      console.log('👥 ALL USERS IN DATABASE:');
      console.log('=========================');
      allUsers.forEach((user, index) => {
        const roleEmoji = user.role === 'admin' ? '👑' : user.role === 'test_user' ? '🧪' : '👤';
        console.log(`${index + 1}. ${roleEmoji} ${user.email} (${user.role})`);
        console.log(`   ID: ${user.id.slice(0, 8)}...`);
        console.log('');
      });
    }

    console.log('🔧 HOW TO MAKE YOURSELF ADMIN:');
    console.log('==============================');
    console.log('1. Find your user ID from the list above');
    console.log('2. Run: node scripts/make-admin.js <your-user-id>');
    console.log('3. Or manually update via Supabase Dashboard');
    console.log('4. Or use the SQL command in the next script\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAdminStatus();
