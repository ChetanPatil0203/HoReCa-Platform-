import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform, useWindowDimensions, ScrollView, SafeAreaView, KeyboardAvoidingView, TextInput } from 'react-native';
import { Building2, Phone, ArrowRight, Briefcase, FileText, CircleAlert as AlertCircle, MapPin, ShieldCheck, CreditCard, CircleCheck as CheckCircle, Check } from 'lucide-react-native';

import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import RegistrationStepIndicator from '../../components/auth/RegistrationStepIndicator';
import FormField from '../../components/auth/FormField';
import SelectField from '../../components/auth/SelectField';
import DocumentUploadRow from '../../components/auth/DocumentUploadRow';
import { getDocumentRequirements } from '../../config/authDocumentRequirements';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

if (typeof Platform !== 'undefined' && Platform?.OS === 'android' && UIManager?.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BIZ_CATEGORIES = ['Hotel', 'Restaurant', 'Cafe', 'Vendor / Supplier'];
const SPECIALIZED_CATEGORIES = ['Raw Material', 'Manpower', 'Service Provider', 'Marketing Agency'];
const SUB_CATEGORIES = {
  'Raw Material': ['Dairy', 'Vegetables', 'Fruits', 'Grocery', 'Meat', 'Bakery', 'Beverages', 'Spices', 'Packaging'],
  'Manpower': ['Chef', 'Waiter', 'Cleaner', 'Kitchen Helper', 'Manager', 'Delivery Staff'],
  'Service Provider': ['Electrician', 'Plumber', 'Pest Control', 'Cleaning Service', 'Maintenance', 'Security'],
  'Marketing Agency': ['Social Media Marketing', 'SEO', 'Performance Marketing', 'Branding', 'Graphic Design', 'Content Creation', 'Website Development', 'Photography / Videography']
};

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Noida', 'Gurugram', 'Jaipur', 'Lucknow', 'Indore', 'Amritsar', 'Chandigarh'];
const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Punjab', 'Haryana'];

export default function RegisterStepOneScreen({ navigation, route }) {
  const existingState = route.params?.registrationData || {};
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const contentWidth = isWeb ? Math.min(width * 0.94, 520) : Math.min(width * 0.96, 520);
  const showTwoColumns = width >= 480;

  // Form State
  const [bizName, setBizName] = useState(existingState.bizName || '');
  const [bizCategory, setBizCategory] = useState(existingState.bizCategory || '');
  const [specialized, setSpecialized] = useState(existingState.specialized || '');
  const [subCategory, setSubCategory] = useState(existingState.subCategory || '');
  const [panNo, setPanNo] = useState(existingState.panNo || '');
  const [gstin, setGstin] = useState(existingState.gstin || '');
  const [fssaiNo, setFssaiNo] = useState(existingState.fssaiNo || '');
  const [mobile, setMobile] = useState(existingState.mobile || '');
  const [address, setAddress] = useState(existingState.address || '');
  const [city, setCity] = useState(existingState.city || '');
  const [state, setState] = useState(existingState.state || '');
  const [pincode, setPincode] = useState(existingState.pincode || '');
  const [documents, setDocuments] = useState(existingState.documents || {});

  // Documents Config
  const [requiredDocs, setRequiredDocs] = useState([]);

  // Validation State
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Array of subcategories for calculations
  const selectedSubcategories = subCategory
    ? (Array.isArray(subCategory) ? subCategory : String(subCategory).split(',').map(s => s.trim()))
    : [];

  // Auto determine FSSAI requirement
  const isFssaiRequired =
    bizCategory === 'Hotel' ||
    bizCategory === 'Restaurant' ||
    bizCategory === 'Cafe' ||
    (bizCategory === 'Vendor / Supplier' && specialized === 'Raw Material' &&
      selectedSubcategories.some(sub => ['Dairy', 'Vegetables', 'Fruits', 'Grocery', 'Meat', 'Bakery', 'Beverages', 'Spices'].includes(sub)));

  useEffect(() => {
    if (bizCategory) {
      const docs = getDocumentRequirements(bizCategory, specialized, subCategory);
      setRequiredDocs(docs);

      // Clean up documents that are no longer part of requirements when category changes
      setDocuments(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (!docs.find(d => d.id === key)) {
            delete next[key];
          }
        });
        return next;
      });
    } else {
      setRequiredDocs([]);
    }
  }, [bizCategory, specialized, subCategory]);

  const handleCategoryChange = (val) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBizCategory(val);
    if (val !== 'Vendor / Supplier') {
      setSpecialized('');
      setSubCategory('');
    } else {
      setFssaiNo('');
    }
    clearValidationState();
  };

  const handleSpecializedChange = (val) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSpecialized(val);
    setSubCategory('');
    clearValidationState();
  };

  const handlePanChange = (val) => {
    setPanNo(val.toUpperCase().replace(/\s/g, ''));
    clearValidationState();
  };

  const handleGstinChange = (val) => {
    setGstin(val.toUpperCase().replace(/\s/g, ''));
    clearValidationState();
  };

  const handleFileSelect = (docId, file) => {
    setDocuments(prev => ({ ...prev, [docId]: file }));
  };

  const handleFileRemove = (docId) => {
    setDocuments(prev => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const clearValidationState = () => {
    if (showValidationSummary) {
      setValidationErrors([]);
      setShowValidationSummary(false);
    }
  };

  const reqList = requiredDocs.filter(d => d.requirement === 'Required');
  const reqUploaded = reqList.filter(d => documents[d.id]).length;
  const totalReq = reqList.length;

  const handleNext = () => {
    const errorsList = [];

    if (!bizName.trim()) errorsList.push('Enter Business Name');
    if (!bizCategory) errorsList.push('Select Business Category');
    if (!panNo.trim()) {
      errorsList.push('Enter PAN Number');
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNo.toUpperCase())) {
      errorsList.push('Enter valid 10-character PAN (e.g. ABCDE1234F)');
    }

    if (gstin.trim() && gstin.trim().length !== 15) {
      errorsList.push('GST Number must be 15 characters');
    }

    if (isFssaiRequired) {
      if (!fssaiNo.trim()) {
        errorsList.push('Enter FSSAI License Number');
      } else if (fssaiNo.replace(/[^0-9]/g, '').length !== 14) {
        errorsList.push('FSSAI License must be 14 digits');
      }
    }

    if (bizCategory === 'Vendor / Supplier') {
      if (!specialized) errorsList.push('Select Specialized Category');
      if (specialized && (!subCategory || (Array.isArray(subCategory) && subCategory.length === 0))) {
        errorsList.push('Select at least one Subcategory');
      }
    }

    if (!mobile.trim()) {
      errorsList.push('Enter Mobile Number');
    } else if (mobile.replace(/[^0-9]/g, '').length !== 10) {
      errorsList.push('Enter valid 10-digit Mobile Number');
    }

    if (!address.trim()) errorsList.push('Enter Business Address');
    if (!city) errorsList.push('Select City');
    if (!state) errorsList.push('Select State');

    if (!pincode.trim()) {
      errorsList.push('Enter Pincode');
    } else if (pincode.replace(/[^0-9]/g, '').length !== 6) {
      errorsList.push('Pincode must be 6 digits');
    }

    // Validate only visible required documents
    const missingDocs = reqList.filter(d => !documents[d.id]);
    if (missingDocs.length > 0) {
      missingDocs.forEach(d => {
        errorsList.push(`Upload ${d.name}`);
      });
    }

    if (errorsList.length > 0) {
      setValidationErrors(errorsList);
      setShowValidationSummary(true);
      return;
    }

    setShowValidationSummary(false);
    const subCategoryPayload = Array.isArray(subCategory) ? subCategory.join(', ') : subCategory;
    const registrationData = {
      ...existingState,
      bizName: bizName.trim(),
      bizCategory,
      specialized,
      subCategory: subCategoryPayload,
      panNo: panNo.toUpperCase().trim(),
      gstin: gstin.toUpperCase().trim(),
      fssaiNo: isFssaiRequired ? fssaiNo.trim() : '',
      mobile: mobile.replace(/[^0-9]/g, ''),
      address: address.trim(),
      city,
      state,
      pincode: pincode.replace(/[^0-9]/g, ''),
      documents
    };
    navigation.navigate('RegisterStepTwo', { registrationData });
  };

  const subCategoryDisplayText = Array.isArray(subCategory) ? subCategory.join(', ') : subCategory;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentWrapper, { width: contentWidth }]}>
            <AuthCard>
              <AuthTabs activeTab="register" onTabChange={(tab) => tab === 'login' && navigation.navigate('Login')} />
              <RegistrationStepIndicator currentStep={1} />

              <View style={styles.headerBlock}>

                <Text style={styles.heading}>Business Verification</Text>

              </View>

              {/* Section 1: Business Identity */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Building2 size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionTitle}>Business Identity</Text>
                </View>

                <FormField
                  label="CORPORATE BUSINESS NAME *"
                  icon={Building2}
                  placeholder="e.g. The Meridian Hotel"
                  value={bizName}
                  onChangeText={setBizName}
                />

                <SelectField
                  label="Business Operation Category *"
                  icon={Briefcase}
                  options={BIZ_CATEGORIES}
                  value={bizCategory}
                  onSelect={handleCategoryChange}
                />

                <FormField
                  label="PAN Number *"
                  icon={CreditCard}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  autoCapitalize="characters"
                  value={panNo}
                  onChangeText={(val) => handlePanChange(val)}
                />

                <FormField
                  label="GST Number"
                  icon={FileText}
                  placeholder="27AAAAA0000A1Z5"
                  maxLength={15}
                  autoCapitalize="characters"
                  value={gstin}
                  onChangeText={(val) => handleGstinChange(val)}
                  helperText="Optional if your business is not GST registered."
                />

                {isFssaiRequired && (
                  <FormField
                    label="FSSAI License Number *"
                    icon={ShieldCheck}
                    placeholder="14-digit FSSAI License No."
                    keyboardType="numeric"
                    maxLength={14}
                    value={fssaiNo}
                    onChangeText={(val) => { setFssaiNo(val.replace(/[^0-9]/g, '')); clearValidationState(); }}
                  />
                )}
              </View>

              {/* Section 2: Vendor Specialization (conditional for Vendor / Supplier) */}
              {bizCategory === 'Vendor / Supplier' && (
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionCardTitle}>Vendor Specialization</Text>

                  <SelectField
                    label="Specialized Category *"
                    options={SPECIALIZED_CATEGORIES}
                    value={specialized}
                    onSelect={handleSpecializedChange}
                  />

                  {specialized ? (
                    <SelectField
                      label="Subcategory *"
                      searchable
                      options={SUB_CATEGORIES[specialized] || []}
                      value={subCategory}
                      onSelect={(val) => { setSubCategory(val); clearValidationState(); }}
                      isMultiSelect={true}
                    />
                  ) : null}

                  {specialized && subCategoryDisplayText ? (
                    <View style={styles.specializationSummary}>
                      <Check size={14} color={AUTH_COLORS.success} style={{ marginRight: 6 }} />
                      <Text style={styles.specializationSummaryText}>
                        Selected: <Text style={{ fontWeight: 'bold' }}>{`${specialized} • ${subCategoryDisplayText}`}</Text>
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}

              {/* Section 3: Contact & Address (Always Rendered) */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <MapPin size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionTitle}>Contact & Address</Text>
                </View>

                {/* Mobile Number */}
                <View style={styles.mobileFieldContainer}>
                  <Text style={styles.mobileLabel}>CONTACT MOBILE *</Text>
                  <View style={styles.mobileInputRow}>
                    <View style={styles.mobilePrefix}>
                      <Text style={styles.mobilePrefixText}>+91</Text>
                    </View>
                    <TextInput
                      placeholder="10-digit mobile number"
                      keyboardType="numeric"
                      maxLength={10}
                      value={mobile}
                      onChangeText={(val) => { setMobile(val.replace(/[^0-9]/g, '')); clearValidationState(); }}
                      placeholderTextColor={AUTH_COLORS.muted}
                      style={styles.mobileInput}
                    />
                  </View>
                </View>

                {/* Address */}
                <FormField
                  label="REGISTERED BUSINESS ADDRESS *"
                  icon={MapPin}
                  placeholder="Street address, building, suite, unit, floor"
                  value={address}
                  onChangeText={(val) => { setAddress(val); clearValidationState(); }}
                />

                {/* City & State */}
                <View style={styles.rowFields}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <SelectField
                      label="City *"
                      searchable
                      options={CITIES}
                      value={city}
                      onSelect={(val) => { setCity(val); clearValidationState(); }}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <SelectField
                      label="State *"
                      searchable
                      options={STATES}
                      value={state}
                      onSelect={(val) => { setState(val); clearValidationState(); }}
                    />
                  </View>
                </View>

                {/* Pincode */}
                <FormField
                  label="Pincode *"
                  placeholder="6-digit PIN code"
                  keyboardType="numeric"
                  maxLength={6}
                  value={pincode}
                  onChangeText={(val) => { setPincode(val.replace(/[^0-9]/g, '')); clearValidationState(); }}
                />
              </View>

              {/* Section 4: Required Documents (Always Rendered - Max 4 required rows) */}
              <View style={styles.docSectionContainer}>
                <View style={styles.sectionHeader}>
                  <FileText size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>Required Documents</Text>
                    <Text style={styles.sectionSub}>Upload the minimum required documents for account verification.</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {reqUploaded} of {totalReq} required documents uploaded
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={{
                        height: '100%',
                        backgroundColor: reqUploaded === totalReq && totalReq > 0 ? AUTH_COLORS.success : AUTH_COLORS.primary,
                        borderRadius: 3,
                        width: `${totalReq > 0 ? (reqUploaded / totalReq) * 100 : 0}%`
                      }}
                    />
                  </View>
                </View>

                <View style={styles.docsList}>
                  {reqList.map(doc => (
                    <DocumentUploadRow
                      key={doc.id}
                      document={doc}
                      selectedFile={documents[doc.id]}
                      onFileSelect={(f) => handleFileSelect(doc.id, f)}
                      onFileRemove={() => handleFileRemove(doc.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Post-Registration Compliance Information Strip */}
              <View style={styles.infoNoticeStrip}>
                <AlertCircle size={15} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.infoNoticeText}>
                  Additional compliance documents can be uploaded after account verification.
                </Text>
              </View>

              {/* Compact Validation Summary */}
              {showValidationSummary && validationErrors.length > 0 && (
                <View style={styles.validationBox}>
                  <View style={styles.valHeader}>
                    <AlertCircle size={16} color="#B45309" style={{ marginRight: 6 }} />
                    <Text style={styles.valTitle}>{validationErrors.length} items need attention</Text>
                  </View>
                  <View style={styles.valList}>
                    {validationErrors.slice(0, 4).map((err, idx) => (
                      <Text key={idx} style={styles.valItem}>• {err}</Text>
                    ))}
                    {validationErrors.length > 4 && (
                      <Text style={styles.valMoreText}>+ {validationErrors.length - 4} more items</Text>
                    )}
                  </View>
                </View>
              )}
            </AuthCard>

            {/* Scrollable Button Container */}
            <View style={styles.footerScroll}>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleNext}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.nextBtnText}>Next: Owner Details</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AUTH_COLORS.background },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 40
  },
  contentWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  headerBlock: { marginBottom: 16 },
  stepHeader: { fontSize: 10, fontWeight: '700', color: AUTH_COLORS.primary, letterSpacing: 1, marginBottom: 4 },
  heading: { fontSize: 22, fontWeight: '800', color: AUTH_COLORS.primary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: AUTH_COLORS.muted, lineHeight: 18 },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AUTH_COLORS.primary,
  },
  sectionSub: {
    fontSize: 11,
    color: AUTH_COLORS.muted,
    marginTop: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AUTH_COLORS.primary,
    marginBottom: 14
  },

  specializationSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE'
  },
  specializationSummaryText: {
    fontSize: 12,
    color: AUTH_COLORS.primary,
  },

  mobileFieldContainer: { marginBottom: 16 },
  mobileLabel: { fontSize: 11, fontWeight: '600', color: AUTH_COLORS.primary, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 },
  mobileInputRow: { flexDirection: 'row', alignItems: 'center' },
  mobilePrefix: { backgroundColor: AUTH_COLORS.border, borderWidth: 1, borderColor: AUTH_COLORS.border, borderRightWidth: 0, borderTopLeftRadius: 14, borderBottomLeftRadius: 14, height: 52, paddingHorizontal: 14, justifyContent: 'center' },
  mobilePrefixText: { fontSize: 14, fontWeight: '700', color: AUTH_COLORS.primary },
  mobileInput: { flex: 1, backgroundColor: AUTH_COLORS.input, borderWidth: 1, borderColor: AUTH_COLORS.border, borderLeftWidth: 0, borderTopRightRadius: 14, borderBottomRightRadius: 14, height: 52, paddingHorizontal: 14, fontSize: 15, color: AUTH_COLORS.text },

  rowFields: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  colFields: { flexDirection: 'column', marginBottom: 0 },

  docSectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1
  },
  progressContainer: { marginBottom: 16 },
  progressText: { fontSize: 11, fontWeight: '700', color: AUTH_COLORS.primary, marginBottom: 6 },
  progressBarBg: { height: 6, backgroundColor: AUTH_COLORS.border, borderRadius: 3, overflow: 'hidden' },

  docsList: { marginBottom: 0 },

  infoNoticeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16
  },
  infoNoticeText: {
    fontSize: 12,
    color: AUTH_COLORS.primary,
    flex: 1,
    lineHeight: 16
  },

  validationBox: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 16
  },
  valHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  valTitle: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  valList: { paddingLeft: 6 },
  valItem: { fontSize: 12, color: '#B45309', marginBottom: 3 },
  valMoreText: { fontSize: 11, color: '#B45309', fontStyle: 'italic', marginTop: 2 },

  footerScroll: {
    paddingVertical: 20,
    width: '100%',
  },
  nextBtn: {
    backgroundColor: AUTH_COLORS.primary,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%'
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2
  }
});
