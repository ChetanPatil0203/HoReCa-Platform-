import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { 
  Building2, Briefcase, FileText, Landmark, Bell, Shield, 
  ChevronDown, ChevronUp, Save, UploadCloud, FileImage, User 
} from 'lucide-react-native';

const DOCUMENTS = [
  "GST Certificate", "PAN Card", "Business Registration", 
  "Agency Licence", "Cancelled Cheque", "Bank Proof", 
  "Portfolio Verification Documents"
];

export default function MarketingSettingsScreen() {
  const [activeSection, setActiveSection] = useState('Profile');
  
  // Profile State
  const [agencyName, setAgencyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [coverageAreas, setCoverageAreas] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [mktType, setMktType] = useState('Both');
  const [remoteAvail, setRemoteAvail] = useState(true);

  const toggleSection = (sec) => {
    setActiveSection(activeSection === sec ? '' : sec);
  };

  const handleSave = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Settings saved successfully.", ToastAndroid.SHORT);
    }
  };

  const renderSectionHeader = (title, icon, secName) => {
    const Icon = icon;
    const isActive = activeSection === secName;
    return (
      <TouchableOpacity style={[styles.sectionHeader, isActive && styles.sectionHeaderActive]} onPress={() => toggleSection(secName)}>
         <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
            <Icon size={20} color={isActive ? '#071B3A' : '#64748B'} />
            <Text style={[styles.sectionTitle, isActive && {color: '#071B3A'}]}>{title}</Text>
         </View>
         {isActive ? <ChevronUp size={20} color="#071B3A" /> : <ChevronDown size={20} color="#94A3B8" />}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile */}
        <View style={styles.card}>
           {renderSectionHeader('Agency Profile & Operations', Building2, 'Profile')}
           {activeSection === 'Profile' && (
             <View style={styles.sectionBody}>
               
               <View style={styles.logoRow}>
                 <View style={styles.logoBox}><User size={32} color="#94A3B8" /></View>
                 <TouchableOpacity style={styles.btnOutlineSmall}><Text style={styles.btnOutlineSmallText}>Upload Logo</Text></TouchableOpacity>
               </View>

               <Text style={styles.label}>Agency Name</Text>
               <TextInput style={styles.input} placeholder="e.g. Creative Sparks Media" value={agencyName} onChangeText={setAgencyName} />

               <View style={styles.row}>
                 <View style={styles.col}><Text style={styles.label}>Phone</Text><TextInput style={styles.input} placeholder="+91..." value={phone} onChangeText={setPhone} /></View>
                 <View style={styles.col}><Text style={styles.label}>Email</Text><TextInput style={styles.input} placeholder="contact@agency.com" value={email} onChangeText={setEmail} /></View>
               </View>

               <Text style={styles.label}>Marketing Type (Online / Offline / Both)</Text>
               <View style={styles.segmentControl}>
                 {['Online', 'Offline', 'Both'].map(t => (
                   <TouchableOpacity key={t} style={[styles.segmentBtn, mktType === t && styles.segmentBtnActive]} onPress={() => setMktType(t)}>
                      <Text style={[styles.segmentText, mktType === t && styles.segmentTextActive]}>{t}</Text>
                   </TouchableOpacity>
                 ))}
               </View>

               <Text style={styles.label}>Services Offered</Text>
               <TextInput style={styles.textArea} placeholder="e.g. SEO, SMM, Branding..." value={servicesOffered} onChangeText={setServicesOffered} multiline numberOfLines={2} />

               <Text style={styles.label}>Coverage Areas</Text>
               <TextInput style={styles.input} placeholder="e.g. Mumbai, Pune..." value={coverageAreas} onChangeText={setCoverageAreas} />

               <View style={styles.switchRow}>
                 <View>
                   <Text style={styles.switchLabel}>Remote Service Availability</Text>
                   <Text style={styles.switchSub}>Willing to service clients outside coverage area digitally.</Text>
                 </View>
                 <Switch value={remoteAvail} onValueChange={setRemoteAvail} trackColor={{true: '#10B981'}} />
               </View>

               <Text style={styles.label}>Working Hours</Text>
               <TextInput style={styles.input} placeholder="e.g. Mon-Fri, 10 AM - 7 PM" value={workingHours} onChangeText={setWorkingHours} />
               
             </View>
           )}
        </View>

        {/* Documents */}
        <View style={styles.card}>
           {renderSectionHeader('Compliance & Documents', FileText, 'Docs')}
           {activeSection === 'Docs' && (
             <View style={styles.sectionBody}>
               {DOCUMENTS.map((doc, idx) => (
                 <View key={idx} style={styles.docRow}>
                    <Text style={styles.docName}>{doc}</Text>
                    <TouchableOpacity style={styles.btnOutlineSmall}>
                       <UploadCloud size={14} color="#071B3A"/>
                       <Text style={styles.btnOutlineSmallText}>Upload</Text>
                    </TouchableOpacity>
                 </View>
               ))}
             </View>
           )}
        </View>

        {/* Bank Details */}
        <View style={styles.card}>
           {renderSectionHeader('Bank Details', Landmark, 'Bank')}
           {activeSection === 'Bank' && (
             <View style={styles.sectionBody}>
               <Text style={styles.label}>Account Holder Name</Text>
               <TextInput style={styles.input} placeholder="e.g. Creative Sparks Pvt Ltd" />
               <Text style={styles.label}>Account Number</Text>
               <TextInput style={styles.input} placeholder="e.g. 50100200..." keyboardType="numeric" />
               <Text style={styles.label}>IFSC Code</Text>
               <TextInput style={styles.input} placeholder="e.g. HDFC0001234" />
             </View>
           )}
        </View>

        {/* Preferences */}
        <View style={styles.card}>
           {renderSectionHeader('Notification Preferences', Bell, 'Notifs')}
           {activeSection === 'Notifs' && (
             <View style={styles.sectionBody}>
               <View style={styles.switchRow}><Text style={styles.switchLabel}>Email Notifications</Text><Switch value={true} trackColor={{true: '#10B981'}} /></View>
               <View style={styles.switchRow}><Text style={styles.switchLabel}>SMS Alerts</Text><Switch value={false} trackColor={{true: '#10B981'}} /></View>
               <View style={styles.switchRow}><Text style={styles.switchLabel}>Push Notifications</Text><Switch value={true} trackColor={{true: '#10B981'}} /></View>
               <View style={styles.switchRow}><Text style={styles.switchLabel}>Campaign Milestones</Text><Switch value={true} trackColor={{true: '#10B981'}} /></View>
             </View>
           )}
        </View>

        {/* Security */}
        <View style={styles.card}>
           {renderSectionHeader('Password & Security', Shield, 'Security')}
           {activeSection === 'Security' && (
             <View style={styles.sectionBody}>
               <Text style={styles.label}>Current Password</Text>
               <TextInput style={styles.input} placeholder="********" secureTextEntry />
               <Text style={styles.label}>New Password</Text>
               <TextInput style={styles.input} placeholder="********" secureTextEntry />
               <TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnPrimaryText}>Update Password</Text></TouchableOpacity>
             </View>
           )}
        </View>

      </ScrollView>
      
      <View style={styles.footer}>
         <TouchableOpacity style={styles.btnPrimaryFull} onPress={handleSave}>
           <Save size={20} color="#fff" />
           <Text style={styles.btnPrimaryFullText}>Save All Settings</Text>
         </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  sectionHeaderActive: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#F8FAFC' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  sectionBody: { padding: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  logoBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff' },
  textArea: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff', textAlignVertical: 'top', minHeight: 60 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  segmentControl: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4, marginBottom: 16 },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  segmentBtnActive: { backgroundColor: '#fff', elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 1 },
  segmentText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  segmentTextActive: { color: '#071B3A', fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 8 },
  switchLabel: { fontSize: 14, color: '#334155', fontWeight: '500' },
  switchSub: { fontSize: 11, color: '#64748B', marginTop: 2, maxWidth: '80%' },
  docRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  docName: { fontSize: 14, color: '#334155', fontWeight: '500', flex: 1 },
  btnOutlineSmall: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#071B3A', backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  btnOutlineSmallText: { fontSize: 12, color: '#071B3A', fontWeight: 'bold' },
  btnPrimary: { backgroundColor: '#071B3A', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimaryFull: { flexDirection: 'row', backgroundColor: '#071B3A', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnPrimaryFullText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
