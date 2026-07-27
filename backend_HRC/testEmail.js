const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Let's see if spaces are handled properly
  },
});

const mailOptions = {
  from: `"HRC HUB Test" <${process.env.SMTP_USER}>`,
  to: process.env.SMTP_USER, // Send to self
  subject: 'Test Email - HRC HUB',
  text: 'This is a test email to verify SMTP settings.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending test email:', error);
  } else {
    console.log('Test email sent successfully:', info.response);
  }
});
