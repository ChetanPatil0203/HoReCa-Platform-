export const getDocumentRequirements = (businessCategory, specializedCategory, subCategory) => {
  const documents = [];

  const addDoc = (id, name, helperText, requirement) => {
    documents.push({ id, name, helperText, requirement });
  };

  const isFoodSubCategory = ['Dairy', 'Vegetables', 'Fruits', 'Grocery', 'Meat', 'Bakery', 'Beverages', 'Spices'].includes(subCategory);

  if (businessCategory === 'Hotel') {
    addDoc('trade_licence', 'Business Registration / Trade Licence', 'Registered proof of the hotel business.', 'Required');
    addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
    addDoc('shop_establishment', 'Shop and Establishment Licence', 'Registered establishment licence where applicable to the business.', 'Required');
    addDoc('fssai', 'FSSAI Licence', 'Required when the hotel prepares, serves or sells food and beverages.', 'Required if applicable');
    addDoc('gst', 'GST Registration Certificate', 'Required when the business is registered under GST.', 'Required if applicable');
    addDoc('fire_noc', 'Fire Safety Certificate / Fire NOC', 'Required according to property size and local authority rules.', 'Required if applicable');
    addDoc('local_auth', 'Hotel Registration / Local Authority Licence', 'Upload when issued by the applicable local authority.', 'Required if applicable');
  } 
  else if (businessCategory === 'Restaurant') {
    addDoc('fssai', 'FSSAI Licence', 'Food business registration or licence.', 'Required');
    addDoc('trade_licence', 'Business Registration / Trade Licence', 'Registered proof of the restaurant business.', 'Required');
    addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
    addDoc('shop_establishment', 'Shop and Establishment Licence / Local Trade Licence', 'Registered establishment licence.', 'Required');
    addDoc('gst', 'GST Registration Certificate', 'Required when the business is registered under GST.', 'Required if applicable');
    addDoc('fire_noc', 'Fire Safety Certificate / Fire NOC', 'Required according to property size and local authority rules.', 'Required if applicable');
    addDoc('local_health', 'Local Health / Food Trade Licence', 'Upload when issued by the applicable local authority.', 'Required if applicable');
  }
  else if (businessCategory === 'Cafe') {
    addDoc('fssai', 'FSSAI Licence', 'Food business registration or licence.', 'Required');
    addDoc('trade_licence', 'Business Registration / Trade Licence', 'Registered proof of the cafe business.', 'Required');
    addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
    addDoc('shop_establishment', 'Shop and Establishment Licence', 'Registered establishment licence.', 'Required');
    addDoc('gst', 'GST Registration Certificate', 'Required when the business is registered under GST.', 'Required if applicable');
    addDoc('fire_noc', 'Fire Safety Certificate / Fire NOC', 'Required according to property size and local authority rules.', 'Required if applicable');
    addDoc('local_health', 'Local Health / Food Trade Licence', 'Upload when issued by the applicable local authority.', 'Required if applicable');
  }
  else if (businessCategory === 'Vendor / Supplier') {
    if (specializedCategory === 'Raw Material') {
      addDoc('business_reg', 'Business Registration Proof', 'Registered proof of the supply business.', 'Required');
      addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
      addDoc('gst', 'GST Registration Certificate', 'Required when the business is registered under GST.', 'Required if applicable');
      addDoc('fssai', 'FSSAI Licence', 'Required when supplying food, beverages, groceries, dairy, meat, bakery items or edible products.', isFoodSubCategory ? 'Required' : 'Required if applicable');
      addDoc('product_licence', 'Product-Specific Licence / Registration', 'Required for regulated product categories where applicable.', 'Required if applicable');
      addDoc('brand_auth', 'Brand Authorisation / Distributor Certificate', 'Upload when supplying products as an authorised distributor.', 'Required if applicable');
      addDoc('quality_cert', 'Quality Certificate', 'Optional quality assurance certification.', 'Optional');
    }
    else if (specializedCategory === 'Manpower') {
      addDoc('business_reg', 'Business Registration Proof', 'Registered proof of the manpower business.', 'Required');
      addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
      addDoc('shop_establishment', 'Shop and Establishment Licence', 'Registered establishment licence.', 'Required');
      addDoc('gst', 'GST Registration Certificate', 'Required when the business is registered under GST.', 'Required if applicable');
      addDoc('labour_contractor', 'Labour Contractor Licence', 'Required when applicable to the agency’s labour-supply operations.', 'Required if applicable');
      addDoc('epfo', 'EPFO Registration', 'Upload EPFO registration certificate.', 'Required if applicable');
      addDoc('esic', 'ESIC Registration', 'Upload ESIC registration certificate.', 'Required if applicable');
      addDoc('prof_tax', 'Professional Tax Registration', 'Upload Professional Tax registration.', 'Required if applicable');
      addDoc('recruitment_cert', 'Recruitment Agency Certificate', 'Optional recruitment certification.', 'Optional');
    }
    else if (specializedCategory === 'Service Provider') {
      addDoc('business_reg', 'Business Registration Proof', 'Registered proof of the service business.', 'Required');
      addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
      addDoc('gst', 'GST Registration Certificate', 'Required when the business is registered under GST.', 'Required if applicable');
      
      let tradeLicenceName = 'Trade / Professional Licence';
      if (subCategory === 'Electrician') tradeLicenceName = 'Electrical Contractor / Technician Licence';
      else if (subCategory === 'Pest Control') tradeLicenceName = 'Pest Control Operator Licence / Chemical Handling Certificate';
      else if (subCategory === 'Security') tradeLicenceName = 'Security Agency Licence';
      addDoc('trade_licence', tradeLicenceName, 'Required for regulated services such as electrical, security or specialised maintenance.', 'Required if applicable');
      
      let techCertName = 'Technician Certification';
      if (subCategory === 'Plumber') techCertName = 'Trade Certification';
      else if (subCategory === 'Maintenance') techCertName = 'Technician or Equipment Maintenance Certification';
      addDoc('tech_cert', techCertName, 'Upload certification relevant to the selected service category.', 'Required if applicable');
      
      let safetyCertName = 'Safety Compliance Certificate';
      if (subCategory === 'Cleaning Service') safetyCertName = 'Safety and Chemical Handling Certificate';
      addDoc('safety_cert', safetyCertName, 'Upload safety compliance certification.', 'Required if applicable');
      
      addDoc('insurance', 'Business / Public Liability Insurance', 'Upload liability insurance document.', 'Required if applicable');
      addDoc('work_cert', 'Previous Work Certificate', 'Optional proof of previous work.', 'Optional');
    }
    else if (specializedCategory === 'Marketing Agency') {
      addDoc('business_reg', 'Business Registration Proof', 'Registered proof of the marketing business.', 'Required');
      addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
      addDoc('gst', 'GST Registration Certificate', 'Required when the business is registered under GST.', 'Required if applicable');
      addDoc('prof_reg', 'Professional Registration / Local Business Licence', 'Upload local business registration.', 'Required if applicable');
      addDoc('agency_portfolio', 'Agency Portfolio', 'Upload a PDF containing previous campaigns or creative work.', 'Optional');
      addDoc('work_cert', 'Client Work Certificate / Letter of Engagement', 'Optional client engagement letters.', 'Optional');
      addDoc('brand_auth', 'Brand Authorisation Document', 'Optional brand authorisation.', 'Optional');
    }
  }

  return documents;
};
