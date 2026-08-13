export const getDocumentRequirements = (businessCategory, specializedCategory, subCategory) => {
  const documents = [];

  const addDoc = (id, name, helperText, requirement) => {
    documents.push({ id, name, helperText, requirement });
  };

  const selectedSubcategories = subCategory
    ? (Array.isArray(subCategory) ? subCategory : String(subCategory).split(',').map(s => s.trim()))
    : [];
  const isFoodSubCategory = selectedSubcategories.some(sub => ['Dairy', 'Vegetables', 'Fruits', 'Grocery', 'Meat', 'Bakery', 'Beverages', 'Spices'].includes(sub));

  // 1. Common required documents for all business types (always required)
  addDoc('pan_card', 'PAN Card Document File', 'Upload official PAN card photo or PDF.', 'Required');
  addDoc('business_reg', 'Business Registration / Trade Licence File', 'Upload registered proof of business registration.', 'Required');
  addDoc('address_proof', 'Business Address Proof File', 'Upload utility bill or rent agreement.', 'Required');

  // 2. Category-specific required document (mandatory per role/category)
  if (['Hotel', 'Restaurant', 'Cafe'].includes(businessCategory)) {
    addDoc('fssai', 'FSSAI Licence Certificate File', 'Upload official FSSAI licence certificate PDF or photo.', 'Required');
  }
  else if (businessCategory === 'Vendor / Supplier') {
    if (specializedCategory === 'Raw Material') {
      addDoc('fssai', 'FSSAI Licence Certificate File', 'Upload official FSSAI licence certificate PDF or photo.', 'Required');
    }
    else if (specializedCategory === 'Manpower') {
      addDoc('labour_licence', 'Labour Licence Certificate File', 'Upload labour supply licence document.', 'Required');
    }
    else if (specializedCategory === 'Service Provider') {
      addDoc('trade_licence', 'Professional / Trade Licence File', 'Upload relevant professional licence certificate.', 'Required');
    }
    else if (specializedCategory === 'Marketing Agency') {
      addDoc('portfolio', 'Agency Portfolio / Work Proof File', 'Upload agency portfolio or campaign work proof.', 'Required');
    }
  }

  // 3. Optional compliance documents (managed post-registration via Compliance section)
  // Non-essential compliance documents are omitted from initial registration.

  return documents;
};

// Helper function to return all post-registration compliance document requirements by business role
export const getComplianceDocumentTypes = (businessCategory, specializedCategory) => {
  const complianceDocs = [
    { id: 'gst', name: 'GST Registration Certificate', helperText: 'GST certificate if registered.' },
  ];

  if (['Hotel', 'Restaurant', 'Cafe'].includes(businessCategory)) {
    complianceDocs.push(
      { id: 'shop_establishment', name: 'Shop & Establishment Licence', helperText: 'Local municipal shop licence.' },
      { id: 'fire_noc', name: 'Fire Safety NOC', helperText: 'Fire safety compliance certificate.' },
      { id: 'liquor_licence', name: 'Liquor Licence', helperText: 'NOC for liquor serving/sale if applicable.' },
      { id: 'pollution_cert', name: 'Pollution Certificate', helperText: 'Pollution Control Board consent.' }
    );
  } else if (businessCategory === 'Vendor / Supplier') {
    if (specializedCategory === 'Raw Material') {
      complianceDocs.push(
        { id: 'brand_auth', name: 'Brand Authorization', helperText: 'Authorisation letter from partner brands.' },
        { id: 'distributor_auth', name: 'Distributor Authorization', helperText: 'Distributorship certificate.' }
      );
    } else if (specializedCategory === 'Manpower') {
      complianceDocs.push(
        { id: 'shop_establishment', name: 'Shop & Establishment Licence', helperText: 'Local municipal shop licence.' },
        { id: 'epfo', name: 'EPFO Registration', helperText: 'Employees Provident Fund registration.' },
        { id: 'esic', name: 'ESIC Registration', helperText: 'Employees State Insurance registration.' },
        { id: 'insurance', name: 'Business Insurance', helperText: 'Business or liability insurance.' }
      );
    } else if (specializedCategory === 'Service Provider') {
      complianceDocs.push(
        { id: 'tech_cert', name: 'Technician Certificate', helperText: 'Specialised technical certification.' },
        { id: 'safety_cert', name: 'Safety Certificate', helperText: 'Safety and standards certificate.' },
        { id: 'insurance', name: 'Business Insurance', helperText: 'Business or liability insurance.' }
      );
    } else if (specializedCategory === 'Marketing Agency') {
      complianceDocs.push(
        { id: 'client_work_cert', name: 'Client Work Certificate', helperText: 'Letter of engagement or completion certificates.' },
        { id: 'brand_auth', name: 'Brand Authorization', helperText: 'Authorisation letter from partner brands.' }
      );
    }
  }

  return complianceDocs;
};
