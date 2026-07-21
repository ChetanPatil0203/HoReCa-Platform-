import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, ToastAndroid } from 'react-native';
import { 
  Plus, Edit, Eye, Image as ImageIcon, Star, Archive, 
  ToggleRight, ToggleLeft, TrendingUp, Calendar, MapPin, X, 
  UploadCloud, ChevronDown, CheckCircle
} from 'lucide-react-native';

const PORTFOLIO_TYPES = [
  "Social Media Campaign", "Branding", "Photography", 
  "Videography", "Website", "SEO Case Study", 
  "Ads Campaign", "Hoarding", "Banner", 
  "Event Promotion", "Restaurant Launch"
];

const MOCK_PORTFOLIO = [
  {
    id: 'PF-01',
    title: 'Azure Palace Rebranding & Launch',
    category: 'Branding',
    client: 'Azure Palace Hotel',
    type: 'Online & Offline',
    description: 'Complete brand overhaul including logo, social media templates, and hoarding designs.',
    duration: '3 Months',
    resultSummary: '+300% Engagement, 50k Reach',
    isPublished: true,
    isFeatured: true
  },
  {
    id: 'PF-02',
    title: 'Weekend Brunch Reels',
    category: 'Videography',
    client: 'Café Zephyr Group',
    type: 'Online',
    description: 'A series of 5 high-quality reels showcasing the new brunch menu.',
    duration: '2 Weeks',
    resultSummary: '1M+ Views, 20k Likes',
    isPublished: true,
    isFeatured: false
  },
  {
    id: 'PF-03',
    title: 'Spice Route Menu Pamphlets',
    category: 'Pamphlet',
    client: 'Spice Route Restaurant',
    type: 'Offline',
    description: 'Design and print of 10,000 pamphlets distributed locally.',
    duration: '1 Week',
    resultSummary: '20% Increase in Walk-ins',
    isPublished: false,
    isFeatured: false
  }
];

export default function MarketingPortfolioScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  
  // Form State
  const [newCat, setNewCat] = useState('Social Media Campaign');

  const togglePublish = (item) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${item.title} is now ${item.isPublished ? 'Unpublished' : 'Published'}`, ToastAndroid.SHORT);
    }
  };

  const handleSave = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Portfolio item saved!", ToastAndroid.SHORT);
    }
    setAddModalVisible(false);
  };

  const renderPortfolioCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.coverPlaceholder}>
         <ImageIcon size={32} color="#94A3B8" />
         <Text style={styles.coverText}>Cover Image (16:9)</Text>
         {item.isFeatured && (
           <View style={styles.featuredBadge}>
             <Star size={12} color="#fff" fill="#fff" />
             <Text style={styles.featuredText}>Featured</Text>
           </View>
         )}
      </View>
      
      <View style={styles.cardContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
           <View style={{flex: 1}}>
             <Text style={styles.cardTitle}>{item.title}</Text>
             <Text style={styles.clientText}>{item.client}</Text>
           </View>
           <View style={styles.catBadge}>
             <Text style={styles.catBadgeText}>{item.category}</Text>
           </View>
         </View>

         <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
         
         <View style={styles.metricsGrid}>
           <View style={styles.metricItem}>
              <MapPin size={14} color="#64748B"/>
              <Text style={styles.metricText}>{item.type}</Text>
           </View>
           <View style={styles.metricItem}>
              <Calendar size={14} color="#64748B"/>
              <Text style={styles.metricText}>{item.duration}</Text>
           </View>
         </View>

         <View style={styles.resultBox}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.resultText}>{item.resultSummary}</Text>
         </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
         <TouchableOpacity style={styles.btnOutline}><Eye size={16} color="#8B5CF6"/><Text style={styles.btnOutlineText}>View</Text></TouchableOpacity>
         <TouchableOpacity style={styles.btnOutline}><Edit size={16} color="#8B5CF6"/><Text style={styles.btnOutlineText}>Edit</Text></TouchableOpacity>
         
         <TouchableOpacity style={[styles.btnOutline, item.isPublished ? {borderColor: '#10B981', backgroundColor: '#ECFDF5'} : {borderColor: '#94A3B8', backgroundColor: '#F8FAFC'}]} onPress={() => togglePublish(item)}>
            {item.isPublished ? <ToggleRight size={16} color="#10B981"/> : <ToggleLeft size={16} color="#94A3B8"/>}
            <Text style={[styles.btnOutlineText, item.isPublished ? {color: '#10B981'} : {color: '#64748B'}]}>
              {item.isPublished ? 'Published' : 'Unpublished'}
            </Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.btnOutline}><Star size={16} color="#F59E0B"/><Text style={[styles.btnOutlineText, {color: '#F59E0B'}]}>Feature</Text></TouchableOpacity>
         <TouchableOpacity style={styles.btnDangerOutline}><Archive size={16} color="#EF4444"/><Text style={styles.btnDangerText}>Archive</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderAddModal = () => (
    <Modal visible={addModalVisible} animationType="slide">
      <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalHeader}>
           <Text style={styles.modalTitle}>Add Portfolio Item</Text>
           <TouchableOpacity onPress={() => setAddModalVisible(false)}><X size={24} color="#0F172A"/></TouchableOpacity>
        </View>
        <ScrollView style={styles.modalScroll} contentContainerStyle={{padding: 16}}>
           
           <Text style={styles.label}>Cover Image / Video</Text>
           <TouchableOpacity style={styles.uploadBox}>
              <UploadCloud size={32} color="#8B5CF6"/>
              <Text style={styles.uploadText}>Tap to upload hero media</Text>
           </TouchableOpacity>

           <Text style={styles.label}>Project Title</Text>
           <TextInput style={styles.input} placeholder="e.g. Summer Launch Campaign" />
           
           <View style={styles.row}>
             <View style={styles.col}><Text style={styles.label}>Client Name</Text><TextInput style={styles.input} placeholder="e.g. Azure Hotel" /></View>
             <View style={styles.col}><Text style={styles.label}>Marketing Type</Text><TextInput style={styles.input} placeholder="Online/Offline" /></View>
           </View>

           <Text style={styles.label}>Category</Text>
           <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowCatDropdown(!showCatDropdown)}>
              <Text style={styles.dropdownText}>{newCat}</Text>
              <ChevronDown size={20} color="#64748B" />
           </TouchableOpacity>
           {showCatDropdown && (
              <View style={styles.dropdownList}>
                {PORTFOLIO_TYPES.map(c => (
                  <TouchableOpacity key={c} style={styles.dropdownItem} onPress={() => { setNewCat(c); setShowCatDropdown(false); }}>
                    <Text style={styles.dropdownItemText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
           )}

           <Text style={styles.label}>Description</Text>
           <TextInput style={styles.textArea} placeholder="Briefly describe the project..." multiline numberOfLines={3} />
           
           <Text style={styles.label}>Objectives</Text>
           <TextInput style={styles.textArea} placeholder="What was the goal?" multiline numberOfLines={2} />

           <Text style={styles.label}>Work Delivered</Text>
           <TextInput style={styles.textArea} placeholder="e.g. 5 Reels, 1 Logo, 2 Hoardings..." multiline numberOfLines={2} />

           <Text style={styles.label}>Results / ROI</Text>
           <TextInput style={styles.input} placeholder="e.g. +300% Engagement, 50k Reach" />

           <View style={styles.row}>
             <View style={styles.col}><Text style={styles.label}>Tags</Text><TextInput style={styles.input} placeholder="e.g. Branding, F&B" /></View>
             <View style={styles.col}><Text style={styles.label}>Completion Date</Text><TextInput style={styles.input} placeholder="MM/YYYY" /></View>
           </View>

        </ScrollView>
        <View style={styles.modalFooter}>
           <TouchableOpacity style={styles.btnPrimaryFull} onPress={handleSave}><Text style={styles.btnPrimaryFullText}>Save Portfolio Item</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Agency Portfolio</Text>
         <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add Item</Text>
         </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_PORTFOLIO}
        keyExtractor={item => item.id}
        renderItem={renderPortfolioCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {renderAddModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#0F172A',
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6,
  },
  addBtnText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  listContainer: {
    padding: 16, paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1, overflow: 'hidden'
  },
  coverPlaceholder: {
    height: 160, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', position: 'relative'
  },
  coverText: {
    fontSize: 12, color: '#64748B', marginTop: 8, fontWeight: '500'
  },
  featuredBadge: {
    position: 'absolute', top: 12, left: 12, backgroundColor: '#F59E0B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4
  },
  featuredText: {
    color: '#fff', fontSize: 10, fontWeight: 'bold'
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 2,
  },
  clientText: {
    fontSize: 14, color: '#475569', fontWeight: '500', marginBottom: 12,
  },
  catBadge: {
    backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#DDD6FE'
  },
  catBadgeText: {
    fontSize: 11, color: '#8B5CF6', fontWeight: '600'
  },
  descText: {
    fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row', gap: 16, marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  metricText: {
    fontSize: 12, color: '#64748B',
  },
  resultBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 12, borderRadius: 8, gap: 8,
  },
  resultText: {
    fontSize: 14, fontWeight: 'bold', color: '#10B981', flex: 1,
  },
  actionsRow: {
    paddingHorizontal: 16, paddingBottom: 16, gap: 8,
  },
  btnOutline: {
    flexDirection: 'row', backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnOutlineText: {
    color: '#8B5CF6', fontWeight: 'bold', fontSize: 13,
  },
  btnDangerOutline: {
    flexDirection: 'row', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnDangerText: {
    color: '#EF4444', fontWeight: 'bold', fontSize: 13,
  },
  
  // Modals
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  modalScroll: { flex: 1 },
  label: { fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff' },
  textArea: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff', textAlignVertical: 'top', minHeight: 60 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  uploadBox: { borderWidth: 2, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24, marginBottom: 16 },
  uploadText: { fontSize: 13, color: '#64748B', marginTop: 12, fontWeight: '500' },
  modalFooter: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimaryFull: { backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnPrimaryFullText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16, backgroundColor: '#fff' },
  dropdownText: { fontSize: 14, color: '#0F172A' },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 16, marginTop: -12, maxHeight: 150 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemText: { fontSize: 14, color: '#334155' },
});
