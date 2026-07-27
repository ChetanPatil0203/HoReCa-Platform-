/**
 * Generates raw SVG strings for compliance document previews.
 * Returns the SVG string directly — no encoding, no data URLs.
 */

export const getSampleDocumentSvg = (docName, docNumber, businessName = 'Chetan Hotel', applicantName = 'Chetan Patil') => {
  const nameLower = (docName || '').toLowerCase();

  // 1. PAN CARD
  if (nameLower.includes('pan')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" style="max-width:600px;display:block;margin:auto" font-family="Arial, sans-serif">
      <defs>
        <linearGradient id="panBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2B6CB0"/>
          <stop offset="50%" stop-color="#3182CE"/>
          <stop offset="100%" stop-color="#1A365D"/>
        </linearGradient>
      </defs>
      <rect width="600" height="380" rx="20" fill="url(#panBg)" stroke="#1A202C" stroke-width="4"/>
      <rect x="0" y="0" width="600" height="70" rx="20" fill="#1A365D"/>
      <text x="300" y="32" fill="#FFFFFF" font-size="18" font-weight="bold" text-anchor="middle" letter-spacing="1">INCOME TAX DEPARTMENT</text>
      <text x="300" y="52" fill="#E2E8F0" font-size="13" text-anchor="middle">GOVT. OF INDIA</text>
      <rect x="35" y="90" width="120" height="150" rx="8" fill="#EDF2F7" stroke="#CBD5E0" stroke-width="2"/>
      <circle cx="95" cy="140" r="35" fill="#A0AEC0"/>
      <path d="M 60 210 Q 95 175 130 210 Z" fill="#718096"/>
      <rect x="35" y="260" width="60" height="60" rx="6" fill="#ECC94B" stroke="#D69E2E" stroke-width="2"/>
      <text x="65" y="295" fill="#744210" font-size="10" font-weight="bold" text-anchor="middle">SECURE</text>
      <text x="180" y="105" fill="#E2E8F0" font-size="11">NAME</text>
      <text x="180" y="125" fill="#FFFFFF" font-size="16" font-weight="bold">${(applicantName || '').toUpperCase()}</text>
      <text x="180" y="155" fill="#E2E8F0" font-size="11">DATE OF BIRTH</text>
      <text x="180" y="175" fill="#FFFFFF" font-size="14" font-weight="bold">02/03/1992</text>
      <text x="180" y="215" fill="#E2E8F0" font-size="11">PERMANENT ACCOUNT NUMBER</text>
      <text x="180" y="255" fill="#F6AD55" font-size="28" font-weight="bold" font-family="monospace" letter-spacing="2">${docNumber || 'ABCDE1234F'}</text>
      <path d="M 400 330 Q 450 310 520 335" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      <text x="460" y="355" fill="#CBD5E0" font-size="10" text-anchor="middle">Signature</text>
    </svg>`;
  }

  // 2. FSSAI LICENSE
  if (nameLower.includes('fssai')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="100%" style="max-width:600px;display:block;margin:auto" font-family="Arial, sans-serif">
      <rect width="600" height="700" fill="#F7FAFC" stroke="#2F855A" stroke-width="6"/>
      <rect x="20" y="20" width="560" height="85" fill="#2F855A" rx="8"/>
      <text x="300" y="55" fill="#FFFFFF" font-size="28" font-weight="bold" text-anchor="middle">fssai</text>
      <text x="300" y="80" fill="#F0FFF4" font-size="11" font-weight="bold" text-anchor="middle">FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA</text>
      <text x="300" y="130" fill="#1A202C" font-size="14" font-weight="bold" text-anchor="middle">LICENSE UNDER FOOD SAFETY AND STANDARDS ACT, 2006</text>
      <line x1="60" y1="145" x2="540" y2="145" stroke="#CBD5E0" stroke-width="2"/>
      <rect x="40" y="160" width="520" height="410" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" rx="8"/>
      <text x="60" y="200" fill="#4A5568" font-size="13" font-weight="bold">1. License Number:</text>
      <text x="240" y="200" fill="#2F855A" font-size="16" font-weight="bold" font-family="monospace">${docNumber || '14161949674918'}</text>
      <text x="60" y="240" fill="#4A5568" font-size="13" font-weight="bold">2. Food Business Operator:</text>
      <text x="240" y="240" fill="#1A202C" font-size="14" font-weight="bold">${businessName}</text>
      <text x="60" y="280" fill="#4A5568" font-size="13" font-weight="bold">3. Address of Premises:</text>
      <text x="240" y="280" fill="#2D3748" font-size="12">Plot 42, Main Road, City Central, Delhi - 110001</text>
      <text x="60" y="320" fill="#4A5568" font-size="13" font-weight="bold">4. Kind of Business:</text>
      <text x="240" y="320" fill="#2D3748" font-size="12">Food Services / Hotel and Restaurant Catering</text>
      <text x="60" y="360" fill="#4A5568" font-size="13" font-weight="bold">5. Period of Validity:</text>
      <text x="240" y="360" fill="#2B6CB0" font-size="14" font-weight="bold">25/08/2022 to 24/08/2027</text>
      <text x="60" y="400" fill="#4A5568" font-size="13" font-weight="bold">6. Category of License:</text>
      <text x="240" y="400" fill="#2D3748" font-size="12">State License</text>
      <circle cx="460" cy="475" r="45" fill="none" stroke="#2F855A" stroke-width="3" stroke-dasharray="6 3"/>
      <text x="460" y="470" fill="#2F855A" font-size="10" font-weight="bold" text-anchor="middle">FSSAI DELHI</text>
      <text x="460" y="485" fill="#2F855A" font-size="9" font-weight="bold" text-anchor="middle">REGISTERED</text>
      <path d="M 80 630 Q 140 600 200 630" stroke="#1A365D" stroke-width="3" fill="none"/>
      <text x="140" y="655" fill="#4A5568" font-size="12" font-weight="bold">Designated Officer Signature</text>
      <text x="300" y="685" fill="#A0AEC0" font-size="10" text-anchor="middle">System generated compliance certificate under FSS Act 2006.</text>
    </svg>`;
  }

  // 3. GST CERTIFICATE
  if (nameLower.includes('gst')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="100%" style="max-width:600px;display:block;margin:auto" font-family="Arial, sans-serif">
      <rect width="600" height="700" fill="#F7FAFC" stroke="#1A202C" stroke-width="5"/>
      <text x="300" y="38" fill="#1A202C" font-size="13" font-weight="bold" text-anchor="middle">Government of India</text>
      <text x="300" y="60" fill="#1A202C" font-size="16" font-weight="bold" text-anchor="middle">Form GST REG-06</text>
      <text x="300" y="78" fill="#4A5568" font-size="12" text-anchor="middle">Registration Certificate</text>
      <line x1="40" y1="90" x2="560" y2="90" stroke="#1A202C" stroke-width="2"/>
      <text x="300" y="120" fill="#2B6CB0" font-size="18" font-weight="bold" text-anchor="middle" font-family="monospace">GSTIN: ${docNumber || '27AAAAA0000A1Z5'}</text>
      <rect x="40" y="140" width="520" height="430" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" rx="6"/>
      <text x="60" y="175" fill="#4A5568" font-size="12" font-weight="bold">1. Legal Name</text>
      <text x="240" y="175" fill="#1A202C" font-size="13" font-weight="bold">${businessName}</text>
      <text x="60" y="215" fill="#4A5568" font-size="12" font-weight="bold">2. Trade Name</text>
      <text x="240" y="215" fill="#1A202C" font-size="13">${businessName}</text>
      <text x="60" y="255" fill="#4A5568" font-size="12" font-weight="bold">3. Constitution of Business</text>
      <text x="240" y="255" fill="#1A202C" font-size="13">Proprietorship / Partnership</text>
      <text x="60" y="295" fill="#4A5568" font-size="12" font-weight="bold">4. Address of Principal Place</text>
      <text x="240" y="295" fill="#1A202C" font-size="12">Main Commercial Street, City District, 411001</text>
      <text x="60" y="340" fill="#4A5568" font-size="12" font-weight="bold">5. Date of Liability</text>
      <text x="240" y="340" fill="#1A202C" font-size="13">01/04/2021</text>
      <text x="60" y="380" fill="#4A5568" font-size="12" font-weight="bold">6. Period of Validity</text>
      <text x="240" y="380" fill="#2F855A" font-size="13" font-weight="bold">From 01/04/2021 - Regular</text>
      <text x="60" y="420" fill="#4A5568" font-size="12" font-weight="bold">7. Type of Registration</text>
      <text x="240" y="420" fill="#1A202C" font-size="13">Regular Taxpayer</text>
      <text x="60" y="460" fill="#4A5568" font-size="12" font-weight="bold">8. Approving Authority</text>
      <text x="240" y="460" fill="#1A202C" font-size="12">Superintendent of Central Tax</text>
      <circle cx="450" cy="505" r="40" fill="none" stroke="#2B6CB0" stroke-width="3"/>
      <text x="450" y="500" fill="#2B6CB0" font-size="9" font-weight="bold" text-anchor="middle">GOODS AND SERVICES TAX</text>
      <text x="450" y="515" fill="#2B6CB0" font-size="8" font-weight="bold" text-anchor="middle">GOVERNMENT OF INDIA</text>
      <path d="M 80 620 Q 130 590 180 620" stroke="#1A365D" stroke-width="2.5" fill="none"/>
      <text x="130" y="645" fill="#4A5568" font-size="11">Jurisdictional Officer</text>
      <text x="300" y="685" fill="#A0AEC0" font-size="10" text-anchor="middle">The Registration Certificate must be prominently displayed at place of business.</text>
    </svg>`;
  }

  // 4. FIRE SAFETY NOC
  if (nameLower.includes('fire')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="100%" style="max-width:600px;display:block;margin:auto" font-family="Arial, sans-serif">
      <rect width="600" height="700" fill="#FFF5F5" stroke="#9B2C2C" stroke-width="6"/>
      <rect x="20" y="20" width="560" height="75" fill="#9B2C2C" rx="6"/>
      <text x="300" y="50" fill="#FFFFFF" font-size="20" font-weight="bold" text-anchor="middle">FIRE AND EMERGENCY SERVICES</text>
      <text x="300" y="70" fill="#FEB2B2" font-size="12" font-weight="bold" text-anchor="middle">FIRE SAFETY CLEARANCE NOC CERTIFICATE</text>
      <text x="300" y="120" fill="#9B2C2C" font-size="16" font-weight="bold" text-anchor="middle" font-family="monospace">NOC NO: ${docNumber || 'FSC-88219'}</text>
      <rect x="40" y="145" width="520" height="430" fill="#FFFFFF" stroke="#FEB2B2" stroke-width="2" rx="8"/>
      <text x="60" y="185" fill="#742A2A" font-size="13" font-weight="bold">Certificate Granted To:</text>
      <text x="240" y="185" fill="#1A202C" font-size="14" font-weight="bold">${businessName}</text>
      <text x="60" y="225" fill="#742A2A" font-size="13" font-weight="bold">Proprietor / Owner:</text>
      <text x="240" y="225" fill="#1A202C" font-size="13">${applicantName}</text>
      <text x="60" y="265" fill="#742A2A" font-size="13" font-weight="bold">Premises Location:</text>
      <text x="240" y="265" fill="#2D3748" font-size="12">Building No. 12, Commercial Zone, City</text>
      <text x="60" y="305" fill="#742A2A" font-size="13" font-weight="bold">Building Height / Floors:</text>
      <text x="240" y="305" fill="#2D3748" font-size="12">G + 2 Floors (Commercial Assembly)</text>
      <text x="60" y="345" fill="#742A2A" font-size="13" font-weight="bold">Fire Equipment Status:</text>
      <text x="240" y="345" fill="#2F855A" font-size="13" font-weight="bold">Inspected and Operational</text>
      <text x="60" y="385" fill="#742A2A" font-size="13" font-weight="bold">NOC Valid Until:</text>
      <text x="240" y="385" fill="#9B2C2C" font-size="15" font-weight="bold">15/01/2027</text>
      <circle cx="450" cy="460" r="45" fill="none" stroke="#9B2C2C" stroke-width="3"/>
      <text x="450" y="455" fill="#9B2C2C" font-size="10" font-weight="bold" text-anchor="middle">FIRE DEPT</text>
      <text x="450" y="470" fill="#9B2C2C" font-size="9" font-weight="bold" text-anchor="middle">CLEARED</text>
      <path d="M 80 620 Q 140 590 200 620" stroke="#9B2C2C" stroke-width="3" fill="none"/>
      <text x="140" y="645" fill="#742A2A" font-size="12" font-weight="bold">Chief Fire Officer</text>
      <text x="300" y="685" fill="#A0AEC0" font-size="10" text-anchor="middle">Subject to annual inspection and functional fire system maintenance.</text>
    </svg>`;
  }

  // DEFAULT — TRADE / SHOP LICENCE
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="100%" style="max-width:600px;display:block;margin:auto" font-family="Arial, sans-serif">
    <rect width="600" height="700" fill="#F8FAFC" stroke="#071B3A" stroke-width="6"/>
    <rect x="20" y="20" width="560" height="75" fill="#071B3A" rx="6"/>
    <text x="300" y="50" fill="#F2C230" font-size="18" font-weight="bold" text-anchor="middle">MUNICIPAL CORPORATION REGISTRATION</text>
    <text x="300" y="70" fill="#FFFFFF" font-size="12" text-anchor="middle">SHOP AND ESTABLISHMENT TRADE LICENCE</text>
    <text x="300" y="120" fill="#071B3A" font-size="15" font-weight="bold" text-anchor="middle" font-family="monospace">REG NO: ${docNumber || 'BRN-27-00012345'}</text>
    <rect x="40" y="145" width="520" height="430" fill="#FFFFFF" stroke="#E3E9F1" stroke-width="2" rx="8"/>
    <text x="60" y="185" fill="#4A5568" font-size="13" font-weight="bold">Establishment Name:</text>
    <text x="250" y="185" fill="#071B3A" font-size="15" font-weight="bold">${businessName}</text>
    <text x="60" y="225" fill="#4A5568" font-size="13" font-weight="bold">Proprietor Name:</text>
    <text x="250" y="225" fill="#1A202C" font-size="14" font-weight="bold">${applicantName}</text>
    <text x="60" y="265" fill="#4A5568" font-size="13" font-weight="bold">Category / Class:</text>
    <text x="250" y="265" fill="#1A202C" font-size="12">Commercial Establishment / Hospitality</text>
    <text x="60" y="305" fill="#4A5568" font-size="13" font-weight="bold">Registered Address:</text>
    <text x="250" y="305" fill="#2D3748" font-size="12">101 Trade Center, Commercial Zone</text>
    <text x="60" y="345" fill="#4A5568" font-size="13" font-weight="bold">Date of Registration:</text>
    <text x="250" y="345" fill="#1A202C" font-size="13">15/06/2021</text>
    <circle cx="450" cy="460" r="45" fill="none" stroke="#071B3A" stroke-width="3"/>
    <text x="450" y="455" fill="#071B3A" font-size="10" font-weight="bold" text-anchor="middle">MUNICIPAL</text>
    <text x="450" y="470" fill="#071B3A" font-size="9" font-weight="bold" text-anchor="middle">SEAL APPROVED</text>
    <path d="M 80 620 Q 140 590 200 620" stroke="#071B3A" stroke-width="3" fill="none"/>
    <text x="140" y="645" fill="#4A5568" font-size="12" font-weight="bold">Licensing Officer</text>
    <text x="300" y="685" fill="#A0AEC0" font-size="10" text-anchor="middle">Certified true copy issued by Shop and Establishment Department.</text>
  </svg>`;
};

export default getSampleDocumentSvg;
