export const getDocumentRequirements = (businessCategory, specializedCategory, subCategory) => {
  const documents = [];

  const addDoc = (id, name, helperText, requirement) => {
    documents.push({ id, name, helperText, requirement });
  };

  const selectedSubcategories = subCategory ? subCategory.split(',').map(s => s.trim()) : [];
  const isFoodSubCategory = selectedSubcategories.some(sub => ['Dairy', 'Vegetables', 'Fruits', 'Grocery', 'Meat', 'Bakery', 'Beverages', 'Spices'].includes(sub));

  // 1. Common required documents for all business types (always required)
  addDoc('pan_card', 'PAN Card', 'Business or proprietor PAN document.', 'Required');
  addDoc('business_reg', 'Business Registration / Trade Licence', 'Registered proof of the business registration.', 'Required');
  addDoc('address_proof', 'Business Address Proof', 'Electricity bill, utility bill, or rent agreement of registered address.', 'Required');

  // 2. Category-specific required document (max 1 per role/category, making total required docs = 4)
  if (businessCategory === 'Hotel') {
    addDoc('fssai', 'FSSAI Licence', 'Required for hotel business operations.', 'Required');
  } 
  else if (businessCategory === 'Restaurant') {
    addDoc('fssai', 'FSSAI Licence', 'Food business registration or licence.', 'Required');
  }
  else if (businessCategory === 'Cafe') {
    addDoc('fssai', 'FSSAI Licence', 'Food business registration or licence.', 'Required');
  }
  else if (businessCategory === 'Vendor / Supplier') {
    if (specializedCategory === 'Raw Material') {
      if (isFoodSubCategory) {
        addDoc('fssai', 'FSSAI Licence', 'Required when supplying food or beverages.', 'Required');
      }
    }
    else if (specializedCategory === 'Manpower') {
      addDoc('labour_licence', 'Labour Licence', 'Labour supply operations licence.', 'Required');
    }
    else if (specializedCategory === 'Service Provider') {
      addDoc('trade_licence', 'Professional Certificate / Trade Licence', 'Relevant professional licence or trade certificate.', 'Required');
    }
    else if (specializedCategory === 'Marketing Agency') {
      addDoc('portfolio', 'Portfolio / Work Sample', 'Agency portfolio or proof of previous campaign work.', 'Required');
    }
  }

  // 3. Additional optional documents (collapsed by default, never block registration)
  addDoc('gst', 'GST Registration Certificate', 'GST certificate if registered.', 'Optional');
  addDoc('shop_establishment', 'Shop & Establishment Licence', 'Local municipal shop licence.', 'Optional');
  addDoc('fire_noc', 'Fire Safety NOC', 'Fire safety compliance certificate.', 'Optional');
  addDoc('liquor_licence', 'Liquor Licence', 'NOC for liquor serving/sale if applicable.', 'Optional');
  addDoc('pollution_cert', 'Pollution Certificate', 'Pollution Control Board consent.', 'Optional');
  addDoc('epfo', 'EPFO Registration', 'Employees Provident Fund registration.', 'Optional');
  addDoc('esic', 'ESIC Registration', 'Employees State Insurance registration.', 'Optional');
  addDoc('tech_cert', 'Technician Certificate', 'Specialised technical certification.', 'Optional');
  addDoc('safety_cert', 'Safety Certificate', 'Safety and standards certificate.', 'Optional');
  addDoc('insurance', 'Business Insurance', 'Business or liability insurance.', 'Optional');
  addDoc('brand_auth', 'Brand Authorization', 'Authorisation letter from partner brands.', 'Optional');
  addDoc('distributor_auth', 'Distributor Authorization', 'Distributorship certificate.', 'Optional');
  addDoc('client_work_cert', 'Client Work Certificate', 'Letter of engagement or completion certificates.', 'Optional');

  return documents;
};
