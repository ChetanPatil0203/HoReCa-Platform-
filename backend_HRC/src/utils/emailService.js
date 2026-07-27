const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'smtp.mailtrap.io', 'sendgrid', etc.
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an OTP email to the user
 * @param {string} toEmail - The recipient's email address
 * @param {string} otpCode - The 6-digit OTP code
 */
const sendOTPEmail = async (toEmail, otpCode) => {
  try {
    const mailOptions = {
      from: `"HRC HUB Support" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Your Verification Code - HRC HUB',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50; text-align: center;">HRC HUB</h2>
          <p>Hello,</p>
          <p>Thank you for registering with HRC HUB. Please use the verification code below to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${otpCode}</span>
          </div>
          <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} HRC HUB. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP Email:', error);
    // We do not throw the error here to prevent the main registration flow from breaking if email fails
    // However, for production, it's better to throw and inform the user.
    throw new Error('Could not send OTP email. Please check the provided email address.');
  }
};

const sendApprovalEmail = async (toEmail, userName) => {
  try {
    const mailOptions = {
      from: `"HRC HUB Admin" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Account Approved - Welcome to HRC HUB',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50; text-align: center;">HRC HUB</h2>
          <p>Hello ${userName || 'User'},</p>
          <p>Great news! Your profile registration has been reviewed and <strong>approved</strong> by the HRC HUB Admin team.</p>
          <p>You can now successfully log in to the HRC HUB application and start using our services.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hrchub.com" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} HRC HUB. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending Approval Email:', error);
    // Don't throw to prevent blocking the approval flow
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendApprovalEmail,
};
