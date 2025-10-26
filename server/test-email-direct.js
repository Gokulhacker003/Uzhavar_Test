// Direct email test to verify SMTP settings
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('📧 Testing Email Configuration...\n');
console.log('SMTP Settings:');
console.log('  Host:', process.env.SMTP_HOST);
console.log('  Port:', process.env.SMTP_PORT);
console.log('  User:', process.env.SMTP_USER);
console.log('  Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
console.log('  From:', process.env.SMTP_FROM);
console.log('  Secure:', process.env.SMTP_SECURE);
console.log('\n');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: '🧪 Uzhavar Connect - Email Test',
      text: 'This is a test email from Uzhavar Connect server.\n\nIf you receive this, email configuration is working correctly!',
      html: '<h2>✅ Email Test Successful!</h2><p>This is a test email from <strong>Uzhavar Connect</strong> server.</p><p>If you receive this, email configuration is working correctly!</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('\n🎉 Email system is working correctly!');
  } catch (error) {
    console.error('❌ Email test failed!');
    console.error('Error:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.command) console.error('Failed Command:', error.command);
    
    console.log('\n🔧 Troubleshooting:');
    if (error.message.includes('Invalid login')) {
      console.log('   ⚠️  Invalid App Password!');
      console.log('   → Generate a new App Password at: https://myaccount.google.com/apppasswords');
      console.log('   → Make sure 2-Step Verification is enabled for ' + process.env.SMTP_USER);
      console.log('   → Update SMTP_PASS in server/.env with the new 16-character password');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('   ⚠️  Cannot connect to SMTP server!');
      console.log('   → Check your internet connection');
      console.log('   → Verify SMTP_HOST and SMTP_PORT settings');
    }
    process.exit(1);
  }
}

testEmail();
