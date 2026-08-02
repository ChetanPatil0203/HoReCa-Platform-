/**
 * HRC HUB Transactional Email Templates & Design System
 */

const BRAND_NAVY = '#071B3A';
const BRAND_GOLD = '#D9A72E';
const BG_COLOR = '#F4F7FB';
const CARD_BG = '#FFFFFF';
const BORDER_COLOR = '#DFE6EF';
const TEXT_NAVY = '#091B3A';
const TEXT_MUTED = '#64748B';

/**
 * Escapes HTML characters for security
 */
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Helper to build status badges
 */
const buildStatusBadge = (status) => {
  if (!status) return '';
  const s = String(status).toLowerCase();
  let bg = '#E0F2FE';
  let color = '#0284C7';

  if (s.includes('approve') || s.includes('complete') || s.includes('delivered') || s.includes('resolve')) {
    bg = '#E8F8F1';
    color = '#16B77A';
  } else if (s.includes('pend') || s.includes('review') || s.includes('prepar') || s.includes('wait')) {
    bg = '#FEF3C7';
    color = '#D97706';
  } else if (s.includes('reject') || s.includes('cancel') || s.includes('fail') || s.includes('expire') || s.includes('action')) {
    bg = '#FEE2E2';
    color = '#DC2626';
  }

  return `
    <span style="display: inline-block; padding: 4px 12px; background-color: ${bg}; color: ${color}; font-size: 12px; font-weight: 700; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
      ${escapeHtml(status)}
    </span>
  `;
};

/**
 * Helper to build OTP block
 */
const buildOtpBlock = (otp, expiryMinutes = 10) => {
  return `
    <div style="background-color: #FEF8EC; border: 1px solid #F4D57A; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
      <div style="font-size: 11px; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Verification Code</div>
      <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: ${BRAND_NAVY}; font-family: monospace, 'Courier New', sans-serif; user-select: all;">${escapeHtml(otp)}</div>
      <div style="font-size: 12px; color: ${TEXT_MUTED}; margin-top: 10px;">Valid for ${escapeHtml(expiryMinutes)} minutes &bull; Do not share this code</div>
    </div>
  `;
};

/**
 * Helper to build primary action button
 */
const buildPrimaryButton = (text, url) => {
  if (!url || typeof url !== 'string' || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return '';
  }
  return `
    <div style="text-align: center; margin: 24px 0 12px 0;">
      <a href="${escapeHtml(url)}" target="_blank" style="display: inline-block; background-color: ${BRAND_NAVY}; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 10px; text-align: center; letter-spacing: 0.5px;">
        ${escapeHtml(text)}
      </a>
    </div>
  `;
};

/**
 * Reusable Master Email Shell
 */
const buildEmailShell = ({ title, preheader, content, actionText, actionUrl, currentYear = new Date().getFullYear() }) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${BG_COLOR}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden;">${escapeHtml(preheader)}</div>` : ''}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BG_COLOR}; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: ${CARD_BG}; border-radius: 16px; border: 1px solid ${BORDER_COLOR}; overflow: hidden; box-shadow: 0 4px 12px rgba(7, 27, 58, 0.04);">
          
          <!-- Compact Header -->
          <tr>
            <td style="background-color: ${BRAND_NAVY}; padding: 18px 24px; text-align: center; border-bottom: 3px solid ${BRAND_GOLD};">
              <div style="font-size: 20px; font-weight: 900; color: #FFFFFF; letter-spacing: 1px; line-height: 24px;">
                HRC <span style="color: ${BRAND_GOLD};">HUB</span>
              </div>
              <div style="font-size: 11px; font-weight: 500; color: #A0B3C6; letter-spacing: 1px; margin-top: 2px;">
                HoReCa Business Partner
              </div>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 24px 28px; color: ${TEXT_NAVY}; font-size: 14px; line-height: 22px;">
              ${content}
              ${buildPrimaryButton(actionText, actionUrl)}
            </td>
          </tr>

          <!-- Compact Footer -->
          <tr>
            <td style="background-color: #FAFBFD; padding: 16px 24px; border-top: 1px solid ${BORDER_COLOR}; text-align: center; font-size: 12px; color: ${TEXT_MUTED}; line-height: 18px;">
              <div style="font-weight: 600; color: ${TEXT_NAVY};">HRC HUB &bull; HoReCa Business Partner</div>
              <div style="font-size: 11px; color: ${BRAND_GOLD}; margin: 2px 0 6px 0; font-weight: 600; letter-spacing: 1px;">CONNECT &bull; COLLABORATE &bull; GROW</div>
              <div>&copy; ${escapeHtml(currentYear)} HRC HUB. All rights reserved.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return html;
};

// =========================================================================
// SPECIFIC EMAIL TEMPLATE BUILDERS (HTML + PLAIN TEXT FALLBACK)
// =========================================================================

/**
 * 1. Registration OTP Email
 */
const buildRegistrationOtpEmail = ({ firstName = 'User', otp, expiryMinutes = 10 }) => {
  const name = escapeHtml(firstName);
  const content = `
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Verify your email address</h2>
    <p style="margin: 0 0 12px 0;">Hello ${name},</p>
    <p style="margin: 0 0 16px 0; color: ${TEXT_MUTED};">Use the code below to verify your email address and complete your HRC HUB registration.</p>
    ${buildOtpBlock(otp, expiryMinutes)}
    <p style="font-size: 12px; color: ${TEXT_MUTED}; margin: 16px 0 0 0; text-align: center;">If you did not create an account, you can safely ignore this email.</p>
  `;

  const html = buildEmailShell({
    title: 'Your HRC HUB verification code',
    preheader: `Your verification code is ${otp}`,
    content,
  });

  const text = `Hello ${firstName},\n\nUse the code below to verify your email address and complete your HRC HUB registration:\n\nVerification Code: ${otp}\nValid for ${expiryMinutes} minutes.\nDo not share this code.\n\nIf you did not create this account, ignore this email.\n\nHRC HUB - HoReCa Business Partner`;

  return { subject: 'Your HRC HUB verification code', html, text };
};

/**
 * 2. Forgot Password OTP Email
 */
const buildForgotPasswordOtpEmail = ({ firstName = 'User', otp, expiryMinutes = 10 }) => {
  const name = escapeHtml(firstName);
  const content = `
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Reset your password</h2>
    <p style="margin: 0 0 12px 0;">Hello ${name},</p>
    <p style="margin: 0 0 16px 0; color: ${TEXT_MUTED};">We received a request to reset your HRC HUB password. Use the verification code below:</p>
    ${buildOtpBlock(otp, expiryMinutes)}
    <p style="font-size: 12px; color: ${TEXT_MUTED}; margin: 16px 0 0 0; text-align: center;">If you did not request a password reset, ignore this email. Your password will remain unchanged.</p>
  `;

  const html = buildEmailShell({
    title: 'Reset your HRC HUB password',
    preheader: `Your password reset code is ${otp}`,
    content,
  });

  const text = `Hello ${firstName},\n\nWe received a request to reset your HRC HUB password.\n\nVerification Code: ${otp}\nValid for ${expiryMinutes} minutes.\n\nIf you did not request this, ignore this email.\n\nHRC HUB - HoReCa Business Partner`;

  return { subject: 'Reset your HRC HUB password', html, text };
};

/**
 * 3. Registration Submitted Email
 */
const buildRegistrationSubmittedEmail = ({ firstName = 'User', businessName, applicationId, businessType }) => {
  const name = escapeHtml(firstName);
  const content = `
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Registration under review</h2>
    <p style="margin: 0 0 16px 0;">Hello ${name},</p>
    <p style="margin: 0 0 16px 0; color: ${TEXT_MUTED};">Your business registration for <strong>${escapeHtml(businessName)}</strong> has been submitted successfully.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid ${BORDER_COLOR}; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      ${applicationId ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Application ID:</td><td style="font-size: 13px; font-weight: 700; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(applicationId)}</td></tr>` : ''}
      ${businessType ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Business Type:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(businessType)}</td></tr>` : ''}
      <tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Status:</td><td style="text-align: right; padding: 4px 0;">${buildStatusBadge('Pending Review')}</td></tr>
    </table>
    
    <p style="font-size: 13px; color: ${TEXT_MUTED}; margin: 0;">We will notify you once verification is completed by our admin team.</p>
  `;

  const html = buildEmailShell({
    title: 'Your HRC HUB registration is under review',
    preheader: 'Your business registration has been submitted for review.',
    content,
  });

  const text = `Hello ${firstName},\n\nYour business registration for ${businessName} has been submitted successfully.\nApplication ID: ${applicationId || 'N/A'}\nStatus: Pending Review\n\nWe will notify you after verification is completed.\n\nHRC HUB`;

  return { subject: 'Your HRC HUB registration is under review', html, text };
};

/**
 * 4. Account Approved Email
 */
const buildAccountApprovedEmail = ({ firstName = 'User', businessName, actionUrl }) => {
  const name = escapeHtml(firstName);
  const content = `
    <div style="text-align: center; margin-bottom: 16px;">${buildStatusBadge('Approved')}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0; text-align: center;">Account Approved!</h2>
    <p style="margin: 0 0 12px 0;">Hello ${name},</p>
    <p style="margin: 0 0 16px 0; color: ${TEXT_MUTED};">Great news! Your business account for <strong>${escapeHtml(businessName || 'your business')}</strong> has been verified and approved.</p>
    <p style="margin: 0 0 16px 0; color: ${TEXT_NAVY}; font-weight: 600;">You can now sign in and start using HRC HUB.</p>
  `;

  const html = buildEmailShell({
    title: 'Your HRC HUB business account is approved',
    preheader: 'Your business account is verified and ready to use.',
    content,
    actionText: 'SIGN IN TO HRC HUB',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nYour business account for ${businessName || 'your business'} has been verified and approved.\n\nYou can now sign in and start using HRC HUB.\n\nHRC HUB`;

  return { subject: 'Your HRC HUB business account is approved', html, text };
};

/**
 * 5. Account Action Required / Resubmission Email
 */
const buildAccountActionRequiredEmail = ({ firstName = 'User', businessName, reason, requiredAction, actionUrl }) => {
  const name = escapeHtml(firstName);
  const content = `
    <div style="text-align: center; margin-bottom: 16px;">${buildStatusBadge('Action Required')}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Action required for registration</h2>
    <p style="margin: 0 0 12px 0;">Hello ${name},</p>
    <p style="margin: 0 0 16px 0; color: ${TEXT_MUTED};">We could not complete the verification of <strong>${escapeHtml(businessName || 'your business')}</strong>.</p>
    
    <div style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      <div style="font-size: 12px; font-weight: 700; color: #991B1B; text-transform: uppercase; margin-bottom: 4px;">Reason:</div>
      <div style="font-size: 13px; color: #7F1D1D; margin-bottom: 10px;">${escapeHtml(reason || 'Additional documentation required')}</div>
      ${requiredAction ? `<div style="font-size: 12px; font-weight: 700; color: #991B1B; text-transform: uppercase; margin-bottom: 4px;">Required Action:</div><div style="font-size: 13px; color: #7F1D1D;">${escapeHtml(requiredAction)}</div>` : ''}
    </div>
    
    <p style="font-size: 13px; color: ${TEXT_MUTED}; margin: 0;">Please update your profile details to proceed with verification.</p>
  `;

  const html = buildEmailShell({
    title: 'Action required for your HRC HUB registration',
    preheader: 'Please update your documents to complete verification.',
    content,
    actionText: 'UPDATE DOCUMENTS',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nWe could not complete verification of ${businessName || 'your business'}.\nReason: ${reason || 'Additional documentation required'}\nRequired Action: ${requiredAction || 'Update profile documents'}\n\nPlease sign in to update your documents.\n\nHRC HUB`;

  return { subject: 'Action required for your HRC HUB registration', html, text };
};

/**
 * 6. Order Confirmation Email
 */
const buildOrderConfirmationEmail = ({ firstName = 'Customer', orderId, vendorName, itemsSummary, amount, deliveryDate, paymentStatus, actionUrl }) => {
  const name = escapeHtml(firstName);
  const content = `
    <div style="text-align: center; margin-bottom: 12px;">${buildStatusBadge('Confirmed')}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Order Confirmed</h2>
    <p style="margin: 0 0 16px 0;">Hello ${name}, your order <strong>#${escapeHtml(orderId)}</strong> has been placed successfully.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid ${BORDER_COLOR}; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      ${vendorName ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Vendor:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(vendorName)}</td></tr>` : ''}
      ${itemsSummary ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Items:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(itemsSummary)}</td></tr>` : ''}
      ${amount ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Total Amount:</td><td style="font-size: 14px; font-weight: 700; color: ${BRAND_NAVY}; text-align: right; padding: 4px 0;">₹${escapeHtml(amount)}</td></tr>` : ''}
      ${deliveryDate ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Expected Delivery:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(deliveryDate)}</td></tr>` : ''}
      ${paymentStatus ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Payment:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(paymentStatus)}</td></tr>` : ''}
    </table>
  `;

  const html = buildEmailShell({
    title: `Order ${orderId} confirmed`,
    preheader: `Order #${orderId} confirmed for ₹${amount || '0'}`,
    content,
    actionText: 'VIEW ORDER',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nYour order #${orderId} has been confirmed.\nVendor: ${vendorName || 'N/A'}\nAmount: ₹${amount || '0'}\nDelivery: ${deliveryDate || 'N/A'}\n\nHRC HUB`;

  return { subject: `Order ${orderId} confirmed`, html, text };
};

/**
 * 7. Order Status Update Email
 */
const buildOrderStatusEmail = ({ firstName = 'Customer', orderId, status = 'Processing', expectedDelivery, driverName, actionUrl }) => {
  const name = escapeHtml(firstName);
  const content = `
    <div style="text-align: center; margin-bottom: 12px;">${buildStatusBadge(status)}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0; text-align: center;">Order Status Update</h2>
    <p style="margin: 0 0 16px 0;">Hello ${name}, your order <strong>#${escapeHtml(orderId)}</strong> is now <strong>${escapeHtml(status)}</strong>.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid ${BORDER_COLOR}; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      <tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Status:</td><td style="font-size: 13px; font-weight: 700; color: ${BRAND_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(status)}</td></tr>
      ${expectedDelivery ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Expected Delivery:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(expectedDelivery)}</td></tr>` : ''}
      ${driverName ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Delivery Contact:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(driverName)}</td></tr>` : ''}
    </table>
  `;

  const html = buildEmailShell({
    title: `Order ${orderId} is ${status}`,
    preheader: `Order #${orderId} status update: ${status}`,
    content,
    actionText: 'TRACK ORDER',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nOrder #${orderId} is now ${status}.\nExpected Delivery: ${expectedDelivery || 'N/A'}\n\nHRC HUB`;

  return { subject: `Order ${orderId} is ${status}`, html, text };
};

/**
 * 8. Manpower Update Email
 */
const buildManpowerUpdateEmail = ({ firstName = 'User', requirementId, role, agencyName, candidateCount, candidateName, joiningDate, status = 'Updated', actionUrl }) => {
  const subject = candidateName ? `Joining scheduled for ${candidateName}` : `Candidates update for ${role || 'requirement'}`;
  const content = `
    <div style="text-align: center; margin-bottom: 12px;">${buildStatusBadge(status)}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Manpower Requirement Update</h2>
    <p style="margin: 0 0 16px 0;">Hello ${escapeHtml(firstName)}, here is an update for your manpower request.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid ${BORDER_COLOR}; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      ${requirementId ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Requirement ID:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(requirementId)}</td></tr>` : ''}
      ${role ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Role:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(role)}</td></tr>` : ''}
      ${agencyName ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Agency:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(agencyName)}</td></tr>` : ''}
      ${candidateName ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Candidate:</td><td style="font-size: 13px; font-weight: 700; color: ${BRAND_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(candidateName)}</td></tr>` : ''}
      ${candidateCount ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Candidates Submitted:</td><td style="font-size: 13px; font-weight: 700; color: ${BRAND_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(candidateCount)}</td></tr>` : ''}
      ${joiningDate ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Joining Date:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(joiningDate)}</td></tr>` : ''}
    </table>
  `;

  const html = buildEmailShell({
    title: subject,
    preheader: `Manpower update for ${role || 'requirement'}`,
    content,
    actionText: 'VIEW REQUIREMENT',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nManpower update for ${role || 'requirement'}:\nAgency: ${agencyName || 'N/A'}\nStatus: ${status}\n\nHRC HUB`;

  return { subject, html, text };
};

/**
 * 9. Service Provider Update Email
 */
const buildServiceUpdateEmail = ({ firstName = 'User', requirementId, serviceName, providerName, amount, scheduledDate, status = 'Updated', actionUrl }) => {
  const subject = `Service update: ${serviceName || 'Request'}`;
  const content = `
    <div style="text-align: center; margin-bottom: 12px;">${buildStatusBadge(status)}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Service Provider Update</h2>
    <p style="margin: 0 0 16px 0;">Hello ${escapeHtml(firstName)}, here is an update for your service request.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid ${BORDER_COLOR}; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      ${serviceName ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Service:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(serviceName)}</td></tr>` : ''}
      ${providerName ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Provider:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(providerName)}</td></tr>` : ''}
      ${amount ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Amount:</td><td style="font-size: 13px; font-weight: 700; color: ${BRAND_NAVY}; text-align: right; padding: 4px 0;">₹${escapeHtml(amount)}</td></tr>` : ''}
      ${scheduledDate ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Scheduled Date:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(scheduledDate)}</td></tr>` : ''}
    </table>
  `;

  const html = buildEmailShell({
    title: subject,
    preheader: `Service update for ${serviceName || 'request'}`,
    content,
    actionText: 'VIEW SERVICE',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nService update for ${serviceName || 'request'}:\nProvider: ${providerName || 'N/A'}\nStatus: ${status}\n\nHRC HUB`;

  return { subject, html, text };
};

/**
 * 10. Marketing Update Email
 */
const buildMarketingUpdateEmail = ({ firstName = 'User', campaignId, campaignTitle, agencyName, budget, duration, status = 'Updated', actionUrl }) => {
  const subject = `Marketing update: ${campaignTitle || 'Campaign'}`;
  const content = `
    <div style="text-align: center; margin-bottom: 12px;">${buildStatusBadge(status)}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Marketing Campaign Update</h2>
    <p style="margin: 0 0 16px 0;">Hello ${escapeHtml(firstName)}, here is an update for your marketing campaign.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid ${BORDER_COLOR}; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      ${campaignTitle ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Campaign:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(campaignTitle)}</td></tr>` : ''}
      ${agencyName ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Agency:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(agencyName)}</td></tr>` : ''}
      ${budget ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Budget:</td><td style="font-size: 13px; font-weight: 700; color: ${BRAND_NAVY}; text-align: right; padding: 4px 0;">₹${escapeHtml(budget)}</td></tr>` : ''}
      ${duration ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Duration:</td><td style="font-size: 13px; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(duration)}</td></tr>` : ''}
    </table>
  `;

  const html = buildEmailShell({
    title: subject,
    preheader: `Marketing update for ${campaignTitle || 'campaign'}`,
    content,
    actionText: 'VIEW CAMPAIGN',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nMarketing update for ${campaignTitle || 'campaign'}:\nAgency: ${agencyName || 'N/A'}\nStatus: ${status}\n\nHRC HUB`;

  return { subject, html, text };
};

/**
 * 11. Compliance Document Expiry Reminder Email
 */
const buildComplianceReminderEmail = ({ firstName = 'User', businessName, documentName, expiryDate, daysRemaining, status = 'Expiring Soon', actionUrl }) => {
  const subject = `${documentName || 'Document'} expires soon`;
  const content = `
    <div style="text-align: center; margin-bottom: 12px;">${buildStatusBadge(status)}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Document Expiry Reminder</h2>
    <p style="margin: 0 0 16px 0;">Hello ${escapeHtml(firstName)}, your <strong>${escapeHtml(documentName)}</strong> for <strong>${escapeHtml(businessName || 'your business')}</strong> will expire in <strong>${escapeHtml(daysRemaining)} days</strong>.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      <tr><td style="font-size: 13px; color: #991B1B; padding: 4px 0;">Document:</td><td style="font-size: 13px; font-weight: 700; color: #991B1B; text-align: right; padding: 4px 0;">${escapeHtml(documentName)}</td></tr>
      ${expiryDate ? `<tr><td style="font-size: 13px; color: #991B1B; padding: 4px 0;">Expiry Date:</td><td style="font-size: 13px; font-weight: 600; color: #991B1B; text-align: right; padding: 4px 0;">${escapeHtml(expiryDate)}</td></tr>` : ''}
    </table>
    
    <p style="font-size: 13px; color: ${TEXT_MUTED}; margin: 0;">Please renew and upload your updated compliance document to avoid account disruption.</p>
  `;

  const html = buildEmailShell({
    title: subject,
    preheader: `${documentName} expires in ${daysRemaining} days`,
    content,
    actionText: 'RENEW DOCUMENT',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nYour ${documentName} for ${businessName} will expire in ${daysRemaining} days.\nExpiry Date: ${expiryDate || 'N/A'}\n\nPlease renew and upload your document.\n\nHRC HUB`;

  return { subject, html, text };
};

/**
 * 12. Support Ticket Update Email
 */
const buildSupportTicketEmail = ({ firstName = 'User', ticketId, subject = 'Support Ticket', status = 'Updated', latestMessage, updatedDate, actionUrl }) => {
  const emailSubject = `Support ticket ${ticketId || ''} ${status.toLowerCase()}`;
  const content = `
    <div style="text-align: center; margin-bottom: 12px;">${buildStatusBadge(status)}</div>
    <h2 style="font-size: 18px; font-weight: 700; color: ${BRAND_NAVY}; margin: 0 0 12px 0;">Support Ticket Update</h2>
    <p style="margin: 0 0 16px 0;">Hello ${escapeHtml(firstName)}, your support ticket has been updated.</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid ${BORDER_COLOR}; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      ${ticketId ? `<tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Ticket ID:</td><td style="font-size: 13px; font-weight: 700; color: ${BRAND_NAVY}; text-align: right; padding: 4px 0;">#${escapeHtml(ticketId)}</td></tr>` : ''}
      <tr><td style="font-size: 13px; color: ${TEXT_MUTED}; padding: 4px 0;">Subject:</td><td style="font-size: 13px; font-weight: 600; color: ${TEXT_NAVY}; text-align: right; padding: 4px 0;">${escapeHtml(subject)}</td></tr>
      ${latestMessage ? `<tr><td colspan="2" style="font-size: 13px; color: ${TEXT_NAVY}; padding: 8px 0 4px 0; border-top: 1px solid ${BORDER_COLOR}; margin-top: 6px;"><strong>Latest Update:</strong><br/>"${escapeHtml(latestMessage)}"</td></tr>` : ''}
    </table>
  `;

  const html = buildEmailShell({
    title: emailSubject,
    preheader: `Support ticket #${ticketId} update: ${status}`,
    content,
    actionText: 'VIEW TICKET',
    actionUrl,
  });

  const text = `Hello ${firstName},\n\nSupport ticket #${ticketId} update:\nSubject: ${subject}\nStatus: ${status}\nLatest Message: ${latestMessage || 'N/A'}\n\nHRC HUB`;

  return { subject: emailSubject, html, text };
};

module.exports = {
  buildEmailShell,
  buildOtpBlock,
  buildStatusBadge,
  buildRegistrationOtpEmail,
  buildForgotPasswordOtpEmail,
  buildRegistrationSubmittedEmail,
  buildAccountApprovedEmail,
  buildAccountActionRequiredEmail,
  buildOrderConfirmationEmail,
  buildOrderStatusEmail,
  buildManpowerUpdateEmail,
  buildServiceUpdateEmail,
  buildMarketingUpdateEmail,
  buildComplianceReminderEmail,
  buildSupportTicketEmail,
};
