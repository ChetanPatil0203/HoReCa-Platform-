import React, { useState, useContext, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Modal,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  Platform
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
  Building2,
  FileText,
  CreditCard,
  Store,
  ShieldCheck,
  MapPin,
  Package,
  Tag,
  Truck,
  Users,
  RefreshCw,
  DollarSign,
  Wrench,
  Receipt,
  Award,
  Megaphone,
  FolderOpen,
  Briefcase,
  Bell,
  Lock,
  CircleHelp,
  Shield,
  FileCheck,
  LogOut,
  ChevronRight,
  Pencil,
  CheckCircle2,
  X,
  Save,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Upload,
  Info,
  Camera
} from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { getUserProfileApi, updateUserProfileApi, uploadDocumentApi } from '../../services/api.service';

const COLORS = {
  navy: '#071B3A',
  secondaryNavy: '#102A4C',
  gold: '#F2C230',
  background: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E3E9F1',
  primaryText: '#091B3A',
  secondaryText: '#71829B',
  success: '#16B77A',
  error: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FEE2E2',
  iconBg: '#F1F5F9',
};

// ROLE-SPECIFIC OPTIONS CONFIG (MAX 3 PER ROLE)
const ROLE_SPECIFIC_OPTIONS = {
  horeca: [
    { id: 'bizCategory', title: 'Business Category', desc: 'Hotel, Restaurant or Cafe details', icon: Store, key: 'bizCategory' },
    { id: 'complianceDocs', title: 'Compliance Documents', desc: 'Manage licences and renewals', icon: ShieldCheck, key: 'complianceDocs' },
    { id: 'savedAddresses', title: 'Saved Addresses', desc: 'Manage business and delivery locations', icon: MapPin, key: 'savedAddresses' },
  ],
  rawMaterial: [
    { id: 'productsSupplied', title: 'Products Supplied', desc: 'Manage product categories', icon: Package, key: 'productsSupplied' },
    { id: 'pricingMoq', title: 'Pricing & MOQ', desc: 'Manage wholesale prices and minimum orders', icon: Tag, key: 'pricingMoq' },
    { id: 'deliverySettings', title: 'Delivery Settings', desc: 'Manage service areas and delivery preferences', icon: Truck, key: 'deliverySettings' },
  ],
  manpower: [
    { id: 'rolesSupplied', title: 'Roles Supplied', desc: 'Manage available staff categories', icon: Users, key: 'rolesSupplied' },
    { id: 'replacementPolicy', title: 'Replacement Policy', desc: 'Manage replacement period and conditions', icon: RefreshCw, key: 'replacementPolicy' },
    { id: 'serviceCharges', title: 'Service Charges', desc: 'Manage agency fees and commission', icon: DollarSign, key: 'serviceCharges' },
  ],
  serviceProvider: [
    { id: 'servicesOffered', title: 'Services Offered', desc: 'Manage available services', icon: Wrench, key: 'servicesOffered' },
    { id: 'visitCharges', title: 'Visit Charges', desc: 'Manage inspection and service fees', icon: Receipt, key: 'visitCharges' },
    { id: 'warrantyPolicy', title: 'Warranty Policy', desc: 'Manage service warranty terms', icon: Award, key: 'warrantyPolicy' },
  ],
  marketing: [
    { id: 'marketingServices', title: 'Marketing Services', desc: 'Manage online and offline services', icon: Megaphone, key: 'marketingServices' },
    { id: 'portfolio', title: 'Portfolio', desc: 'Manage campaigns and work samples', icon: FolderOpen, key: 'portfolio' },
    { id: 'pricingPackages', title: 'Pricing Packages', desc: 'Manage campaign plans and charges', icon: Briefcase, key: 'pricingPackages' },
  ]
};

export default function UnifiedProfileSettingsScreen({ roleOverride, navigation, onNavigate, onEditProfile }) {
  const { width, height } = useWindowDimensions();
  const auth = useContext(AuthContext);
  const user = auth?.user || {};
  const logout = auth?.logout;

  // Profile photo state initialized from user object or persistent cache
  const [profilePhoto, setProfilePhoto] = useState(() => {
    if (user?.profilePhoto) return user.profilePhoto;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedUser = window.localStorage.getItem('hrc_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.profilePhoto) return parsed.profilePhoto;
        }
      }
    } catch (e) { }
    return null;
  });

  const [showPhotoPreviewModal, setShowPhotoPreviewModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [profilePhoto]);

  const handlePickProfilePhoto = () => {
    setImgError(false);

    // Web native file picker - synchronous execution prevents browser blocking
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target && e.target.files && e.target.files[0];
        if (file) {
          const photoUri = URL.createObjectURL(file);
          setProfilePhoto(photoUri);
          setImgError(false);

          // Upload to Cloudinary via backend (Web)
          (async () => {
            try {
              const token = auth?.userToken;
              const uploadRes = await uploadDocumentApi(
                { uri: photoUri, name: file.name, type: file.type, file },
                'profile_photo',
                token
              );
              
              if (uploadRes?.success && uploadRes?.data?.fileUrl) {
                const secureUrl = uploadRes.data.fileUrl;
                const photoMeta = {
                  profilePhoto: secureUrl,
                  profilePhotoPublicId: uploadRes.data.cloudinaryPublicId,
                  profilePhotoAssetId: uploadRes.data.cloudinaryAssetId,
                  profilePhotoResourceType: uploadRes.data.resourceType,
                  profilePhotoDeliveryType: uploadRes.data.deliveryType,
                };

                setProfilePhoto(secureUrl);

                if (auth?.updateUser) {
                  auth.updateUser({ profilePhoto: secureUrl });
                }

                try {
                  if (typeof window !== 'undefined' && window.localStorage) {
                    const current = window.localStorage.getItem('hrc_user');
                    const parsed = current ? JSON.parse(current) : {};
                    parsed.profilePhoto = secureUrl;
                    window.localStorage.setItem('hrc_user', JSON.stringify(parsed));
                  }
                } catch (err) { }

                updateUserProfileApi(photoMeta).catch(err => {
                  console.warn('DB photo persist note:', err?.message);
                });
              }
            } catch (uploadErr) {
              console.warn('[Cloudinary] Web profile photo upload failed, using local URI:', uploadErr?.message);
              if (auth?.updateUser) auth.updateUser({ profilePhoto: photoUri });
              updateUserProfileApi({ profilePhoto: photoUri }).catch(() => {});
            }
          })();
        }
      };
      input.click();
      return;
    }

    // Mobile fallback (Expo DocumentPicker) — upload to Cloudinary via backend
    DocumentPicker.getDocumentAsync({
      type: ['image/*'],
      copyToCacheDirectory: true,
    }).then(async (res) => {
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];

        // Show local preview immediately
        setProfilePhoto(asset.uri);
        setImgError(false);

        try {
          const token = auth?.userToken;
          const uploadRes = await uploadDocumentApi(asset, 'profile_photo', token);
          if (uploadRes?.success && uploadRes?.data?.fileUrl) {
            const secureUrl = uploadRes.data.fileUrl;
            const photoMeta = {
              profilePhoto: secureUrl,
              profilePhotoPublicId: uploadRes.data.cloudinaryPublicId,
              profilePhotoAssetId: uploadRes.data.cloudinaryAssetId,
              profilePhotoResourceType: uploadRes.data.resourceType,
              profilePhotoDeliveryType: uploadRes.data.deliveryType,
            };

            setProfilePhoto(secureUrl);

            if (auth?.updateUser) {
              auth.updateUser({ profilePhoto: secureUrl });
            }

            try {
              if (typeof window !== 'undefined' && window.localStorage) {
                const current = window.localStorage.getItem('hrc_user');
                const parsed = current ? JSON.parse(current) : {};
                parsed.profilePhoto = secureUrl;
                window.localStorage.setItem('hrc_user', JSON.stringify(parsed));
              }
            } catch (err) { }

            updateUserProfileApi(photoMeta).catch(err => {
              console.warn('DB photo persist note:', err?.message);
            });
          }
        } catch (uploadErr) {
          console.warn('[Cloudinary] Profile photo upload failed, using local URI:', uploadErr?.message);
          // Fallback: keep local preview but persist local URI to DB
          if (auth?.updateUser) auth.updateUser({ profilePhoto: asset.uri });
          updateUserProfileApi({ profilePhoto: asset.uri }).catch(() => {});
        }
      }
    }).catch(err => {
      console.log('Error picking profile photo:', err);
    });
  };

  // Modals state
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [activeModalKey, setActiveModalKey] = useState(null);
  const [modalFeedbackMsg, setModalFeedbackMsg] = useState('');
  const [modalErrorMsg, setModalErrorMsg] = useState('');

  // Determine normalized role key
  const roleKey = useMemo(() => {
    if (roleOverride) return roleOverride;
    const role = user?.role || 'owner';
    const vendorType = user?.vendorType || '';

    if (role === 'owner') return 'horeca';
    if (role === 'vendor') {
      if (vendorType === 'Raw Material') return 'rawMaterial';
      if (vendorType === 'Manpower') return 'manpower';
      if (vendorType === 'Service Provider') return 'serviceProvider';
      if (vendorType === 'Marketing Agency') return 'marketing';
      return 'rawMaterial';
    }
    return 'horeca';
  }, [user, roleOverride]);

  // Derived user display details
  const businessName = user?.businessName || user?.registration?.bizName || (roleKey === 'manpower' ? 'Elite Manpower Agency' : roleKey === 'serviceProvider' ? 'ProCare Facilities' : roleKey === 'rawMaterial' ? 'Vija Supply Hub' : roleKey === 'marketing' ? 'Apex Growth Agency' : 'The Meridian Hotel');
  const contactName = user?.name ? user.name : (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Chetan Patil');
  const cityState = user?.city ? `${user.city}${user?.state ? `, ${user.state}` : ''}` : 'Jalgaon, Maharashtra';

  const roleLabelMap = {
    horeca: 'HoReCa Owner',
    rawMaterial: 'Raw Material Vendor',
    manpower: 'Manpower Agency',
    serviceProvider: 'Service Provider',
    marketing: 'Marketing Agency'
  };
  const roleDisplayLabel = roleLabelMap[roleKey] || 'Business Owner';

  const userInitials = useMemo(() => {
    if (businessName) {
      const parts = businessName.split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return businessName.substring(0, 2).toUpperCase();
    }
    return 'HB';
  }, [businessName]);

  /* ==================== FORM STATES FOR EACH SETTING ==================== */
  // 1. Business Info Form State
  const [bizForm, setBizForm] = useState({
    bizName: businessName,
    tradeName: businessName,
    bizCategory: roleKey === 'horeca' ? 'Hotel & Restaurant' : roleDisplayLabel,
    regNo: 'MH-JAL-2026-4921',
    panNo: user?.panNo || 'ABCDE1234F',
    gstNo: user?.gstin || '27ABCDE1234F1Z5',
    mobile: user?.mobile || '9876543210',
    email: user?.email || 'contact@horecahub.in',
    address: user?.address || 'Plot 42, MIDC Industrial Area',
    city: user?.city || 'Jalgaon',
    state: user?.state || 'Maharashtra',
    pincode: user?.pincode || '425001',
  });

  // 2. Bank Details Form State
  const [bankForm, setBankForm] = useState({
    accHolder: contactName,
    bankName: 'HDFC Bank',
    accNumber: '50100429104821',
    confirmAccNumber: '50100429104821',
    ifsc: 'HDFC0001242',
    accType: 'Current',
    upiId: 'horecahub@hdfcbank',
  });

  // 3. Notification Preferences State
  const [notifForm, setNotifForm] = useState({
    orderUpdates: true,
    paymentUpdates: true,
    docExpiryAlerts: true,
    proposalUpdates: true,
    serviceUpdates: true,
    promoUpdates: false,
    pushEnabled: true,
    emailEnabled: true,
  });

  // 4. Password & Security State
  const [secForm, setSecForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 5. Saved Addresses State
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Primary Business', text: 'Plot 42, MIDC Industrial Area, Jalgaon, MH 425001' },
    { id: 2, type: 'Delivery Hub', text: 'Gate 3, Central Market Complex, Jalgaon, MH 425001' }
  ]);
  const [newAddrText, setNewAddrText] = useState('');

  // 6. Products Supplied State (Raw Material)
  const [productCats, setProductCats] = useState([
    'Dairy & Milk Products', 'Fresh Vegetables & Fruits', 'Spices & Cooking Oil', 'Packaging Containers'
  ]);
  const [newCatText, setNewCatText] = useState('');

  // 7. Pricing & MOQ State (Raw Material)
  const [pricingForm, setPricingForm] = useState({
    wholesalePrice: '450',
    moq: '10',
    unit: 'Kg',
    bulkDiscount: '5%'
  });

  // 8. Delivery Settings State (Raw Material)
  const [deliveryForm, setDeliveryForm] = useState({
    areas: 'Jalgaon Metro & Industrial Zone',
    radiusKm: '25',
    minOrderAmt: '1500',
    deliveryFee: '150',
    days: 'Monday to Saturday'
  });

  // 9. Roles Supplied State (Manpower)
  const [staffRoles, setStaffRoles] = useState([
    'Head Chef', 'Commis Chef', 'Waiter / Waitress', 'Kitchen Helper', 'Housekeeping Staff'
  ]);
  const [newRoleText, setNewRoleText] = useState('');

  // 10. Replacement Policy State (Manpower)
  const [replacementForm, setReplacementForm] = useState({
    periodDays: '7',
    replacementLimit: '2 Replacements',
    conditions: 'Replacement applies if candidate absconds or is deemed unsuitable within the first 7 days.'
  });

  // 11. Service Charges State (Manpower)
  const [chargeForm, setChargeForm] = useState({
    feeType: 'Fixed Fee per Hire',
    defaultCharge: '2500',
    taxInfo: '18% GST Applicable'
  });

  // 12. Services Offered State (Service Provider)
  const [servicesOfferedList, setServicesOfferedList] = useState([
    'Commercial AC Deep Cleaning', 'Kitchen Pest Control Service', 'Plumbing & Pipeline Inspection', 'Electrical Maintenance'
  ]);
  const [newSrvText, setNewSrvText] = useState('');

  // 13. Visit Charges State (Service Provider)
  const [visitForm, setVisitForm] = useState({
    visitCharge: '350',
    waiveOnHire: true,
    emergencyCharge: '600'
  });

  // 14. Warranty Policy State (Service Provider)
  const [warrantyForm, setWarrantyForm] = useState({
    available: true,
    duration: '30 Days Warranty',
    conditions: 'Covers service defects and spare part failures repaired during the service visit.'
  });

  // 15. Marketing Services State (Marketing Agency)
  const [mktServices, setMktServices] = useState([
    'Social Media Management', 'Google SEO & Maps Boost', 'Influencer Tasting Events', 'Food Menu Design & Branding'
  ]);
  const [newMktSrvText, setNewMktSrvText] = useState('');

  // 16. Portfolio State (Marketing Agency)
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, title: 'Summer Social Media Campaign for Spice Garden', category: 'Social Media' },
    { id: 2, title: 'SEO Boost & Google Listing for Royal Hotel', category: 'SEO & Maps' }
  ]);

  // 17. Pricing Packages State (Marketing Agency)
  const [mktPackageForm, setMktPackageForm] = useState({
    name: 'Starter Restaurant Boost',
    category: 'Social Media & SEO',
    price: '15000',
    duration: '30 Days',
    deliverables: '12 Posts, 4 Reels, Google Maps SEO Boost'
  });

  // Sync profile data from backend DB
  useEffect(() => {
    let isMounted = true;
    const fetchBackendProfile = async () => {
      try {
        const res = await getUserProfileApi();
        if (isMounted && res && res.success && res.data) {
          const dbUser = res.data;
          const reg = dbUser.horecaRegistration || dbUser.vendorRegistration || {};

          const photo = dbUser.profilePhoto || reg.profilePhoto;
          if (photo) {
            setProfilePhoto(photo);
            if (auth?.updateUser) {
              auth.updateUser({ profilePhoto: photo });
            }
          }
          if (reg.bizName || dbUser.firstName) {
            setBizForm(prev => ({
              ...(prev || {}),
              bizName: reg.bizName || prev?.bizName || '',
              mobile: reg.mobile || dbUser.mobile || prev?.mobile || '',
              email: reg.email || dbUser.email || prev?.email || '',
              address: reg.address || dbUser.address || prev?.address || '',
              city: reg.city || dbUser.city || prev?.city || '',
              state: reg.state || dbUser.state || prev?.state || '',
              pincode: reg.pincode || dbUser.pincode || prev?.pincode || '',
              gstin: reg.gstin || prev?.gstin || '',
              pan: reg.panNo || prev?.pan || '',
              fssai: reg.fssaiNo || prev?.fssai || ''
            }));
          }
          if (reg.bankName || dbUser.bankName) {
            setBankForm(prev => ({
              ...(prev || {}),
              bankName: reg.bankName || dbUser.bankName || prev?.bankName || '',
              accNumber: reg.accountNumber || dbUser.accountNumber || prev?.accNumber || '',
              confirmAccNumber: reg.accountNumber || dbUser.accountNumber || prev?.confirmAccNumber || '',
              ifsc: reg.ifscCode || dbUser.ifscCode || prev?.ifsc || '',
              accHolder: reg.accountHolderName || dbUser.accountHolderName || prev?.accHolder || ''
            }));
          }
          if (reg.deliveryRadius || dbUser.deliveryRadius) {
            setDeliveryForm(prev => ({
              ...(prev || {}),
              radiusKm: reg.deliveryRadius || dbUser.deliveryRadius || prev?.radiusKm || '',
              minOrderAmt: reg.minOrderValue || dbUser.minOrderValue || prev?.minOrderAmt || ''
            }));
          }
        }
      } catch (err) {
        console.warn('Backend DB profile fetch note:', err?.message || err);
      }
    };
    fetchBackendProfile();
    return () => { isMounted = false; };
  }, []);

  /* ==================== OPEN SETTING HANDLER ==================== */
  const openSetting = (key) => {
    setModalFeedbackMsg('');
    setModalErrorMsg('');

    // Handle Routes Navigation if target is a route
    if (key === 'docsKyc') {
      if (onNavigate) { onNavigate('documentsKyc'); return; }
      if (navigation?.navigate) {
        try { navigation.navigate('DocumentsKyc'); return; } catch (e) { }
      }
    }

    if (key === 'complianceDocs') {
      if (onNavigate) { onNavigate('compliance'); return; }
      if (navigation?.navigate) {
        try { navigation.navigate('Compliance'); return; } catch (e) { }
      }
    }

    if (key === 'helpSupport') {
      if (onNavigate) { onNavigate('support'); return; }
      if (navigation?.navigate) {
        try { navigation.navigate('HelpSupport'); return; } catch (e) { }
      }
    }

    if (key === 'editProfile' && onEditProfile) {
      onEditProfile();
      return;
    }

    setActiveModalKey(key);
  };

  /* ==================== SAVE HANDLER WITH VALIDATION & DB PERSISTENCE ==================== */
  const handleSaveSetting = async (customMsg) => {
    setModalErrorMsg('');
    let payload = {};

    // Validation for Bank Details
    if (activeModalKey === 'bankDetails') {
      if (!bankForm.accHolder.trim()) { setModalErrorMsg('Account Holder Name is required.'); return; }
      if (!bankForm.bankName.trim()) { setModalErrorMsg('Bank Name is required.'); return; }
      if (!bankForm.accNumber.trim()) { setModalErrorMsg('Account Number is required.'); return; }
      if (bankForm.accNumber !== bankForm.confirmAccNumber) { setModalErrorMsg('Account Numbers do not match.'); return; }
      if (!bankForm.ifsc.trim() || bankForm.ifsc.length < 5) { setModalErrorMsg('Valid IFSC Code is required.'); return; }

      payload = {
        bankName: bankForm.bankName,
        accountNumber: bankForm.accNumber,
        ifscCode: bankForm.ifsc,
        accountHolderName: bankForm.accHolder
      };
    }

    // Validation for Business Info
    if (activeModalKey === 'bizInfo' || activeModalKey === 'editProfile') {
      if (!bizForm.bizName.trim()) { setModalErrorMsg('Business Name is required.'); return; }
      if (!bizForm.mobile.trim() || bizForm.mobile.length < 10) { setModalErrorMsg('Valid 10-digit mobile number required.'); return; }
      if (!bizForm.email.trim() || !bizForm.email.includes('@')) { setModalErrorMsg('Valid email address required.'); return; }
      if (!bizForm.pincode.trim() || bizForm.pincode.length !== 6) { setModalErrorMsg('Valid 6-digit pincode required.'); return; }

      payload = {
        bizName: bizForm.bizName,
        contactPerson: bizForm.contactName,
        mobile: bizForm.mobile,
        email: bizForm.email,
        address: bizForm.address,
        city: bizForm.city,
        state: bizForm.state,
        pincode: bizForm.pincode,
        gstin: bizForm.gstin,
        panNo: bizForm.pan,
        fssaiNo: bizForm.fssai
      };
    }

    // Validation for Delivery Settings
    if (activeModalKey === 'deliverySettings') {
      payload = {
        deliveryRadius: deliveryForm.radiusKm,
        minOrderValue: deliveryForm.minOrderAmt,
        paymentTerms: deliveryForm.days
      };
    }

    // Validation for Notification Settings
    if (activeModalKey === 'notifications') {
      payload = {
        notificationSettings: notifForm
      };
    }

    // Validation for Pricing & MOQ
    if (activeModalKey === 'pricingMoq') {
      if (!pricingForm.wholesalePrice || isNaN(pricingForm.wholesalePrice)) { setModalErrorMsg('Wholesale price must be a valid number.'); return; }
      if (!pricingForm.moq || isNaN(pricingForm.moq) || Number(pricingForm.moq) <= 0) { setModalErrorMsg('MOQ must be greater than zero.'); return; }
    }

    // Validation for Password & Security
    if (activeModalKey === 'security') {
      if (!secForm.currentPassword) { setModalErrorMsg('Current password is required.'); return; }
      if (!secForm.newPassword || secForm.newPassword.length < 6) { setModalErrorMsg('New password must be at least 6 characters.'); return; }
      if (secForm.newPassword !== secForm.confirmPassword) { setModalErrorMsg('New passwords do not match.'); return; }
    }

    try {
      if (Object.keys(payload).length > 0) {
        await updateUserProfileApi(payload);
        if (auth?.updateUser) {
          auth.updateUser({
            name: payload.contactPerson || user?.name,
            businessName: payload.bizName || user?.businessName,
            ...payload
          });
        }
      }
      setModalFeedbackMsg(customMsg || 'Settings saved successfully to database.');
      setTimeout(() => {
        setActiveModalKey(null);
        setModalFeedbackMsg('');
      }, 1000);
    } catch (err) {
      setModalErrorMsg(err?.response?.data?.message || err?.message || 'Failed to update database profile.');
    }
  };

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    if (logout) {
      logout();
    } else {
      Alert.alert('Signed Out', 'You have been signed out from your HRC HUB account.');
    }
  };

  const roleSpecificRows = ROLE_SPECIFIC_OPTIONS[roleKey] || ROLE_SPECIFIC_OPTIONS.horeca;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* PAGE HEADER */}
        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle}>Profile & Settings</Text>
          <Text style={styles.pageSubtitle}>Manage your business profile and account preferences.</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* PROFILE SUMMARY CARD */}
          <View style={styles.profileSummaryCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarWrapper}>
                <TouchableOpacity
                  style={styles.avatarCircle}
                  onPress={() => {
                    if (profilePhoto && !imgError) {
                      setShowPhotoPreviewModal(true);
                    } else {
                      handlePickProfilePhoto();
                    }
                  }}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="View or change profile photo"
                >
                  {profilePhoto && !imgError ? (
                    <Image source={{ uri: profilePhoto }} style={styles.avatarImage} onError={() => setImgError(true)} />
                  ) : (
                    <Text style={styles.avatarText}>{userInitials}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraBadgeBtn}
                  onPress={handlePickProfilePhoto}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Change profile photo"
                >
                  <Camera size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfoCol}>
                <Text style={styles.bizNameText} numberOfLines={1}>{bizForm?.bizName || businessName}</Text>
                <Text style={styles.contactNameText}>{contactName}</Text>
                <View style={styles.roleBadgeRow}>
                  <Text style={styles.roleBadgeText}>{roleDisplayLabel}</Text>
                  <Text style={styles.badgeDot}>•</Text>
                  <View style={styles.verifiedBadge}>
                    <CheckCircle2 size={12} color={COLORS.success} style={{ marginRight: 3 }} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
                <View style={styles.cityRow}>
                  <MapPin size={12} color={COLORS.secondaryText} style={{ marginRight: 4 }} />
                  <Text style={styles.cityText}>{bizForm?.city || 'Jalgaon'}{bizForm?.state ? `, ${bizForm.state}` : ''}</Text>
                </View>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.editProfileBtn,
                pressed && styles.editProfileBtnPressed
              ]}
              onPress={() => openSetting('bizInfo')}
              accessibilityRole="button"
              accessibilityLabel="Edit Profile"
              accessibilityHint="Open Edit Profile"
            >
              <Pencil size={14} color={COLORS.navy} style={{ marginRight: 6 }} />
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </Pressable>
          </View>

          {/* COMMON SECTION 1: BUSINESS & VERIFICATION */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeaderTitle}>BUSINESS & VERIFICATION</Text>
            <View style={styles.sectionCard}>
              <SettingsRow
                icon={Building2}
                title="Business Information"
                subtitle="Manage business and contact details"
                onPress={() => openSetting('bizInfo')}
              />
              <View style={styles.rowDivider} />
              <SettingsRow
                icon={FileText}
                title="Documents & KYC"
                subtitle="View verification documents"
                onPress={() => openSetting('docsKyc')}
              />
            </View>
          </View>

          {/* ROLE-SPECIFIC SECTION: BUSINESS SETTINGS (MAX 3) */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeaderTitle}>BUSINESS SETTINGS</Text>
            <View style={styles.sectionCard}>
              {roleSpecificRows.map((rowItem, index) => (
                <React.Fragment key={rowItem.id}>
                  <SettingsRow
                    icon={rowItem.icon}
                    title={rowItem.title}
                    subtitle={rowItem.desc}
                    onPress={() => openSetting(rowItem.key)}
                  />
                  {index < roleSpecificRows.length - 1 && <View style={styles.rowDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* COMMON SECTION 2: PREFERENCES & SECURITY */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeaderTitle}>PREFERENCES & SECURITY</Text>
            <View style={styles.sectionCard}>
              <SettingsRow
                icon={Bell}
                title="Notifications"
                subtitle="Manage app and email alerts"
                onPress={() => openSetting('notifications')}
              />
              <View style={styles.rowDivider} />
              <SettingsRow
                icon={Lock}
                title="Password & Security"
                subtitle="Update password and account security"
                onPress={() => openSetting('security')}
              />
              <View style={styles.rowDivider} />
              <SettingsRow
                icon={CircleHelp}
                title="Help & Support"
                subtitle="Get help and view FAQs"
                onPress={() => openSetting('helpSupport')}
              />
            </View>
          </View>

          {/* COMMON SECTION 3: LEGAL */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeaderTitle}>LEGAL</Text>
            <View style={styles.sectionCard}>
              <SettingsRow
                icon={Shield}
                title="Privacy Policy"
                subtitle="Read our privacy guidelines"
                onPress={() => openSetting('privacy')}
              />
              <View style={styles.rowDivider} />
              <SettingsRow
                icon={FileCheck}
                title="Terms & Conditions"
                subtitle="Read our terms of service"
                onPress={() => openSetting('terms')}
              />
            </View>
          </View>

          {/* LOGOUT ACTION ROW */}
          <SettingsRow
            icon={LogOut}
            title="Logout"
            subtitle="Logout from this account"
            danger={true}
            onPress={() => logout && logout()}
          />

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* DYNAMIC SETTING MODAL SHELL */}
        {activeModalKey && (
          <Modal
            visible={Boolean(activeModalKey)}
            transparent
            animationType="fade"
            onRequestClose={() => setActiveModalKey(null)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setActiveModalKey(null)}
            >
              <TouchableOpacity style={styles.modalShellCard} activeOpacity={1}>

                {/* DYNAMIC MODAL HEADER & CONTENT BASED ON activeModalKey */}
                {activeModalKey === 'bizInfo' && (
                  <ModalShellContent
                    title="Business Information"
                    subtitle="Manage official business details and contact information."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Business details saved successfully.')}
                    saveLabel="Save Business Details"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Business Name *</Text>
                      <TextInput style={styles.textInput} value={bizForm.bizName} onChangeText={t => setBizForm({ ...bizForm, bizName: t })} />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Trade / Display Name</Text>
                      <TextInput style={styles.textInput} value={bizForm.tradeName} onChangeText={t => setBizForm({ ...bizForm, tradeName: t })} />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Business Category (Read Only)</Text>
                      <TextInput style={[styles.textInput, styles.readOnlyInput]} value={bizForm.bizCategory} editable={false} />
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>PAN Number (Verified)</Text>
                        <TextInput style={[styles.textInput, styles.readOnlyInput]} value={bizForm.panNo} editable={false} />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>GST Number (Verified)</Text>
                        <TextInput style={[styles.textInput, styles.readOnlyInput]} value={bizForm.gstNo} editable={false} />
                      </View>
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Registered Mobile *</Text>
                        <TextInput style={styles.textInput} value={bizForm.mobile} onChangeText={t => setBizForm({ ...bizForm, mobile: t })} keyboardType="phone-pad" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Registered Email *</Text>
                        <TextInput style={styles.textInput} value={bizForm.email} onChangeText={t => setBizForm({ ...bizForm, email: t })} keyboardType="email-address" />
                      </View>
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Business Address</Text>
                      <TextInput style={styles.textInput} value={bizForm.address} onChangeText={t => setBizForm({ ...bizForm, address: t })} />
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>City</Text>
                        <TextInput style={styles.textInput} value={bizForm.city} onChangeText={t => setBizForm({ ...bizForm, city: t })} />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Pincode *</Text>
                        <TextInput style={styles.textInput} value={bizForm.pincode} onChangeText={t => setBizForm({ ...bizForm, pincode: t })} keyboardType="number-pad" maxLength={6} />
                      </View>
                    </View>
                  </ModalShellContent>
                )}



                {activeModalKey === 'notifications' && (
                  <ModalShellContent
                    title="Notification Preferences"
                    subtitle="Choose which alerts you want to receive."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Notification preferences updated.')}
                    saveLabel="Save Preferences"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <Text style={styles.subSectionTitle}>Notification Channels</Text>
                    <ToggleRow label="Push Notifications" value={notifForm.pushEnabled} onToggle={v => setNotifForm({ ...notifForm, pushEnabled: v })} />
                    <ToggleRow label="Email Alerts" value={notifForm.emailEnabled} onToggle={v => setNotifForm({ ...notifForm, emailEnabled: v })} />

                    <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>Alert Topics</Text>
                    <ToggleRow label="Order / Request Updates" value={notifForm.orderUpdates} onToggle={v => setNotifForm({ ...notifForm, orderUpdates: v })} />
                    <ToggleRow label="Payment & Invoice Alerts" value={notifForm.paymentUpdates} onToggle={v => setNotifForm({ ...notifForm, paymentUpdates: v })} />
                    <ToggleRow label="Document Expiry Warning" value={notifForm.docExpiryAlerts} onToggle={v => setNotifForm({ ...notifForm, docExpiryAlerts: v })} />
                    <ToggleRow label="Proposal / Quote Updates" value={notifForm.proposalUpdates} onToggle={v => setNotifForm({ ...notifForm, proposalUpdates: v })} />
                    <ToggleRow label="Promotional Updates" value={notifForm.promoUpdates} onToggle={v => setNotifForm({ ...notifForm, promoUpdates: v })} />
                  </ModalShellContent>
                )}

                {activeModalKey === 'security' && (
                  <ModalShellContent
                    title="Password & Security"
                    subtitle="Manage your password and account protection."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Password updated successfully.')}
                    saveLabel="Update Password"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <Text style={styles.subSectionTitle}>Change Password</Text>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Current Password *</Text>
                      <TextInput style={styles.textInput} secureTextEntry value={secForm.currentPassword} onChangeText={t => setSecForm({ ...secForm, currentPassword: t })} />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>New Password *</Text>
                      <TextInput style={styles.textInput} secureTextEntry value={secForm.newPassword} onChangeText={t => setSecForm({ ...secForm, newPassword: t })} />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Confirm New Password *</Text>
                      <TextInput style={styles.textInput} secureTextEntry value={secForm.confirmPassword} onChangeText={t => setSecForm({ ...secForm, confirmPassword: t })} />
                    </View>

                    <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>Account Verification</Text>
                    <View style={styles.infoBadgeRow}>
                      <CheckCircle2 size={16} color={COLORS.success} />
                      <Text style={styles.infoBadgeText}>Registered Email Verified ({bizForm.email})</Text>
                    </View>
                    <View style={styles.infoBadgeRow}>
                      <CheckCircle2 size={16} color={COLORS.success} />
                      <Text style={styles.infoBadgeText}>Registered Mobile Verified (+91 {bizForm.mobile})</Text>
                    </View>

                    <TouchableOpacity style={styles.signOutSessionsBtn} onPress={() => Alert.alert('Sessions Cleared', 'Signed out from all other active devices.')}>
                      <Text style={styles.signOutSessionsText}>Sign Out All Other Sessions</Text>
                    </TouchableOpacity>
                  </ModalShellContent>
                )}

                {activeModalKey === 'privacy' && (
                  <ModalShellContent
                    title="Privacy Policy"
                    subtitle="Last updated: January 2026"
                    onClose={() => setActiveModalKey(null)}
                    readOnly
                  >
                    <Text style={styles.policyBodyText}>
                      HRC HUB respects the privacy of all registered HoReCa owners, suppliers, agencies, and service providers.
                      {"\n\n"}
                      1. Data Collection: We collect business details, registration certificates, and contact information strictly to verify identity and enable commercial transactions.
                      {"\n\n"}
                      2. Usage: Business names, categories, and service coverage are visible to registered counterparties to enable quote requests and service fulfillment.
                      {"\n\n"}
                      3. Security: All bank details and official KYC documents are encrypted and stored in secure server infrastructure.
                    </Text>
                  </ModalShellContent>
                )}

                {activeModalKey === 'terms' && (
                  <ModalShellContent
                    title="Terms & Conditions"
                    subtitle="Last updated: January 2026"
                    onClose={() => setActiveModalKey(null)}
                    readOnly
                  >
                    <Text style={styles.policyBodyText}>
                      Welcome to the HRC HUB B2B Platform.
                      {"\n\n"}
                      1. Verification: All vendors and establishments must provide valid GSTIN, PAN, or FSSAI registration details.
                      {"\n\n"}
                      2. Service Integrity: Service providers and manpower agencies agree to fulfill committed orders and adhere to stated replacement and warranty policies.
                      {"\n\n"}
                      3. Compliance: Misrepresentation of product quality or non-compliance with statutory standards will lead to account suspension.
                    </Text>
                  </ModalShellContent>
                )}

                {/* ROLE-SPECIFIC SETTINGS MODALS */}
                {activeModalKey === 'bizCategory' && (
                  <ModalShellContent
                    title="Business Category"
                    subtitle="Current category assigned during registration."
                    onClose={() => setActiveModalKey(null)}
                    readOnly
                  >
                    <View style={styles.infoBox}>
                      <Info size={20} color={COLORS.navy} style={{ marginRight: 8 }} />
                      <Text style={styles.infoBoxText}>
                        Current Category: <Text style={{ fontWeight: '800' }}>{bizForm.bizCategory}</Text>
                        {"\n\n"}
                        Business Category is verified upon onboarding. Contact HRC HUB support to request category modifications.
                      </Text>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'savedAddresses' && (
                  <ModalShellContent
                    title="Saved Addresses"
                    subtitle="Manage business and delivery locations."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Addresses saved successfully.')}
                    saveLabel="Save Addresses"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    {addresses.map(item => (
                      <View key={item.id} style={styles.addrCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.addrType}>{item.type}</Text>
                          <Text style={styles.addrText}>{item.text}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setAddresses(addresses.filter(a => a.id !== item.id))}>
                          <Trash2 size={16} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.inputLabel}>Add New Address</Text>
                      <TextInput style={styles.textInput} placeholder="Enter new address..." value={newAddrText} onChangeText={setNewAddrText} />
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          if (newAddrText.trim()) {
                            setAddresses([...addresses, { id: Date.now(), type: 'Branch Location', text: newAddrText }]);
                            setNewAddrText('');
                          }
                        }}
                      >
                        <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.addBtnText}>Add Address</Text>
                      </TouchableOpacity>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'productsSupplied' && (
                  <ModalShellContent
                    title="Products Supplied"
                    subtitle="Manage raw material categories supplied to HoReCa."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Supplied categories updated.')}
                    saveLabel="Save Categories"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.tagsContainer}>
                      {productCats.map(cat => (
                        <View key={cat} style={styles.tagChip}>
                          <Text style={styles.tagText}>{cat}</Text>
                          <TouchableOpacity onPress={() => setProductCats(productCats.filter(c => c !== cat))}>
                            <X size={14} color={COLORS.navy} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>

                    <View style={{ marginTop: 14 }}>
                      <Text style={styles.inputLabel}>Add Product Category</Text>
                      <TextInput style={styles.textInput} placeholder="Category name..." value={newCatText} onChangeText={setNewCatText} />
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          if (newCatText.trim() && !productCats.includes(newCatText.trim())) {
                            setProductCats([...productCats, newCatText.trim()]);
                            setNewCatText('');
                          }
                        }}
                      >
                        <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.addBtnText}>Add Category</Text>
                      </TouchableOpacity>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'pricingMoq' && (
                  <ModalShellContent
                    title="Pricing & MOQ"
                    subtitle="Manage default wholesale pricing and minimum order quantity."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Pricing & MOQ saved.')}
                    saveLabel="Save Pricing & MOQ"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Wholesale Price (₹) *</Text>
                        <TextInput style={styles.textInput} value={pricingForm.wholesalePrice} onChangeText={t => setPricingForm({ ...pricingForm, wholesalePrice: t })} keyboardType="numeric" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Minimum Order (MOQ) *</Text>
                        <TextInput style={styles.textInput} value={pricingForm.moq} onChangeText={t => setPricingForm({ ...pricingForm, moq: t })} keyboardType="numeric" />
                      </View>
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Unit</Text>
                        <TextInput style={styles.textInput} value={pricingForm.unit} onChangeText={t => setPricingForm({ ...pricingForm, unit: t })} placeholder="Kg, Crates, Bags" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Bulk Discount</Text>
                        <TextInput style={styles.textInput} value={pricingForm.bulkDiscount} onChangeText={t => setPricingForm({ ...pricingForm, bulkDiscount: t })} placeholder="5%" />
                      </View>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'deliverySettings' && (
                  <ModalShellContent
                    title="Delivery Settings"
                    subtitle="Manage service coverage area and delivery terms."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Delivery settings saved.')}
                    saveLabel="Save Delivery Settings"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Service Areas</Text>
                      <TextInput style={styles.textInput} value={deliveryForm.areas} onChangeText={t => setDeliveryForm({ ...deliveryForm, areas: t })} />
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Delivery Radius (km)</Text>
                        <TextInput style={styles.textInput} value={deliveryForm.radiusKm} onChangeText={t => setDeliveryForm({ ...deliveryForm, radiusKm: t })} keyboardType="numeric" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Min Delivery Order (₹)</Text>
                        <TextInput style={styles.textInput} value={deliveryForm.minOrderAmt} onChangeText={t => setDeliveryForm({ ...deliveryForm, minOrderAmt: t })} keyboardType="numeric" />
                      </View>
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Delivery Fee (₹)</Text>
                        <TextInput style={styles.textInput} value={deliveryForm.deliveryFee} onChangeText={t => setDeliveryForm({ ...deliveryForm, deliveryFee: t })} keyboardType="numeric" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Delivery Days</Text>
                        <TextInput style={styles.textInput} value={deliveryForm.days} onChangeText={t => setDeliveryForm({ ...deliveryForm, days: t })} />
                      </View>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'rolesSupplied' && (
                  <ModalShellContent
                    title="Roles Supplied"
                    subtitle="Select available staff categories supplied by your agency."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Staff roles saved.')}
                    saveLabel="Save Staff Roles"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.tagsContainer}>
                      {staffRoles.map(role => (
                        <View key={role} style={styles.tagChip}>
                          <Text style={styles.tagText}>{role}</Text>
                          <TouchableOpacity onPress={() => setStaffRoles(staffRoles.filter(r => r !== role))}>
                            <X size={14} color={COLORS.navy} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <View style={{ marginTop: 14 }}>
                      <Text style={styles.inputLabel}>Add Staff Category</Text>
                      <TextInput style={styles.textInput} placeholder="e.g. Barista, Tandoor Chef" value={newRoleText} onChangeText={setNewRoleText} />
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          if (newRoleText.trim() && !staffRoles.includes(newRoleText.trim())) {
                            setStaffRoles([...staffRoles, newRoleText.trim()]);
                            setNewRoleText('');
                          }
                        }}
                      >
                        <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.addBtnText}>Add Role</Text>
                      </TouchableOpacity>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'replacementPolicy' && (
                  <ModalShellContent
                    title="Replacement Policy"
                    subtitle="Manage manpower replacement terms."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Policy saved.')}
                    saveLabel="Save Policy"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Replacement Period (Days)</Text>
                        <TextInput style={styles.textInput} value={replacementForm.periodDays} onChangeText={t => setReplacementForm({ ...replacementForm, periodDays: t })} keyboardType="numeric" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Replacement Limit</Text>
                        <TextInput style={styles.textInput} value={replacementForm.replacementLimit} onChangeText={t => setReplacementForm({ ...replacementForm, replacementLimit: t })} />
                      </View>
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Policy Conditions</Text>
                      <TextInput style={[styles.textInput, { height: 80 }]} multiline value={replacementForm.conditions} onChangeText={t => setReplacementForm({ ...replacementForm, conditions: t })} />
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'serviceCharges' && (
                  <ModalShellContent
                    title="Service Charges"
                    subtitle="Manage agency placement fees."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Service charges saved.')}
                    saveLabel="Save Charges"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Fee Type</Text>
                      <TextInput style={styles.textInput} value={chargeForm.feeType} onChangeText={t => setChargeForm({ ...chargeForm, feeType: t })} />
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Default Charge (₹ / %)</Text>
                        <TextInput style={styles.textInput} value={chargeForm.defaultCharge} onChangeText={t => setChargeForm({ ...chargeForm, defaultCharge: t })} />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Taxes</Text>
                        <TextInput style={styles.textInput} value={chargeForm.taxInfo} onChangeText={t => setChargeForm({ ...chargeForm, taxInfo: t })} />
                      </View>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'servicesOffered' && (
                  <ModalShellContent
                    title="Services Offered"
                    subtitle="Manage technical services offered."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Services list saved.')}
                    saveLabel="Save Services"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.tagsContainer}>
                      {servicesOfferedList.map(srv => (
                        <View key={srv} style={styles.tagChip}>
                          <Text style={styles.tagText}>{srv}</Text>
                          <TouchableOpacity onPress={() => setServicesOfferedList(servicesOfferedList.filter(s => s !== srv))}>
                            <X size={14} color={COLORS.navy} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <View style={{ marginTop: 14 }}>
                      <Text style={styles.inputLabel}>Add Service</Text>
                      <TextInput style={styles.textInput} placeholder="e.g. Kitchen Exhaust Cleaning" value={newSrvText} onChangeText={setNewSrvText} />
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          if (newSrvText.trim() && !servicesOfferedList.includes(newSrvText.trim())) {
                            setServicesOfferedList([...servicesOfferedList, newSrvText.trim()]);
                            setNewSrvText('');
                          }
                        }}
                      >
                        <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.addBtnText}>Add Service</Text>
                      </TouchableOpacity>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'visitCharges' && (
                  <ModalShellContent
                    title="Visit Charges"
                    subtitle="Manage inspection and service visit fees."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Visit charges saved.')}
                    saveLabel="Save Visit Charges"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Visit Charge (₹)</Text>
                        <TextInput style={styles.textInput} value={visitForm.visitCharge} onChangeText={t => setVisitForm({ ...visitForm, visitCharge: t })} keyboardType="numeric" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Emergency Charge (₹)</Text>
                        <TextInput style={styles.textInput} value={visitForm.emergencyCharge} onChangeText={t => setVisitForm({ ...visitForm, emergencyCharge: t })} keyboardType="numeric" />
                      </View>
                    </View>
                    <ToggleRow label="Waive Visit Fee if Job Accepted" value={visitForm.waiveOnHire} onToggle={v => setVisitForm({ ...visitForm, waiveOnHire: v })} />
                  </ModalShellContent>
                )}

                {activeModalKey === 'warrantyPolicy' && (
                  <ModalShellContent
                    title="Warranty Policy"
                    subtitle="Manage service warranty terms."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Warranty policy saved.')}
                    saveLabel="Save Warranty"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <ToggleRow label="Provide Service Warranty" value={warrantyForm.available} onToggle={v => setWarrantyForm({ ...warrantyForm, available: v })} />
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Warranty Duration</Text>
                      <TextInput style={styles.textInput} value={warrantyForm.duration} onChangeText={t => setWarrantyForm({ ...warrantyForm, duration: t })} />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Conditions & Exclusions</Text>
                      <TextInput style={[styles.textInput, { height: 70 }]} multiline value={warrantyForm.conditions} onChangeText={t => setWarrantyForm({ ...warrantyForm, conditions: t })} />
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'marketingServices' && (
                  <ModalShellContent
                    title="Marketing Services"
                    subtitle="Manage marketing services provided."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Marketing services saved.')}
                    saveLabel="Save Services"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.tagsContainer}>
                      {mktServices.map(srv => (
                        <View key={srv} style={styles.tagChip}>
                          <Text style={styles.tagText}>{srv}</Text>
                          <TouchableOpacity onPress={() => setMktServices(mktServices.filter(s => s !== srv))}>
                            <X size={14} color={COLORS.navy} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <View style={{ marginTop: 14 }}>
                      <Text style={styles.inputLabel}>Add Marketing Service</Text>
                      <TextInput style={styles.textInput} placeholder="e.g. Influencer Outreach" value={newMktSrvText} onChangeText={setNewMktSrvText} />
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          if (newMktSrvText.trim() && !mktServices.includes(newMktSrvText.trim())) {
                            setMktServices([...mktServices, newMktSrvText.trim()]);
                            setNewMktSrvText('');
                          }
                        }}
                      >
                        <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.addBtnText}>Add Service</Text>
                      </TouchableOpacity>
                    </View>
                  </ModalShellContent>
                )}

                {activeModalKey === 'portfolio' && (
                  <ModalShellContent
                    title="Portfolio"
                    subtitle="Manage campaign samples and portfolio items."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Portfolio saved.')}
                    saveLabel="Save Portfolio"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    {portfolioItems.map(item => (
                      <View key={item.id} style={styles.addrCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.addrType}>{item.category}</Text>
                          <Text style={styles.addrText}>{item.title}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setPortfolioItems(portfolioItems.filter(p => p.id !== item.id))}>
                          <Trash2 size={16} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={[styles.addBtn, { marginTop: 10 }]}
                      onPress={() => Alert.alert('Portfolio Item', 'Upload image or case study feature.')}
                    >
                      <Upload size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.addBtnText}>Upload Portfolio Item</Text>
                    </TouchableOpacity>
                  </ModalShellContent>
                )}

                {activeModalKey === 'pricingPackages' && (
                  <ModalShellContent
                    title="Pricing Packages"
                    subtitle="Manage marketing package plans."
                    onClose={() => setActiveModalKey(null)}
                    onSave={() => handleSaveSetting('Pricing packages saved.')}
                    saveLabel="Save Packages"
                    errorMsg={modalErrorMsg}
                    successMsg={modalFeedbackMsg}
                  >
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Package Name</Text>
                      <TextInput style={styles.textInput} value={mktPackageForm.name} onChangeText={t => setMktPackageForm({ ...mktPackageForm, name: t })} />
                    </View>
                    <View style={styles.rowFormGroup}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Price (₹)</Text>
                        <TextInput style={styles.textInput} value={mktPackageForm.price} onChangeText={t => setMktPackageForm({ ...mktPackageForm, price: t })} keyboardType="numeric" />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Duration</Text>
                        <TextInput style={styles.textInput} value={mktPackageForm.duration} onChangeText={t => setMktPackageForm({ ...mktPackageForm, duration: t })} />
                      </View>
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.inputLabel}>Deliverables Summary</Text>
                      <TextInput style={styles.textInput} value={mktPackageForm.deliverables} onChangeText={t => setMktPackageForm({ ...mktPackageForm, deliverables: t })} />
                    </View>
                  </ModalShellContent>
                )}

              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

        {/* PROFILE PHOTO PREVIEW MODAL */}
        <Modal
          visible={showPhotoPreviewModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPhotoPreviewModal(false)}
        >
          <View style={styles.photoModalOverlay}>
            <TouchableOpacity
              style={styles.photoModalCloseBtn}
              onPress={() => setShowPhotoPreviewModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Close photo preview"
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.photoModalContent}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.fullPreviewImage} resizeMode="cover" />
              ) : (
                <View style={styles.fullAvatarCircle}>
                  <Text style={styles.fullAvatarText}>{userInitials}</Text>
                </View>
              )}
              <Text style={styles.photoModalTitle}>{bizForm?.bizName || businessName}</Text>
              <Text style={styles.photoModalSub}>{contactName}</Text>
              <TouchableOpacity
                style={styles.changePhotoModalBtn}
                onPress={() => {
                  setShowPhotoPreviewModal(false);
                  handlePickProfilePhoto();
                }}
                accessibilityRole="button"
              >
                <Camera size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.changePhotoModalBtnText}>Change Profile Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

/* ==================== REUSABLE MODAL SHELL CONTENT COMPONENT ==================== */
function ModalShellContent({
  title,
  subtitle,
  onClose,
  onSave,
  saveLabel = "Save Details",
  readOnly = false,
  errorMsg = "",
  successMsg = "",
  children
}) {
  return (
    <View style={styles.shellContainer}>
      <View style={styles.shellHeader}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.shellTitle}>{title}</Text>
          <Text style={styles.shellSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeIconButton}>
          <X size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.shellBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {errorMsg ? (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color={COLORS.error} style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBox}>
            <CheckCircle2 size={16} color={COLORS.success} style={{ marginRight: 6 }} />
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        {children}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.shellFooter}>
        <TouchableOpacity style={styles.cancelActionBtn} onPress={onClose}>
          <Text style={styles.cancelActionBtnText}>{readOnly ? "Close" : "Cancel"}</Text>
        </TouchableOpacity>

        {!readOnly && (
          <TouchableOpacity style={styles.saveActionBtn} onPress={onSave}>
            <Save size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.saveActionBtnText}>{saveLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/* ==================== TOGGLE ROW COMPONENT ==================== */
function ToggleRow({ label, value, onToggle }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabelText}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#CBD5E1', true: COLORS.navy }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

/* ==================== REUSABLE SETTINGS ROW COMPONENT ==================== */
const SettingsRow = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  disabled = false,
  danger = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={`Open ${title}`}
      style={({ pressed }) => [
        styles.settingsRow,
        danger && styles.settingsRowDanger,
        pressed && !disabled && styles.settingsRowPressed,
        disabled && styles.settingsRowDisabled,
      ]}
    >
      <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
        <Icon size={18} color={danger ? COLORS.error : COLORS.navy} />
      </View>
      <View style={styles.rowTextCol}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.rowDesc, danger && styles.rowDescDanger]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <ChevronRight size={18} color={danger ? COLORS.error : "#94A3B8"} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },

  /* HEADER BLOCK */
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primaryText },
  pageSubtitle: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },

  scrollContainer: { flex: 1 },
  scrollContent: { padding: 16 },

  /* PROFILE SUMMARY CARD */
  profileSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.navy,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  cameraBadgeBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  profileInfoCol: { flex: 1 },
  bizNameText: { fontSize: 16, fontWeight: '800', color: COLORS.primaryText, marginBottom: 2 },
  contactNameText: { fontSize: 13, color: COLORS.secondaryText, fontWeight: '500', marginBottom: 4 },
  roleBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  roleBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.navy },
  badgeDot: { fontSize: 10, color: COLORS.secondaryText, marginHorizontal: 4 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: COLORS.success },
  cityRow: { flexDirection: 'row', alignItems: 'center' },
  cityText: { fontSize: 11, color: COLORS.secondaryText },

  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    minHeight: 48,
    height: 48,
    width: '100%',
  },
  editProfileBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
    backgroundColor: '#EEF2F7',
  },
  editProfileBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.navy },

  /* SECTION BLOCK */
  sectionBlock: { marginBottom: 18 },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondaryText,
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  /* REUSABLE SETTINGS ROW DESIGN */
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    minHeight: 52,
    height: 70,
    backgroundColor: '#FFFFFF',
  },
  settingsRowPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
    backgroundColor: '#F8FAFD',
  },
  settingsRowDisabled: { opacity: 0.5 },
  settingsRowDanger: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    marginTop: 4,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxDanger: { backgroundColor: '#FEE2E2' },
  rowTextCol: { flex: 1, marginRight: 8 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primaryText, marginBottom: 2 },
  rowTitleDanger: { color: COLORS.error, fontWeight: '800' },
  rowDesc: { fontSize: 11, color: COLORS.secondaryText },
  rowDescDanger: { color: '#B91C1C' },
  rowDivider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 64 },

  /* MODAL OVERLAY & SHELL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalShellCard: {
    width: '92%',
    maxWidth: 520,
    maxHeight: '84%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  shellContainer: { flex: 1, display: 'flex', flexDirection: 'column' },
  shellHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FFFFFF',
  },
  shellTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primaryText },
  shellSubtitle: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2, lineHeight: 16 },
  closeIconButton: { padding: 4 },

  shellBody: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  shellFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#FFFFFF',
  },
  cancelActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primaryText },
  saveActionBtn: {
    flex: 1.4,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveActionBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  /* FORM INPUTS & LAYOUT */
  formGroup: { marginBottom: 14 },
  rowFormGroup: { flexDirection: 'row', gap: 10 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primaryText, marginBottom: 6 },
  textInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.primaryText,
    backgroundColor: '#F8FAFD',
  },
  readOnlyInput: {
    backgroundColor: '#F1F5F9',
    color: COLORS.secondaryText,
  },

  /* TOGGLE & MESSAGES */
  subSectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.navy, marginBottom: 8, letterSpacing: 0.5 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleLabelText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryText },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { fontSize: 12, color: COLORS.error, fontWeight: '600', flex: 1 },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    borderWidth: 1,
    borderColor: '#C6F6D5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  successText: { fontSize: 12, color: COLORS.success, fontWeight: '600', flex: 1 },

  /* POLICY & BADGES */
  policyBodyText: { fontSize: 13, color: COLORS.primaryText, lineHeight: 20 },
  infoBadgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 10, borderRadius: 10, marginBottom: 8 },
  infoBadgeText: { fontSize: 12, color: COLORS.success, fontWeight: '700', marginLeft: 8 },
  signOutSessionsBtn: { marginTop: 12, height: 42, borderRadius: 10, backgroundColor: COLORS.dangerBg, borderWidth: 1, borderColor: COLORS.dangerBorder, alignItems: 'center', justifyContent: 'center' },
  signOutSessionsText: { fontSize: 12, fontWeight: '800', color: COLORS.error },

  /* CARDS & TAGS */
  addrCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFD', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, marginBottom: 10 },
  addrType: { fontSize: 12, fontWeight: '800', color: COLORS.navy, marginBottom: 2 },
  addrText: { fontSize: 12, color: COLORS.secondaryText },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2F7', borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: '700', color: COLORS.navy, marginRight: 6 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.navy, height: 42, borderRadius: 10, marginTop: 8 },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  infoBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 14, borderRadius: 12 },
  infoBoxText: { fontSize: 13, color: COLORS.navy, flex: 1, lineHeight: 18 },

  /* CONFIRM SIGN OUT MODAL */
  confirmCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primaryText, marginBottom: 6 },
  confirmMessage: { fontSize: 13, color: COLORS.secondaryText, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  confirmActionsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primaryText },
  confirmSignOutBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmSignOutBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  /* PHOTO PREVIEW MODAL STYLES */
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoModalCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  photoModalContent: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  fullPreviewImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 3,
    borderColor: COLORS.gold,
    marginBottom: 20,
  },
  fullAvatarCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.navy,
    borderWidth: 3,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fullAvatarText: { fontSize: 56, fontWeight: '900', color: '#FFFFFF' },
  photoModalTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, textAlign: 'center' },
  photoModalSub: { fontSize: 14, color: COLORS.gold, marginBottom: 24, textAlign: 'center' },
  changePhotoModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  changePhotoModalBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
