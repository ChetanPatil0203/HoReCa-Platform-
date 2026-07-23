import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform, useWindowDimensions } from 'react-native';
import { Building2, Phone, ArrowRight, Briefcase, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import RegistrationStepIndicator from '../../components/auth/RegistrationStepIndicator';
import FormField from '../../components/auth/FormField';
import SelectField from '../../components/auth/SelectField';
import PrimaryButton from '../../components/auth/PrimaryButton';
import DocumentUploadRow from '../../components/auth/DocumentUploadRow';
import { getDocumentRequirements } from '../../config/authDocumentRequirements';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const BIZ_CATEGORIES = ['Hotel', 'Restaurant', 'Cafe', 'Vendor / Supplier'];
const SPECIALIZED_CATEGORIES = ['Raw Material', 'Manpower', 'Service Provider', 'Marketing Agency'];
const SUB_CATEGORIES = {
  'Raw Material': ['Dairy', 'Vegetables', 'Fruits', 'Grocery', 'Meat', 'Bakery', 'Beverages', 'Spices', 'Packaging'],
  'Manpower': ['Chef', 'Waiter', 'Cleaner', 'Kitchen Helper', 'Manager', 'Delivery Staff'],
  'Service Provider': ['Electrician', 'Plumber', 'Pest Control', 'Cleaning Service', 'Maintenance', 'Security'],
  'Marketing Agency': ['Social Media Marketing', 'SEO', 'Performance Marketing', 'Branding', 'Graphic Design', 'Content Creation', 'Website Development', 'Photography / Videography']
};

export default function RegisterStepOneScreen({ navigation, route }) {
  const existingState = route.params?.registrationData || {};
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [bizName, setBizName] = useState(existingState.bizName || '');
  const [bizCategory, setBizCategory] = useState(existingState.bizCategory || '');
  const [specialized, setSpecialized] = useState(existingState.specialized || '');
  const [subCategory, setSubCategory] = useState(existingState.subCategory || '');
  const [mobile, setMobile] = useState(existingState.mobile || '');
  const [documents, setDocuments] = useState(existingState.documents || {});

  const [requiredDocs, setRequiredDocs] = useState([]);
  
  const [reqExpanded, setReqExpanded] = useState(true);
  const [appExpanded, setAppExpanded] = useState(false);
  const [optExpanded, setOptExpanded] = useState(false);

  useEffect(() => {
    if (bizCategory) {
      const docs = getDocumentRequirements(bizCategory, specialized, subCategory);
      setRequiredDocs(docs);
      setDocuments(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (!docs.find(d => d.id === key)) delete next[key];
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
    }
  };

  const handleSpecializedChange = (val) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSpecialized(val);
    setSubCategory('');
  };

  const handleFileSelect = (docId, file) => setDocuments(prev => ({ ...prev, [docId]: file }));
  const handleFileRemove = (docId) => {
    setDocuments(prev => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const toggleGroup = (setter, val) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!val);
  };

  const reqList = requiredDocs.filter(d => d.requirement === 'Required');
  const appList = requiredDocs.filter(d => d.requirement === 'Required if applicable');
  const optList = requiredDocs.filter(d => d.requirement === 'Optional');

  const reqUploaded = reqList.filter(d => documents[d.id]).length;
  const appUploaded = appList.filter(d => documents[d.id]).length;
  const optUploaded = optList.filter(d => documents[d.id]).length;

  const totalReq = reqList.length;
  const totalUploaded = reqUploaded + appUploaded + optUploaded;
  const totalDocs = requiredDocs.length;

  const isFormComplete = () => {
    if (!bizName.trim() || !bizCategory || mobile.replace(/[^0-9]/g, '').length !== 10) return false;
    if (bizCategory === 'Vendor / Supplier' && (!specialized || !subCategory)) return false;
    if (reqUploaded < totalReq) return false;
    return true;
  };

  const missingReqDocs = reqList.filter(d => !documents[d.id]);

  const handleNext = () => {
    if (!isFormComplete()) return;
    const registrationData = { ...existingState, bizName, bizCategory, specialized, subCategory, mobile, documents };
    navigation.navigate('RegisterStepTwo', { registrationData });
  };

  return (
    <AuthScreenWrapper>
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
          label="BUSINESS OPERATION CATEGORY *"
          icon={Briefcase}
          options={BIZ_CATEGORIES}
          value={bizCategory}
          onSelect={handleCategoryChange}
        />

        {bizCategory && bizCategory !== 'Vendor / Supplier' && (
          <View style={styles.categoryPreview}>
            <Building2 size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.categoryPreviewText}>
              <Text style={{ fontWeight: 'bold' }}>{bizCategory}</Text> selected. Verification documents will be required below.
            </Text>
          </View>
        )}

        {bizCategory === 'Vendor / Supplier' && (
          <View style={styles.vendorSection}>
            <View style={styles.sectionHeader}>
              <Briefcase size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.sectionTitle}>Vendor Specialization</Text>
                <Text style={styles.sectionSub}>Select the type of service your business provides.</Text>
              </View>
            </View>

            <SelectField 
              label="SPECIALIZED CATEGORY *"
              options={SPECIALIZED_CATEGORIES}
              value={specialized}
              onSelect={handleSpecializedChange}
            />

            {specialized ? (
              <SelectField 
                label="SUB CATEGORY *"
                searchable
                options={SUB_CATEGORIES[specialized] || []}
                value={subCategory}
                onSelect={setSubCategory}
              />
            ) : null}

            {specialized && subCategory && (
              <View style={styles.vendorSummary}>
                <Text style={styles.vendorSummaryLabel}>Selected specialization summary:</Text>
                <Text style={styles.vendorSummaryValue}>{specialized} • {subCategory}</Text>
              </View>
            )}
          </View>
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
              <Text style={styles.progressText}>{totalUploaded} of {totalDocs} total documents uploaded</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(totalUploaded / totalDocs) * 100}%`, backgroundColor: reqUploaded === totalReq ? AUTH_COLORS.success : AUTH_COLORS.primary }]} />
              </View>
            </View>

            {reqList.length > 0 && (
              <View style={styles.docGroup}>
                <TouchableOpacity style={styles.docGroupHeader} onPress={() => toggleGroup(setReqExpanded, reqExpanded)} activeOpacity={0.7}>
                  <Text style={styles.docGroupTitle}>Required Documents</Text>
                  <View style={styles.docGroupRight}>
                    <Text style={styles.docGroupCount}>{reqUploaded} of {totalReq} uploaded</Text>
                    {reqExpanded ? <ChevronUp size={20} color={AUTH_COLORS.muted} /> : <ChevronDown size={20} color={AUTH_COLORS.muted} />}
                  </View>
                </TouchableOpacity>
                {reqExpanded && (
                  <View style={styles.docGroupBody}>
                    {reqList.map(doc => (
                      <DocumentUploadRow key={doc.id} document={doc} selectedFile={documents[doc.id]} onFileSelect={(f) => handleFileSelect(doc.id, f)} onFileRemove={() => handleFileRemove(doc.id)} />
                    ))}
                  </View>
                )}
              </View>
            )}

            {appList.length > 0 && (
              <View style={styles.docGroup}>
                <TouchableOpacity style={styles.docGroupHeader} onPress={() => toggleGroup(setAppExpanded, appExpanded)} activeOpacity={0.7}>
                  <Text style={styles.docGroupTitle}>Required if Applicable</Text>
                  <View style={styles.docGroupRight}>
                    <Text style={styles.docGroupCount}>{appUploaded} of {appList.length} uploaded</Text>
                    {appExpanded ? <ChevronUp size={20} color={AUTH_COLORS.muted} /> : <ChevronDown size={20} color={AUTH_COLORS.muted} />}
                  </View>
                </TouchableOpacity>
                {appExpanded && (
                  <View style={styles.docGroupBody}>
                    {appList.map(doc => (
                      <DocumentUploadRow key={doc.id} document={doc} selectedFile={documents[doc.id]} onFileSelect={(f) => handleFileSelect(doc.id, f)} onFileRemove={() => handleFileRemove(doc.id)} />
                    ))}
                  </View>
                )}
              </View>
            )}

            {optList.length > 0 && (
              <View style={styles.docGroup}>
                <TouchableOpacity style={styles.docGroupHeader} onPress={() => toggleGroup(setOptExpanded, optExpanded)} activeOpacity={0.7}>
                  <Text style={styles.docGroupTitle}>Optional Documents</Text>
                  <View style={styles.docGroupRight}>
                    <Text style={styles.docGroupCount}>{optUploaded} uploaded</Text>
                    {optExpanded ? <ChevronUp size={20} color={AUTH_COLORS.muted} /> : <ChevronDown size={20} color={AUTH_COLORS.muted} />}
                  </View>
                </TouchableOpacity>
                {optExpanded && (
                  <View style={styles.docGroupBody}>
                    {optList.map(doc => (
                      <DocumentUploadRow key={doc.id} document={doc} selectedFile={documents[doc.id]} onFileSelect={(f) => handleFileSelect(doc.id, f)} onFileRemove={() => handleFileRemove(doc.id)} />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {missingReqDocs.length > 0 && bizCategory && (
          <View style={styles.validationSummary}>
            <View style={styles.valHeader}>
              <AlertCircle size={16} color="#C2410C" style={{ marginRight: 8 }} />
              <Text style={styles.valTitle}>Complete the following before continuing:</Text>
            </View>
            {missingReqDocs.slice(0, 3).map(doc => (
              <Text key={doc.id} style={styles.valItem}>• Upload {doc.name}</Text>
            ))}
            {missingReqDocs.length > 3 && (
              <Text style={styles.valItem}>• +{missingReqDocs.length - 3} more required documents</Text>
            )}
            {!bizName.trim() && <Text style={styles.valItem}>• Enter Business Name</Text>}
            {mobile.replace(/[^0-9]/g, '').length !== 10 && <Text style={styles.valItem}>• Enter valid 10-digit Mobile Number</Text>}
          </View>
        )}

        <View style={styles.footerAction}>
          <PrimaryButton 
            title="NEXT: EXECUTIVE INFO" 
            icon={ArrowRight} 
            onPress={handleNext} 
            disabled={!isFormComplete()} 
          />
        </View>

      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginBottom: 26 },
  stepHeader: { fontSize: 11, fontWeight: '700', color: AUTH_COLORS.primary, letterSpacing: 1, marginBottom: 8 },
  heading: { fontSize: 26, fontWeight: 'bold', color: AUTH_COLORS.primary, marginBottom: 6, lineHeight: 30 },
  subtitle: { fontSize: 14, color: AUTH_COLORS.muted, lineHeight: 20 },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: AUTH_COLORS.primary },
  sectionSub: { fontSize: 13, color: AUTH_COLORS.muted, marginTop: 2, flexShrink: 1 },

  categoryPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', padding: 12, borderRadius: 12, marginBottom: 16 },
  categoryPreviewText: { fontSize: 13, color: AUTH_COLORS.primary, flex: 1 },

  vendorSection: { backgroundColor: AUTH_COLORS.input, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: AUTH_COLORS.border, marginBottom: 24, marginTop: 8 },
  vendorSummary: { backgroundColor: '#F0F4F8', padding: 12, borderRadius: 10, marginTop: 4 },
  vendorSummaryLabel: { fontSize: 11, color: AUTH_COLORS.primary, fontWeight: '600', marginBottom: 2, textTransform: 'uppercase' },
  vendorSummaryValue: { fontSize: 14, color: AUTH_COLORS.text, fontWeight: 'bold' },

  phoneFieldContainer: { marginBottom: 20 },
  phoneLabel: { fontSize: 11, fontWeight: '600', color: AUTH_COLORS.primary, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center' },
  phonePrefix: { backgroundColor: AUTH_COLORS.border, borderWidth: 1, borderColor: AUTH_COLORS.border, borderRightWidth: 0, borderTopLeftRadius: 14, borderBottomLeftRadius: 14, height: 52, paddingHorizontal: 16, justifyContent: 'center' },
  phonePrefixText: { fontSize: 15, fontWeight: 'bold', color: AUTH_COLORS.primary },
  phoneHelper: { fontSize: 12, color: AUTH_COLORS.muted, marginTop: 6 },

  docSectionContainer: { marginTop: 8 },
  progressContainer: { marginBottom: 20 },
  progressText: { fontSize: 12, fontWeight: '600', color: AUTH_COLORS.primary, marginBottom: 6 },
  progressBarBg: { height: 6, backgroundColor: AUTH_COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  docGroup: { marginBottom: 12, backgroundColor: AUTH_COLORS.input, borderRadius: 14, borderWidth: 1, borderColor: AUTH_COLORS.border, overflow: 'hidden' },
  docGroupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  docGroupTitle: { fontSize: 14, fontWeight: 'bold', color: AUTH_COLORS.primary },
  docGroupRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  docGroupCount: { fontSize: 12, fontWeight: '600', color: AUTH_COLORS.muted },
  docGroupBody: { paddingHorizontal: 12, paddingBottom: 12 },

  validationSummary: { backgroundColor: '#FFF7ED', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#FFEDD5', marginTop: 16, marginBottom: 8 },
  valHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  valTitle: { fontSize: 13, fontWeight: 'bold', color: '#9A3412' },
  valItem: { fontSize: 13, color: '#C2410C', marginBottom: 4, marginLeft: 24 },

  footerAction: { marginTop: 24 }
});
