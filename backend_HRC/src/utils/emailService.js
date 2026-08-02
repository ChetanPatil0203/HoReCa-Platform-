const nodemailer = require('nodemailer');
require('dotenv').config();
const templates = require('./emailTemplates');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generic mail sender wrapper with html and text fallback
 */
const sendMail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"HRC HUB" <${process.env.SMTP_USER || 'no-reply@hrchub.com'}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email [${subject}] sent successfully to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email [${subject}] to ${to}:`, error.message);
    return false;
  }
};

/**
 * 1. Registration OTP Email
 */
const sendOTPEmail = async (toEmail, otpCode, firstName = 'User', expiryMinutes = 10) => {
  const { subject, html, text } = templates.buildRegistrationOtpEmail({
    firstName,
    otp: otpCode,
    expiryMinutes,
  });
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 2. Forgot Password OTP Email
 */
const sendForgotPasswordOtpEmail = async (toEmail, otpCode, firstName = 'User', expiryMinutes = 10) => {
  const { subject, html, text } = templates.buildForgotPasswordOtpEmail({
    firstName,
    otp: otpCode,
    expiryMinutes,
  });
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 3. Registration Submitted Email
 */
const sendRegistrationSubmittedEmail = async (toEmail, { firstName, businessName, applicationId, businessType }) => {
  const { subject, html, text } = templates.buildRegistrationSubmittedEmail({
    firstName,
    businessName,
    applicationId,
    businessType,
  });
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 4. Account Approved Email
 */
const sendApprovalEmail = async (toEmail, userName = 'User', businessName, actionUrl) => {
  const { subject, html, text } = templates.buildAccountApprovedEmail({
    firstName: userName,
    businessName,
    actionUrl,
  });
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 5. Account Action Required Email
 */
const sendAccountActionRequiredEmail = async (toEmail, { firstName, businessName, reason, requiredAction, actionUrl }) => {
  const { subject, html, text } = templates.buildAccountActionRequiredEmail({
    firstName,
    businessName,
    reason,
    requiredAction,
    actionUrl,
  });
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 6. Order Confirmation Email
 */
const sendOrderConfirmationEmail = async (toEmail, orderData) => {
  const { subject, html, text } = templates.buildOrderConfirmationEmail(orderData);
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 7. Order Status Update Email
 */
const sendOrderStatusEmail = async (toEmail, statusData) => {
  const { subject, html, text } = templates.buildOrderStatusEmail(statusData);
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 8. Manpower Update Email
 */
const sendManpowerUpdateEmail = async (toEmail, updateData) => {
  const { subject, html, text } = templates.buildManpowerUpdateEmail(updateData);
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 9. Service Update Email
 */
const sendServiceUpdateEmail = async (toEmail, updateData) => {
  const { subject, html, text } = templates.buildServiceUpdateEmail(updateData);
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 10. Marketing Update Email
 */
const sendMarketingUpdateEmail = async (toEmail, updateData) => {
  const { subject, html, text } = templates.buildMarketingUpdateEmail(updateData);
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 11. Compliance Reminder Email
 */
const sendComplianceReminderEmail = async (toEmail, reminderData) => {
  const { subject, html, text } = templates.buildComplianceReminderEmail(reminderData);
  return await sendMail({ to: toEmail, subject, html, text });
};

/**
 * 12. Support Ticket Email
 */
const sendSupportTicketEmail = async (toEmail, ticketData) => {
  const { subject, html, text } = templates.buildSupportTicketEmail(ticketData);
  return await sendMail({ to: toEmail, subject, html, text });
};

module.exports = {
  sendOTPEmail,
  sendRegistrationOtpEmail: sendOTPEmail,
  sendForgotPasswordOtpEmail,
  sendRegistrationSubmittedEmail,
  sendApprovalEmail,
  sendAccountApprovedEmail: sendApprovalEmail,
  sendAccountActionRequiredEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendManpowerUpdateEmail,
  sendServiceUpdateEmail,
  sendMarketingUpdateEmail,
  sendComplianceReminderEmail,
  sendSupportTicketEmail,
};
