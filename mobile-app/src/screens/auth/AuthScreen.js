import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, SafeAreaView, Image } from 'react-native';
import { Check, Mail, Lock, Eye, EyeOff, ShieldX, ArrowRight, Building2, User, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';

const BUSINESS_TYPES = [
  { value: "hotel", label: "Hotel", icon: "🏨" },
  { value: "restaurant", label: "Restaurant", icon: "🍽️" },
  { value: "cafe", label: "Café", icon: "☕" },
  { value: "vendor", label: "Vendor / Agency", icon: "🏢" },
];

const VENDOR_SPECIALTIES = [
  { value: "raw-material", label: "Raw Materials Supplier" },
  { value: "manpower", label: "Manpower Agency" },
  { value: "service", label: "Service Provider" },
  { value: "marketing", label: "Marketing Agency" },
];

const RAW_SUB_CATEGORIES = [
  { value: "fruits-vegetables", label: "Fruits & Vegetables" },
  { value: "dairy", label: "Dairy Products" },
  { value: "grocery", label: "Grocery & Staples" },
];

export default function AuthScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  
  const { login } = useContext(AuthContext);

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  /* --- Login State --- */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  /* --- Register State --- */
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [vendorSpecialty, setVendorSpecialty] = useState('');
  const [rawSubCat, setRawSubCat] = useState('');
  const [gst, setGst] = useState('');
  const [mobile, setMobile] = useState('');
  const [fssaiNum, setFssaiNum] = useState('');
  const [panOrShopActNum, setPanOrShopActNum] = useState('');
  const [laborLicenseNum, setLaborLicenseNum] = useState('');
  const [shopActOrTradeNum, setShopActOrTradeNum] = useState('');
  const [incOrMsmeNum, setIncOrMsmeNum] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [city, setCity] = useState('');
  
  const [errors1, setErrors1] = useState({});
  const [errors2, setErrors2] = useState({});

  const isVendor = businessType === "vendor";
  const isRawMat = isVendor && vendorSpecialty === "raw-material";

  const getDynamicKycFields = () => {
    if (!businessType) return [];
    const isHoReCa = ["hotel", "restaurant", "cafe"].includes(businessType);
    if (isHoReCa) {
      return [
        { id: "fssai", label: "FSSAI License", value: fssaiNum, onChange: setFssaiNum, placeholder: "14-digit FSSAI License No." },
        { id: "gst", label: "GSTIN", value: gst, onChange: setGst, placeholder: "15-digit GSTIN" },
        { id: "shop_act_pan", label: "Shop Act / Business PAN", value: panOrShopActNum, onChange: setPanOrShopActNum, placeholder: "PAN or Shop Act No." }
      ];
    }
    if (isVendor) {
      if (vendorSpecialty === "raw-material") {
        return [
          { id: "gst", label: "GSTIN", value: gst, onChange: setGst, placeholder: "15-digit GSTIN" },
          { id: "fssai", label: "FSSAI License", value: fssaiNum, onChange: setFssaiNum, placeholder: "FSSAI License No." }
        ];
      }
      if (vendorSpecialty === "manpower") {
        return [
          { id: "gst", label: "GSTIN", value: gst, onChange: setGst, placeholder: "15-digit GSTIN" },
          { id: "labor", label: "Labor License / Shop Act", value: laborLicenseNum, onChange: setLaborLicenseNum, placeholder: "Labor License No." }
        ];
      }
      if (vendorSpecialty === "service") {
        return [
          { id: "gst", label: "GSTIN / Business PAN", value: gst, onChange: setGst, placeholder: "GSTIN or Business PAN" },
          { id: "shop_act_trade", label: "Shop Act / Trade License", value: shopActOrTradeNum, onChange: setShopActOrTradeNum, placeholder: "Shop Act No." }
        ];
      }
      if (vendorSpecialty === "marketing") {
        return [
          { id: "gst", label: "Business PAN / GSTIN", value: gst, onChange: setGst, placeholder: "Business PAN or GSTIN" },
          { id: "inc_msme", label: "Agency Inc. / MSME Certificate", value: incOrMsmeNum, onChange: setIncOrMsmeNum, placeholder: "MSME No." }
        ];
      }
    }
    return [];
  };

  const validateStep1 = () => {
    let e = {};
    if (!businessName) e.businessName = 'Required';
    if (!businessType) e.businessType = 'Required';
    if (isVendor && !vendorSpecialty) e.vendorSpecialty = 'Required';
    if (isRawMat && !rawSubCat) e.rawSubCat = 'Required';
    if (!mobile) e.mobile = 'Required';
    setErrors1(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    let e = {};
    if (!firstName) e.firstName = 'Required';
    if (!email) e.email = 'Required';
    if (!password) e.password = 'Required';
    if (password !== confirmPwd) e.confirmPwd = 'Must match';
    setErrors2(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    const emailLower = loginEmail.trim().toLowerCase();
    if (emailLower === 'admin@hrchub.in') {
       login('superadmin', 'mock-token');
    } else if (emailLower.includes('manpower') || emailLower.includes('elitemanpower')) {
       login('manpower', 'mock-token', 'manpower');
    } else if (emailLower.includes('service') || emailLower.includes('proclean')) {
       login('serviceProvider', 'mock-token', 'service');
    } else if (emailLower.includes('marketing') || emailLower.includes('brandcraft') || emailLower.includes('marking')) {
       login('marketing', 'mock-token', 'marketing');
    } else if (emailLower.includes('vendor')) {
       login('vendor', 'mock-token', 'raw-material');
    } else {
       login('owner', 'mock-token');
    }
  };

  const renderLeftColumn = () => (
    <View style={styles.leftCol}>
      <View style={styles.brandRow}>
        <View style={styles.brandIconBox}>
          <Image source={require('../../assets/HoReCa_Logo.png')} style={{width: 24, height: 24, resizeMode: 'contain'}} />
        </View>
        <View>
          <Text style={styles.brandTitle}>HRC<Text style={{color: '#60A5FA'}}>HUB</Text></Text>
          <Text style={styles.brandSubtitle}>ENTERPRISE HUB</Text>
        </View>
      </View>
      
      <View style={{ flex: 1, justifyContent: 'center' }}>
         <View style={styles.pillBadge}>
            <Sparkles size={12} color="#60A5FA" />
            <Text style={styles.pillBadgeText}>Empowering Hospitality Chains</Text>
         </View>
         <Text style={styles.heroHeadline}>The operational standard</Text>
         <Text style={styles.heroHeadlineHighlight}>for modern HoReCa.</Text>
         <Text style={styles.heroDesc}>Unify procurement, source raw ingredients, hire kitchen staff, and automate facilities operations through a single secure console.</Text>
         
         {[
           { title: "Direct Sourcing", desc: "Access 800+ food suppliers with automated routing" },
           { title: "Vetted Professionals", desc: "Book qualified kitchen crew and certified service teams" },
           { title: "Enterprise Analytics", desc: "Gain unified insights on procurement spend and operational ROI" },
         ].map((p, idx) => (
           <View key={idx} style={styles.featureRow}>
             <View style={styles.featureCheck}>
               <Check size={12} color="#93C5FD" strokeWidth={3} />
             </View>
             <View>
               <Text style={styles.featureTitle}>{p.title}</Text>
               <Text style={styles.featureDesc}>{p.desc}</Text>
             </View>
           </View>
         ))}
      </View>
    </View>
  );

  const renderRegisterSteps = () => {
    return (
      <View style={{width: '100%'}}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          {[
            { label: "Business", icon: Building2 },
            { label: "Owner", icon: User },
            { label: "Verify", icon: ShieldCheck },
          ].map((s, i) => {
            const done = i < step - 1;
            const active = i === step - 1;
            const Icon = s.icon;
            return (
              <View key={i} style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                 <View style={[styles.stepIcon, active && styles.stepIconActive, done && styles.stepIconDone]}>
                    {done ? <Check size={14} color="#fff" /> : <Icon size={14} color={active||done ? "#fff" : colors.muted} />}
                 </View>
                 {isLargeScreen && <Text style={[styles.stepLabelText, (active||done) && {color: active?colors.primary:colors.success}]}>{s.label}</Text>}
                 {i < 2 && <View style={[styles.stepLine, done && {backgroundColor: colors.success}]} />}
              </View>
            )
          })}
        </View>
 
        {step === 1 && (
          <View>
             <CustomInput label="Business Name" value={businessName} onChangeText={setBusinessName} placeholder="The Meridian Hotels" error={errors1.businessName} required />
             <CustomSelect label="Business Type" value={businessType} onChange={setBusinessType} options={BUSINESS_TYPES} placeholder="Select primary category" error={errors1.businessType} required />
             {isVendor && <CustomSelect label="Vendor Specialty" value={vendorSpecialty} onChange={setVendorSpecialty} options={VENDOR_SPECIALTIES} placeholder="Select specialty" error={errors1.vendorSpecialty} required />}
             {isRawMat && <CustomSelect label="Raw Material Category" value={rawSubCat} onChange={setRawSubCat} options={RAW_SUB_CATEGORIES} placeholder="Select category" error={errors1.rawSubCat} required />}
             <CustomInput label="Mobile Number" value={mobile} onChangeText={setMobile} placeholder="9876543210" keyboardType="phone-pad" error={errors1.mobile} required />
             
             {getDynamicKycFields().map((f, i) => (
                <CustomInput key={i} label={f.label} value={f.value} onChangeText={f.onChange} placeholder={f.placeholder} />
             ))}
             <PrimaryButton title="CONTINUE" onPress={() => { if(validateStep1()) setStep(2) }} />
          </View>
        )}
 
        {step === 2 && (
          <View>
             <View style={{flexDirection: 'row', gap: 12}}>
                <View style={{flex:1}}><CustomInput label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Arjun" error={errors2.firstName} required /></View>
                <View style={{flex:1}}><CustomInput label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Mehta" /></View>
             </View>
             <CustomInput label="Email Address" value={email} onChangeText={setEmail} placeholder="arjun@company.com" error={errors2.email} required />
             <CustomInput label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry error={errors2.password} required />
             <CustomInput label="Confirm Password" value={confirmPwd} onChangeText={setConfirmPwd} placeholder="••••••••" secureTextEntry error={errors2.confirmPwd} required />
             <PrimaryButton title="CONTINUE" onPress={() => { if(validateStep2()) setStep(3) }} />
          </View>
        )}
 
        {step === 3 && (
          <View style={{alignItems: 'center'}}>
             <View style={styles.verifyIconLg}><ShieldCheck size={40} color={colors.primary} /></View>
             <Text style={styles.verifyTitle}>Verify Mobile</Text>
             <Text style={styles.verifySub}>OTP sent to +91 {mobile}</Text>
             <View style={styles.otpGrid}>
                {[1,2,3,4,5,6].map(i => <View key={i} style={styles.otpBox} />)}
             </View>
             <PrimaryButton title="VERIFY & REGISTER" onPress={handleLogin} style={{width: '100%', marginTop: 24}} />
          </View>
        )}
      </View>
    );
  };
 
  const renderLoginForm = () => (
    <View style={{width: '100%'}}>
       <View style={{marginBottom: 24}}>
          <Text style={{...typography.h2, color: colors.dark, marginBottom: 4}}>Welcome back</Text>
          <Text style={{...typography.bodySmall, color: colors.body}}>Enter your credentials to access your control panel.</Text>
       </View>
       <CustomInput label="Email Address" value={loginEmail} onChangeText={setLoginEmail} placeholder="name@company.com" icon={Mail} required />
       <CustomInput label="Password" value={loginPass} onChangeText={setLoginPass} placeholder="••••••••••••" icon={Lock} secureTextEntry={!showPass} required suffix={
         <TouchableOpacity onPress={() => setShowPass(!showPass)}>
           {showPass ? <EyeOff size={16} color={colors.muted} /> : <Eye size={16} color={colors.muted} />}
         </TouchableOpacity>
       } />
       <PrimaryButton title="SIGN IN" onPress={handleLogin} style={{marginTop: 8}} />
       
       <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.muted, marginHorizontal: 12 }}>QUICK DEMO LOGIN</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
       </View>
 
       <View style={{ flexDirection: 'column', gap: 10 }}>
          <PrimaryButton 
             title="Login as Hotel Owner" 
             onPress={() => login('owner', 'mock-jwt-token')} 
             style={{ backgroundColor: '#0F172A' }}
          />
          <PrimaryButton 
             title="Login as Raw Material Vendor" 
             onPress={() => login('vendor', 'mock-jwt-token', 'raw-material')} 
             style={{ backgroundColor: '#1E40AF' }}
          />
          <PrimaryButton 
             title="Login as Manpower Vendor" 
             onPress={() => login('manpower', 'mock-jwt-token', 'manpower')} 
             style={{ backgroundColor: '#2563EB' }}
          />
          <PrimaryButton 
             title="Login as Service Provider Vendor" 
             onPress={() => login('serviceProvider', 'mock-jwt-token', 'service')} 
             style={{ backgroundColor: '#10B981' }}
          />
          <PrimaryButton 
             title="Login as Marketing Vendor" 
             onPress={() => login('marketing', 'mock-jwt-token', 'marketing')} 
             style={{ backgroundColor: '#8B5CF6' }}
          />
       </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F4F6'}}>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1, flexDirection: 'row'}}>
        {isLargeScreen && renderLeftColumn()}
        
        <View style={[styles.rightCol, !isLargeScreen && {padding: 16}]}>
          <ScrollView contentContainerStyle={[styles.scrollContent, !isLargeScreen && {justifyContent: 'center'}]}>
            
            {!isLargeScreen && (
              <TouchableOpacity style={styles.mobileBackBtn} onPress={() => navigation.goBack()}>
                 <ArrowLeft size={16} color={colors.dark} />
                 <Text style={{fontSize: 12, fontWeight: 'bold', marginLeft: 8, color: colors.dark}}>HOME</Text>
              </TouchableOpacity>
            )}

            <View style={[styles.glassCard, !isLargeScreen && {width: '100%', maxWidth: 500, alignSelf: 'center'}]}>
               {/* Tab Switcher */}
               <View style={styles.tabSwitcher}>
                 <View style={[styles.tabSlider, { left: mode === 'login' ? 4 : '50%' }]} />
                 <TouchableOpacity style={styles.tabButton} onPress={() => {setMode('login'); setStep(1);}}>
                    <Text style={[styles.tabText, {color: mode==='login' ? colors.dark : colors.muted}]}>SIGN IN</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.tabButton} onPress={() => {setMode('register'); setStep(1);}}>
                    <Text style={[styles.tabText, {color: mode==='register' ? colors.dark : colors.muted}]}>REGISTER</Text>
                 </TouchableOpacity>
               </View>

               {mode === 'login' ? renderLoginForm() : renderRegisterSteps()}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  leftCol: {
    width: '42%',
    backgroundColor: '#0E2042',
    padding: 48,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rightCol: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#93C5FD',
    marginLeft: 6,
  },
  heroHeadline: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 42,
  },
  heroHeadlineHighlight: {
    fontSize: 36,
    fontWeight: '900',
    color: '#BFDBFE',
    lineHeight: 42,
    marginBottom: 24,
  },
  heroDesc: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 22,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featureDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  glassCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    ...Platform.select({
      web: { backdropFilter: 'blur(16px)' }
    }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
    position: 'relative',
  },
  tabSlider: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '49%',
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stepIconActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stepIconDone: {
    backgroundColor: colors.success,
  },
  stepLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  verifyIconLg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  verifyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
  },
  verifySub: {
    fontSize: 14,
    color: colors.body,
    marginBottom: 24,
  },
  otpGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  otpBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  mobileBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  }
});
