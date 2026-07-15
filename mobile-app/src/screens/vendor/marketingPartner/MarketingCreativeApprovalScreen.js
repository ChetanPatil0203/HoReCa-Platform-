import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ToastAndroid, Dimensions } from 'react-native';
import { ArrowLeft, UploadCloud, FileImage, Send, Save, AlertCircle, FileDown, MessageSquare, Clock } from 'lucide-react-native';

const CREATIVE_TYPES = [
  "Social Post", "Story", "Reel", "Video", "Poster", 
  "Banner", "Ad Copy", "Logo", "Hoarding Design", 
  "Pamphlet", "Newspaper Artwork"
];

export default function MarketingCreativeApprovalScreen({ setActivePage, campaign }) {
  const camp = campaign || { id: 'CMP-000', title: 'Unknown Campaign', client: 'Unknown Client' };

  const [type, setType] = useState('Social Post');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('v1.0');
  const [desc, setDesc] = useState('');
  const [notes, setNotes] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);

  // Simulation state for Changes Requested Flow
  const [isRevisionRequired, setIsRevisionRequired] = useState(false);

  const handleSubmit = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Creative approved successfully.", ToastAndroid.SHORT);
    }
    setActivePage('campaigns');
  };

  const renderRevisionFlow = () => (
    <View style={styles.revisionBox}>
      <View style={styles.revisionHeader}>
         <AlertCircle size={20} color="#EF4444" />
         <Text style={styles.revisionTitle}>Changes Requested by Client</Text>
      </View>
      
      <View style={styles.feedbackBox}>
         <MessageSquare size={16} color="#64748B" />
         <Text style={styles.feedbackText}>"Please make the logo 20% larger and use the darker shade of blue for the background as per brand guidelines."</Text>
      </View>

      <View style={styles.revisionGrid}>
         <View style={styles.revisionCol}>
            <Text style={styles.label}>Revision Number</Text>
            <Text style={styles.valText}>Revision 2 (v1.1)</Text>
         </View>
         <View style={styles.revisionCol}>
            <Text style={styles.label}>Due Date</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Clock size={14} color="#EF4444" />
              <Text style={[styles.valText, {color: '#EF4444'}]}>Today, 5:00 PM</Text>
            </View>
         </View>
      </View>

      <Text style={styles.label}>Previous File Reference</Text>
      <View style={styles.fileRefBox}>
         <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <FileImage size={20} color="#94A3B8" />
            <Text style={styles.fileName}>summer_promo_v1.0.png</Text>
         </View>
         <TouchableOpacity style={styles.btnSmallIcon}>
            <FileDown size={16} color="#8B5CF6" />
         </TouchableOpacity>
      </View>

      <Text style={styles.label}>Upload Revised File</Text>
      <TouchableOpacity style={[styles.uploadBox, { borderColor: '#8B5CF6', backgroundColor: '#F5F3FF' }]} onPress={() => setFileUploaded(true)}>
         <UploadCloud size={32} color="#8B5CF6" />
         <Text style={[styles.uploadText, {color: '#8B5CF6'}]}>{fileUploaded ? 'summer_promo_v1.1.png Uploaded' : 'Tap to upload revised file'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setActivePage('campaigns')}>
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>Upload Creative</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{camp.id} • {camp.title}</Text>
        </View>
        <TouchableOpacity onPress={() => setIsRevisionRequired(!isRevisionRequired)}>
           <Text style={styles.simText}>Simulate {isRevisionRequired ? 'Upload' : 'Revision'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {isRevisionRequired ? renderRevisionFlow() : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Asset Details</Text>
            
            <Text style={styles.label}>Creative Type</Text>
            <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
               <Text style={styles.dropdownText}>{type}</Text>
            </TouchableOpacity>
            
            {showTypeDropdown && (
              <View style={styles.dropdownList}>
                {CREATIVE_TYPES.map(t => (
                  <TouchableOpacity key={t} style={styles.dropdownItem} onPress={() => { setType(t); setShowTypeDropdown(false); }}>
                    <Text style={styles.dropdownItemText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Creative Title</Text>
            <TextInput style={styles.input} placeholder="e.g. Summer Offer Main Post" value={title} onChangeText={setTitle} />

            <View style={{flexDirection: 'row', gap: 12}}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Version</Text>
                <TextInput style={styles.input} placeholder="e.g. v1.0" value={version} onChangeText={setVersion} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Date</Text>
                <TextInput style={styles.input} placeholder="DD/MM/YY" value={new Date().toLocaleDateString('en-GB')} editable={false} />
              </View>
            </View>

            <Text style={styles.label}>Description / Copy text</Text>
            <TextInput style={styles.textArea} placeholder="Enter the ad copy or description here..." multiline numberOfLines={3} value={desc} onChangeText={setDesc} />

            <Text style={styles.label}>Upload File</Text>
            <TouchableOpacity style={[styles.uploadBox, fileUploaded && {borderColor: '#10B981', backgroundColor: '#F0FDF4'}]} onPress={() => setFileUploaded(true)}>
              <FileImage size={32} color={fileUploaded ? '#10B981' : '#94A3B8'} />
              <Text style={[styles.uploadText, fileUploaded && {color: '#10B981'}]}>
                {fileUploaded ? 'Asset_v1.png attached successfully.' : 'Tap to select image, video, or doc'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Internal Notes</Text>
            <TextInput style={styles.input} placeholder="Any notes for the client..." value={notes} onChangeText={setNotes} />
          </View>
        )}

      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnDraft}>
          <Save size={18} color="#64748B" />
          <Text style={styles.btnDraftText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
          <Send size={18} color="#fff" />
          <Text style={styles.btnSubmitText}>{isRevisionRequired ? 'Submit Revision' : 'Send for Approval'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    marginRight: 16, padding: 4,
  },
  headerTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
  },
  headerSub: {
    fontSize: 12, color: '#64748B', marginTop: 2,
  },
  simText: {
    fontSize: 10, color: '#8B5CF6', fontWeight: 'bold', backgroundColor: '#F5F3FF', padding: 6, borderRadius: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16, paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 16,
  },
  label: {
    fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500',
  },
  input: {
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#F8FAFC',
  },
  textArea: {
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#F8FAFC', textAlignVertical: 'top', minHeight: 80,
  },
  dropdownBtn: {
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12,
    marginBottom: 16, backgroundColor: '#F8FAFC',
  },
  dropdownText: {
    fontSize: 14, color: '#0F172A',
  },
  dropdownList: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 16, marginTop: -12,
    maxHeight: 150, elevation: 2,
  },
  dropdownItem: {
    padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 14, color: '#334155',
  },
  uploadBox: {
    borderWidth: 2, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 8, backgroundColor: '#F8FAFC',
    alignItems: 'center', justifyContent: 'center', padding: 24, marginBottom: 16,
  },
  uploadText: {
    marginTop: 12, fontSize: 13, color: '#64748B', fontWeight: '500',
  },
  
  // Revision Flow Styles
  revisionBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#FECACA',
  },
  revisionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  revisionTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#EF4444',
  },
  feedbackBox: {
    backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, flexDirection: 'row', gap: 8, marginBottom: 16,
  },
  feedbackText: {
    flex: 1, fontSize: 13, color: '#334155', fontStyle: 'italic', lineHeight: 20,
  },
  revisionGrid: {
    flexDirection: 'row', gap: 16, marginBottom: 20,
  },
  revisionCol: {
    flex: 1,
  },
  valText: {
    fontSize: 14, fontWeight: '600', color: '#0F172A',
  },
  fileRefBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 20,
  },
  fileName: {
    fontSize: 13, color: '#475569', fontWeight: '500',
  },
  btnSmallIcon: {
    padding: 6, backgroundColor: '#F5F3FF', borderRadius: 6,
  },

  footer: {
    flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12,
  },
  btnDraft: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9',
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingVertical: 12, gap: 8,
  },
  btnDraftText: {
    fontSize: 14, fontWeight: 'bold', color: '#475569',
  },
  btnSubmit: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B5CF6',
    borderRadius: 8, paddingVertical: 12, gap: 8,
  },
  btnSubmitText: {
    fontSize: 14, fontWeight: 'bold', color: '#fff',
  }
});
