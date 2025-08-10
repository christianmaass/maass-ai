const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeAdmin(userIdOrEmail) {
  if (!userIdOrEmail) {
    console.error('❌ Usage: node scripts/make-admin.js <user-id-or-email>');
    console.log('   Example: node scripts/make-admin.js christian@example.com');
    console.log('   Example: node scripts/make-admin.js 6fe76262-ade3-41fc-96c5-3d5fffef88a1');
    process.exit(1);
  }

  console.log(`🔧 Making user admin: ${userIdOrEmail}\n`);

  try {
    // First, try to find the user by email or ID
    let user;

    // Check if it's an email (contains @)
    if (userIdOrEmail.includes('@')) {
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', userIdOrEmail)
        .single();

      if (userError) {
        console.error('❌ User not found by email:', userError.message);
        return;
      }
      user = userData;
    } else {
      // Assume it's a user ID
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userIdOrEmail)
        .single();

      if (userError) {
        console.error('❌ User not found by ID:', userError.message);
        return;
      }
      user = userData;
    }

    console.log('👤 Found user:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   ID: ${user.id}\n`);

    // Update user role to admin
    const { data: updatedUser, error: updateError } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating user role:', updateError);
      return;
    }

    console.log('✅ SUCCESS! User is now admin:');
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   New Role: ${updatedUser.role}`);
    console.log(`   ID: ${updatedUser.id}\n`);

    console.log('🎉 You can now access admin features:');
    console.log('   • Admin Panel: /admin');
    console.log('   • Log Dashboard: /admin/logs');
    console.log('   • User Management: Create/Delete test users');
    console.log('   • System Monitoring: Live logs and metrics\n');

    console.log('🔐 Admin Access Verification:');
    console.log('   1. Login with this email in the app');
    console.log('   2. You should see "Admin Panel" in the header navigation');
    console.log('   3. Visit /admin to access admin features');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get command line argument
const userIdOrEmail = process.argv[2];
makeAdmin(userIdOrEmail);
