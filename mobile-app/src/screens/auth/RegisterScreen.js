import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity, TextInput, Dimensions
} from 'react-native';
import {
  User, Building2, ShieldCheck, Check, ArrowLeft, ArrowRight, Home, Utensils,
  Coffee, Truck, Briefcase, Wrench, Megaphone, CheckCircle2, UploadCloud,
  FileText, Edit2, AlertCircle
} from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const NAVY = '#081A3A';
const GOLD = '#D4AF37';
const LIGHT_BG = '#F8FAFC';
const GRAY_BORDER = '#E2E8F0';
const TEXT_MUTED = '#64748B';

const BUSINESS_CATEGORIES = [
  { id: 'Hotel', icon: Home, title: 'Hotel' },
  { id: 'Restaurant', icon: Utensils, title: 'Restaurant' },
  { id: 'Cafe', icon: Coffee, title: 'Cafe' },
  { id: 'Vendor / Supplier', icon: Truck, title: 'Vendor / Supplier' },
];

const SPECIALIZED_CATEGORIES = [
  { id: 'Raw Material Supplier', icon: Truck, title: 'Raw Material Supplier' },
  { id: 'Manpower Agency', icon: User, title: 'Manpower Agency' },
  { id: 'Service Provider', icon: Wrench, title: 'Service Provider' },
  { id: 'Marketing Agency', icon: Megaphone, title: 'Marketing Agency' },
];

const VENDOR_SUBCATEGORIES = {
  'Raw Material Supplier': [
    'Vegetables & Fruits', 'Dairy', 'Rice, Flour & Grains', 'Oil & Spices',
    'Meat & Seafood', 'Bakery', 'Beverages', 'Frozen Food', 'Cleaning & Hygiene',
    'Packaging Material', 'Kitchen Equipment', 'Other'
  ],
  'Manpower Agency': [
    'Chef', 'Waiter / Server', 'Kitchen Staff', 'Housekeeping', 'Receptionist',
    'Bartender', 'Helper', 'Security Guard', 'Temporary / Event Staff', 'Other'
  ],
  'Service Provider': [
    'Electrical Services', 'Plumbing', 'AC & Refrigeration', 'Pest Control',
    'Cleaning Services', 'Equipment Maintenance', 'Fire Safety', 'CCTV & Security',
    'IT Support', 'Water Purification', 'Other'
  ],
  'Marketing Agency': [
    'Digital Marketing', 'Social Media Marketing', 'SEO', 'Performance Marketing',
    'Branding', 'Graphic Design', 'Photography & Videography', 'Website Development',
    'Influencer Marketing', 'Outdoor Advertising', 'Other'
  ]
};

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '', mobile: '', email: '', password: '', confirmPassword: '',
    isMobileVerified: false, isEmailVerified: false,
    businessCategory: '',
    specializedCategory: '', subcategory: '',
    businessName: '', contactPerson: '', gst: '', address: '', city: '', state: '', pincode: '',
    documents: {},
    agreed: false
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const getRequiredDocuments = () => {
    if (formData.businessCategory === 'Vendor / Supplier') {
      return ['GST Certificate', 'PAN Document', 'Business Registration Document', 'Category License (Optional)'];
    }
    return ['GST Certificate', 'FSSAI Certificate', 'Business Registration Document'];
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.mobile || formData.mobile.length < 10) newErrors.mobile = "Valid mobile required";
      if (!formData.email || !formData.email.includes('@')) newErrors.email = "Valid email required";
      if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 chars";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!formData.isMobileVerified) newErrors.mobileVerify = "Please verify mobile number";
      if (!formData.isEmailVerified) newErrors.emailVerify = "Please verify email";
    }
    else if (currentStep === 2) {
      if (!formData.businessCategory) newErrors.businessCategory = "Select a business category";
    }
    else if (currentStep === 3 && formData.businessCategory === 'Vendor / Supplier') {
      if (!formData.specializedCategory) newErrors.specializedCategory = "Select a specialized category";
      if (!formData.subcategory) newErrors.subcategory = "Select a subcategory";
    }
    else if (currentStep === 4) {
      if (!formData.businessName) newErrors.businessName = "Business name is required";
      if (!formData.contactPerson) newErrors.contactPerson = "Contact person is required";
      if (!formData.gst) newErrors.gst = "GST number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode) newErrors.pincode = "Pincode is required";
    }
    else if (currentStep === 5) {
      const requiredDocs = getRequiredDocuments().filter(d => !d.includes('Optional'));
      requiredDocs.forEach(doc => {
        if (!formData.documents[doc]) newErrors[doc] = "Document is required";
      });
    }
    else if (currentStep === 6) {
      if (!formData.agreed) newErrors.agreed = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    if (step === 2 && formData.businessCategory !== 'Vendor / Supplier') {
      setStep(4); // Skip specialized category
    } else if (step === 6) {
      setStep(7); // Go to success
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 4 && formData.businessCategory !== 'Vendor / Supplier') {
      setStep(2);
    } else if (step > 1 && step < 7) {
      setStep(step - 1);
    } else if (step === 1) {
      navigation.goBack();
    }
  };

  const finishRegistration = () => {
    login(formData.businessCategory === 'Vendor / Supplier' ? 'vendor' : 'owner', 'mock-jwt-token');
  };

  const renderStepper = () => {
    if (step === 7) return null;
    const totalSteps = 6;
    const currentDisplayStep = step === 4 && formData.businessCategory !== 'Vendor / Supplier' ? 3 : step;
    const maxDisplaySteps = formData.businessCategory === 'Vendor / Supplier' ? 6 : 5;

    return (
      <View style={styles.stepperContainer}>
        <View style={styles.stepperHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={20} color={NAVY} />
          </TouchableOpacity>
          <Text style={styles.stepperTitle}>Step {step} of 6</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(step / 6) * 100}%` }]} />
        </View>
      </View>
    );
  };

  // UI Component Generators
  const InputField = ({ label, keyName, placeholder, secure = false, keyboard = 'default', required = true }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label} {required && <Text style={{ color: '#EF4444' }}>*</Text>}</Text>
      <TextInput
        style={[styles.input, errors[keyName] && styles.inputError]}
        placeholder={placeholder}
        secureTextEntry={secure}
        keyboardType={keyboard}
        value={formData[keyName]}
        onChangeText={(val) => updateForm(keyName, val)}
      />
      {errors[keyName] && <Text style={styles.errorText}>{errors[keyName]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderStepper()}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {step === 1 && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>Account Verification</Text>
              <Text style={styles.stepSubtitle}>Create your secure HRC HUB account.</Text>

              {InputField({ label: "Full Name", keyName: "fullName", placeholder: "Arjun Mehta" })}

              <View style={styles.verifyGroup}>
                <View style={{ flex: 1 }}>
                  {InputField({ label: "Mobile Number", keyName: "mobile", placeholder: "9876543210", keyboard: "phone-pad" })}
                </View>
                {formData.isMobileVerified ? (
                  <View style={styles.verifiedBadge}><CheckCircle2 size={16} color="#10B981" /><Text style={styles.verifiedText}>Verified</Text></View>
                ) : (
                  <TouchableOpacity style={styles.verifyBtn} onPress={() => updateForm('isMobileVerified', true)}>
                    <Text style={styles.verifyBtnText}>Verify OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.mobileVerify && <Text style={[styles.errorText, { marginTop: -10, marginBottom: 16 }]}>{errors.mobileVerify}</Text>}

              <View style={styles.verifyGroup}>
                <View style={{ flex: 1 }}>
                  {InputField({ label: "Email Address", keyName: "email", placeholder: "contact@company.com", keyboard: "email-address" })}
                </View>
                {formData.isEmailVerified ? (
                  <View style={styles.verifiedBadge}><CheckCircle2 size={16} color="#10B981" /><Text style={styles.verifiedText}>Verified</Text></View>
                ) : (
                  <TouchableOpacity style={styles.verifyBtn} onPress={() => updateForm('isEmailVerified', true)}>
                    <Text style={styles.verifyBtnText}>Verify OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.emailVerify && <Text style={[styles.errorText, { marginTop: -10, marginBottom: 16 }]}>{errors.emailVerify}</Text>}

              {InputField({ label: "Password", keyName: "password", placeholder: "••••••••", secure: true })}
              {InputField({ label: "Confirm Password", keyName: "confirmPassword", placeholder: "••••••••", secure: true })}
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>What best describes your business?</Text>
              <Text style={styles.stepSubtitle}>Select your primary operation category.</Text>
              {errors.businessCategory && <Text style={styles.errorText}>{errors.businessCategory}</Text>}

              <View style={styles.cardGrid}>
                {BUSINESS_CATEGORIES.map((cat) => {
                  const isSelected = formData.businessCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catCard, isSelected && styles.catCardSelected]}
                      onPress={() => updateForm('businessCategory', cat.id)}
                    >
                      <View style={[styles.catIconBox, isSelected && { backgroundColor: GOLD + '20' }]}>
                        <Icon size={32} color={isSelected ? GOLD : '#94A3B8'} />
                      </View>
                      <Text style={[styles.catTitle, isSelected && { color: NAVY }]}>{cat.title}</Text>
                      {isSelected && <View style={styles.checkIcon}><CheckCircle2 size={20} color={GOLD} /></View>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>Specialized Category</Text>
              <Text style={styles.stepSubtitle}>What exactly do you supply or provide?</Text>
              {errors.specializedCategory && <Text style={styles.errorText}>{errors.specializedCategory}</Text>}

              <View style={styles.cardGrid}>
                {SPECIALIZED_CATEGORIES.map((cat) => {
                  const isSelected = formData.specializedCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catCard, isSelected && styles.catCardSelected]}
                      onPress={() => {
                        updateForm('specializedCategory', cat.id);
                        updateForm('subcategory', '');
                      }}
                    >
                      <View style={[styles.catIconBox, isSelected && { backgroundColor: GOLD + '20' }]}>
                        <Icon size={24} color={isSelected ? GOLD : '#94A3B8'} />
                      </View>
                      <Text style={[styles.catTitle, isSelected && { color: NAVY }]}>{cat.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {formData.specializedCategory ? (
                <View style={{ marginTop: 24 }}>
                  <Text style={styles.inputLabel}>Select Subcategory <Text style={{ color: '#EF4444' }}>*</Text></Text>
                  <View style={styles.subCatGrid}>
                    {VENDOR_SUBCATEGORIES[formData.specializedCategory].map((sub) => {
                      const isSubSelected = formData.subcategory === sub;
                      return (
                        <TouchableOpacity
                          key={sub}
                          style={[styles.subCatPill, isSubSelected && styles.subCatPillSelected]}
                          onPress={() => updateForm('subcategory', sub)}
                        >
                          <Text style={[styles.subCatPillText, isSubSelected && { color: '#FFFFFF' }]}>{sub}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                  {errors.subcategory && <Text style={styles.errorText}>{errors.subcategory}</Text>}
                </View>
              ) : null}
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>Business Details</Text>
              <Text style={styles.stepSubtitle}>Provide official company information.</Text>

              {InputField({ label: "Business / Agency Name", keyName: "businessName", placeholder: "The Meridian Group" })}
              {InputField({ label: "Contact Person Name", keyName: "contactPerson", placeholder: "Rahul Sharma" })}
              {InputField({ label: "GST Number", keyName: "gst", placeholder: "22AAAAA0000A1Z5" })}
              {InputField({ label: "Business Address", keyName: "address", placeholder: "123 Business Avenue" })}

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>{InputField({ label: "City", keyName: "city", placeholder: "Mumbai" })}</View>
                <View style={{ flex: 1 }}>{InputField({ label: "State", keyName: "state", placeholder: "Maharashtra" })}</View>
              </View>
              {InputField({ label: "Pincode", keyName: "pincode", placeholder: "400001", keyboard: "numeric" })}
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>Upload Documents</Text>
              <Text style={styles.stepSubtitle}>Upload official documents for verification.</Text>

              {getRequiredDocuments().map((doc, idx) => {
                const isUploaded = !!formData.documents[doc];
                return (
                  <View key={idx} style={styles.docCard}>
                    <View style={styles.docHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.docIconBox, isUploaded && { backgroundColor: '#10B98120' }]}>
                          <FileText size={20} color={isUploaded ? "#10B981" : TEXT_MUTED} />
                        </View>
                        <View style={{ marginLeft: 12 }}>
                          <Text style={styles.docTitle}>{doc} {doc.includes('Optional') ? '' : '*'}</Text>
                          <Text style={styles.docStatus}>{isUploaded ? 'Uploaded Successfully' : 'Pending Upload'}</Text>
                        </View>
                      </View>
                      {isUploaded && <CheckCircle2 size={24} color="#10B981" />}
                    </View>

                    {errors[doc] && <Text style={styles.errorText}>{errors[doc]}</Text>}

                    <View style={styles.docActions}>
                      <TouchableOpacity
                        style={[styles.docBtn, isUploaded && { backgroundColor: LIGHT_BG, borderWidth: 1, borderColor: GRAY_BORDER }]}
                        onPress={() => updateForm('documents', { ...formData.documents, [doc]: 'uploaded_file.pdf' })}
                      >
                        <UploadCloud size={16} color={isUploaded ? NAVY : "#FFFFFF"} />
                        <Text style={[styles.docBtnText, isUploaded && { color: NAVY }]}>
                          {isUploaded ? 'Replace File' : 'Select File'}
                        </Text>
                      </TouchableOpacity>

                      {isUploaded && (
                        <TouchableOpacity
                          style={styles.docRemoveBtn}
                          onPress={() => {
                            const newDocs = { ...formData.documents };
                            delete newDocs[doc];
                            updateForm('documents', newDocs);
                          }}
                        >
                          <Text style={styles.docRemoveText}>Remove</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {step === 6 && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>Review & Submit</Text>
              <Text style={styles.stepSubtitle}>Please review your details before submitting.</Text>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Account Info</Text>
                  <TouchableOpacity onPress={() => setStep(1)}><Edit2 size={16} color={NAVY} /></TouchableOpacity>
                </View>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Name:</Text> {formData.fullName}</Text>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Phone:</Text> {formData.mobile}</Text>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Email:</Text> {formData.email}</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Business Type</Text>
                  <TouchableOpacity onPress={() => setStep(2)}><Edit2 size={16} color={NAVY} /></TouchableOpacity>
                </View>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Category:</Text> {formData.businessCategory}</Text>
                {formData.businessCategory === 'Vendor / Supplier' && (
                  <>
                    <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Specialized:</Text> {formData.specializedCategory}</Text>
                    <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Subcategory:</Text> {formData.subcategory}</Text>
                  </>
                )}
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Business Details</Text>
                  <TouchableOpacity onPress={() => setStep(4)}><Edit2 size={16} color={NAVY} /></TouchableOpacity>
                </View>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Company:</Text> {formData.businessName}</Text>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Contact:</Text> {formData.contactPerson}</Text>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>GST:</Text> {formData.gst}</Text>
                <Text style={styles.summaryVal}><Text style={styles.summaryLabel}>Address:</Text> {formData.address}, {formData.city}, {formData.state} {formData.pincode}</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Documents</Text>
                  <TouchableOpacity onPress={() => setStep(5)}><Edit2 size={16} color={NAVY} /></TouchableOpacity>
                </View>
                {getRequiredDocuments().map((doc, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <CheckCircle2 size={14} color={formData.documents[doc] ? "#10B981" : "#94A3B8"} style={{ marginRight: 6 }} />
                    <Text style={styles.summaryVal}>{doc}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.termsBox} onPress={() => updateForm('agreed', !formData.agreed)}>
                <View style={[styles.checkbox, formData.agreed && styles.checkboxActive]}>
                  {formData.agreed && <Check size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>I agree to the <Text style={{ color: NAVY, fontWeight: 'bold' }}>Terms & Conditions</Text> and <Text style={{ color: NAVY, fontWeight: 'bold' }}>Privacy Policy</Text>.</Text>
              </TouchableOpacity>
              {errors.agreed && <Text style={styles.errorText}>{errors.agreed}</Text>}

            </View>
          )}

          {step === 7 && (
            <View style={styles.successBlock}>
              <View style={styles.successIconBox}>
                <ShieldCheck size={64} color="#10B981" />
              </View>

              {formData.businessCategory === 'Vendor / Supplier' ? (
                <>
                  <Text style={styles.successTitle}>Registration Submitted</Text>
                  <Text style={styles.successSubtitle}>
                    Your business profile has been submitted for verification. You will be notified once your account is approved.
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Status: Pending Verification</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.successTitle}>Registration Successful!</Text>
                  <Text style={styles.successSubtitle}>
                    Welcome to HRC HUB. Your account has been created and you're ready to start.
                  </Text>
                </>
              )}

              <TouchableOpacity style={styles.btnPrimary} onPress={finishRegistration}>
                <Text style={styles.btnPrimaryText}>Go to Dashboard</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>

        {/* Footer Actions (Steps 1-6) */}
        {step < 7 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
              <Text style={styles.btnPrimaryText}>{step === 6 ? 'Submit Registration' : 'Continue'}</Text>
              {step !== 6 && <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />}
            </TouchableOpacity>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: LIGHT_BG },

  // Stepper
  stepperContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_BORDER,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center', alignItems: 'center',
  },
  stepperTitle: { fontSize: 16, fontWeight: '700', color: NAVY },
  progressBarBg: { height: 4, backgroundColor: LIGHT_BG, width: '100%' },
  progressBarFill: { height: 4, backgroundColor: GOLD },

  scrollContent: { padding: 20, paddingBottom: 100 },

  stepBlock: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  stepSubtitle: { fontSize: 14, color: TEXT_MUTED, marginBottom: 24, lineHeight: 20 },

  // Inputs
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: NAVY,
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' },

  // Verify Group
  verifyGroup: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  verifyBtn: {
    backgroundColor: NAVY,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  verifyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: '#10B98115',
    borderRadius: 12,
    marginTop: 26,
    borderWidth: 1,
    borderColor: '#10B98130',
  },
  verifiedText: { color: '#10B981', fontWeight: '600', marginLeft: 6, fontSize: 13 },

  // Cards
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  catCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    marginBottom: 12,
  },
  catCardSelected: {
    borderColor: GOLD,
    backgroundColor: GOLD + '05',
  },
  catIconBox: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: LIGHT_BG,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  catTitle: { fontSize: 14, fontWeight: '600', color: '#475569', textAlign: 'center' },
  checkIcon: { position: 'absolute', top: 12, right: 12 },

  // Subcats
  subCatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  subCatPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: GRAY_BORDER,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
  },
  subCatPillSelected: { backgroundColor: NAVY, borderColor: NAVY },
  subCatPillText: { fontSize: 13, color: '#475569', fontWeight: '500' },

  // Docs
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: GRAY_BORDER,
  },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  docIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: LIGHT_BG, justifyContent: 'center', alignItems: 'center' },
  docTitle: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 2 },
  docStatus: { fontSize: 12, color: TEXT_MUTED },
  docActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docBtn: {
    flex: 1, flexDirection: 'row', backgroundColor: NAVY,
    paddingVertical: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8
  },
  docBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  docRemoveBtn: { paddingHorizontal: 12, paddingVertical: 12 },
  docRemoveText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },

  // Summary
  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: GRAY_BORDER,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: NAVY },
  summaryVal: { fontSize: 14, color: '#334155', marginBottom: 4, lineHeight: 22 },
  summaryLabel: { fontWeight: '600', color: '#64748B' },

  termsBox: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, paddingRight: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: GRAY_BORDER, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: GOLD, borderColor: GOLD },
  termsText: { fontSize: 13, color: '#475569', lineHeight: 20, flex: 1 },

  // Success
  successBlock: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  successIconBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#10B98115', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, textAlign: 'center', marginBottom: 12 },
  successSubtitle: { fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20, marginBottom: 32 },
  statusBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 40 },
  statusBadgeText: { color: '#D97706', fontWeight: '700', fontSize: 14 },

  // Footer
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY_BORDER,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  btnPrimary: {
    backgroundColor: GOLD,
    flexDirection: 'row',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
