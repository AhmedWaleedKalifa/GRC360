// test-email.js
require('dotenv').config();
const { testEmailConnection, sendVerificationEmail } = require('./utils/emailService');

async function testEmail() {
  console.log('🧪 Testing GRC360 Email Configuration...\n');
  
  // Test 1: Check environment variables
  console.log('1. Checking environment variables...');
  if (!process.env.EMAIL_USER) {
    console.log('❌ EMAIL_USER is not set in .env file');
    return;
  }
  if (!process.env.EMAIL_PASS) {
    console.log('❌ EMAIL_PASS is not set in .env file');
    console.log('💡 For Gmail, you need to:');
    console.log('   - Enable 2-factor authentication');
    console.log('   - Generate an App Password');
    console.log('   - Use the App Password in EMAIL_PASS');
    return;
  }
  console.log('✅ Environment variables found');
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '***' : 'NOT SET'}\n`);
  
  // Test 2: Test connection
  console.log('2. Testing email server connection...');
  const connectionOk = await testEmailConnection();
  if (!connectionOk) {
    return;
  }
  
  // Test 3: Send test verification email
  console.log('\n3. Sending test verification email...');
  try {
    await sendVerificationEmail(process.env.EMAIL_USER, '123456');
    console.log('✅ All email tests passed! Your email configuration is working correctly.');
  } catch (error) {
    console.log('❌ Failed to send test email:', error.message);
  }
}

testEmail();