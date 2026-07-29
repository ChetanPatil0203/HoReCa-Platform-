import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform, useWindowDimensions, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { Building2, Phone, ArrowRight, Briefcase, FileText, ChevronDown, ChevronUp, CircleAlert as AlertCircle, MapPin, ShieldCheck, CreditCard, CircleCheck as CheckCircle, Check } from 'lucide-react-native';

import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import RegistrationStepIndicator from '../../components/auth/RegistrationStepIndicator';
import FormField from '../../components/auth/FormField';
import SelectField from '../../components/auth/SelectField';
import DocumentUploadRow from '../../components/auth/DocumentUploadRow';
import { getDocumentRequirements } from '../../config/authDocumentRequirements';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
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
  const contentWidth = isWeb ? Math.min(width * 0.92, 540) : width * 0.92;
  const showTwoColumns = width >= 360;

  // Form State
  const [bizName, setBizName] = useState(existingState.bizName || '');
  const [bizCategory, setBizCategory] = useState(existingState.bizCategory || '');
  const [specialized, setSpecialized] = useState(existingState.specialized || '');
  const [subCategory, setSubCategory] = useState(existingState.subCategory || '');
  const [panNo, setPanNo] = useState(existingState.panNo || '');
  const [gstin, setGstin] = useState(existingState.gstin || '');
  const [brn, setBrn] = useState(existingState.brn || '');
  const [fssaiNo, setFssaiNo] = useState(existingState.fssaiNo || '');
  const [mobile, setMobile] = useState(existingState.mobile || '');
  const [address, setAddress] = useState(existingState.address || '');
  const [city, setCity] = useState(existingState.city || '');
  const [state, setState] = useState(existingState.state || '');
  const [pincode, setPincode] = useState(existingState.pincode || '');
  const [documents, setDocuments] = useState(existingState.documents || {});

  // Documents Config
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [additionalExpanded, setAdditionalExpanded] = useState(false);

  // Validation State
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Auto determine FSSAI requirement
  const isFssaiRequired = 
    bizCategory === 'Hotel' ||
    bizCategory === 'Restaurant' ||
    bizCategory === 'Cafe' ||
    (bizCategory === 'Vendor / Supplier' && specialized === 'Raw Material' && 
     (subCategory ? subCategory.split(',').map(s => s.trim()).some(sub => ['Dairy', 'Vegetables', 'Fruits', 'Grocery', 'Meat', 'Bakery', 'Beverages', 'Spices'].includes(sub)) : false));

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
  const optList = requiredDocs.filter(d => d.requirement === 'Optional');
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
      if (specialized && !subCategory) errorsList.push('Select Subcategory');
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

    // Check required documents
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
    const registrationData = {
      ...existingState,
      bizName: bizName.trim(),
      bizCategory,
      specialized,
      subCategory,
      panNo: panNo.toUpperCase().trim(),
      gstin: gstin.toUpperCase().trim(),
      brn: brn.trim(),
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
          <Text style={styles.stepHeader}>STEP 1 OF 3</Text>
          <Text style={styles.heading}>Business Verification</Text>
          <Text style={styles.subtitle}>Establish your business identity and upload verification documents.</Text>
        </View>

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

                <FormField 
                  label="Business Registration Number" 
                  icon={ShieldCheck} 
                  placeholder="BRN-27-00012345"
                  value={brn}
                  onChangeText={setBrn}
                />
              </View>

              {/* Section 2: Vendor Specialization (conditional) */}
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

                  {specialized && subCategory ? (
                    <View style={styles.specializationSummary}>
                      <Check size={14} color={AUTH_COLORS.success} style={{ marginRight: 6 }} />
                      <Text style={styles.specializationSummaryText}>
                        Selected: <Text style={{ fontWeight: 'bold' }}>{`${specialized} • ${subCategory}`}</Text>
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}

        <View style={styles.sectionHeader}>
          <MapPin size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Location & Compliance Details</Text>
        </View>

        <FormField 
          label="REGISTERED BUSINESS ADDRESS *" 
          icon={MapPin} 
          placeholder="e.g. 123 MG Road, Bandra West"
          value={address}
          onChangeText={setAddress}
        />

        <FormField 
          label="GSTIN NUMBER (OPTIONAL)" 
          icon={FileText} 
          placeholder="15-character GSTIN (e.g. 27AAAAA0000A1Z5)"
          value={gstin}
          onChangeText={setGstin}
          autoCapitalize="characters"
        />

        {bizCategory && bizCategory !== 'Vendor / Supplier' && (
          <FormField 
            label="FSSAI LICENSE NUMBER *" 
            icon={ShieldCheck} 
            placeholder="14-digit FSSAI License No."
            keyboardType="numeric"
            maxLength={14}
            value={fssaiNo}
            onChangeText={setFssaiNo}
          />
        )}

        <View style={styles.sectionHeader}>
          <Phone size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>

        <View style={styles.phoneFieldContainer}>
          <Text style={styles.phoneLabel}>CONTACT MOBILE *</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.phonePrefix}>
              <Text style={styles.phonePrefixText}>+91</Text>
            </View>
            <FormField 
              containerStyle={{ flex: 1, marginBottom: 0 }}
              icon={Phone} 
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>
          <Text style={styles.phoneHelper}>We will send the security OTP to this mobile number.</Text>
        </View>

        {requiredDocs.length > 0 && (
          <View style={styles.docSectionContainer}>
            <View style={styles.sectionHeader}>
              <FileText size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.sectionTitle}>Verification Documents</Text>
                <Text style={styles.sectionSub}>Upload the documents required for your selected business profile.</Text>
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
                          backgroundColor: reqUploaded === totalReq ? AUTH_COLORS.success : AUTH_COLORS.primary,
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

                  {/* Collapsible Additional Documents */}
                  {optList.length > 0 && (
                    <View style={styles.additionalDocsSection}>
                      <TouchableOpacity 
                        style={styles.additionalHeader} 
                        onPress={() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setAdditionalExpanded(!additionalExpanded);
                        }}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                      >
                        <Text style={styles.additionalTitle}>Additional Documents</Text>
                        <View style={styles.additionalRight}>
                          <Text style={styles.additionalBadge}>Optional</Text>
                          {additionalExpanded ? <ChevronUp size={16} color={AUTH_COLORS.muted} /> : <ChevronDown size={16} color={AUTH_COLORS.muted} />}
                        </View>
                      </TouchableOpacity>

                      {additionalExpanded && (
                        <View style={styles.additionalBody}>
                          {optList.map(doc => (
                            <DocumentUploadRow 
                              key={doc.id} 
                              document={doc} 
                              selectedFile={documents[doc.id]} 
                              onFileSelect={(f) => handleFileSelect(doc.id, f)} 
                              onFileRemove={() => handleFileRemove(doc.id)} 
                            />
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : null}

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
          </View>
        </ScrollView>

        <View style={styles.footerSticky}>
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
    paddingVertical: 16 
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
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AUTH_COLORS.primary,
    marginBottom: 14
  },
  sectionCardHeader: {
    marginBottom: 14
  },
  sectionCardSubtitle: {
    fontSize: 11,
    color: AUTH_COLORS.muted,
    marginTop: 2
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
  mobileHelperText: { fontSize: 11, color: AUTH_COLORS.muted, marginTop: 4 },

  rowFields: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  colFields: { flexDirection: 'column', marginBottom: 0 },

  progressContainer: { marginBottom: 16 },
  progressText: { fontSize: 11, fontWeight: '700', color: AUTH_COLORS.primary, marginBottom: 6 },
  progressBarBg: { height: 6, backgroundColor: AUTH_COLORS.border, borderRadius: 3, overflow: 'hidden' },

  docsList: { marginBottom: 8 },

  additionalDocsSection: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 12,
    backgroundColor: '#F8FAFD',
    overflow: 'hidden'
  },
  additionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  additionalTitle: { fontSize: 13, fontWeight: '700', color: AUTH_COLORS.primary },
  additionalRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  additionalBadge: { fontSize: 10, fontWeight: '700', color: AUTH_COLORS.muted, backgroundColor: '#E2E8F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  additionalBody: { padding: 12, borderTopWidth: 1, borderTopColor: AUTH_COLORS.border, backgroundColor: '#FFFFFF' },

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

  footerSticky: {
    borderTopWidth: 1,
    borderTopColor: AUTH_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
