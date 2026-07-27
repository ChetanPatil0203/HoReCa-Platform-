const { sendApprovalEmail } = require('./src/utils/emailService');

async function test() {
  console.log('Testing sendApprovalEmail...');
  const success = await sendApprovalEmail(process.env.SMTP_USER, 'Test User');
  console.log('Success:', success);
}

test();
