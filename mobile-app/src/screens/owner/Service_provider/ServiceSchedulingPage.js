import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, CheckCircle, Calendar, Clock, MapPin, User, FileText, Smartphone, Truck } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';

export default function ServiceSchedulingPage({ provider, onBack, onHome, onTrackService }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    technician: 'Any Available',
    date: '15 Jul 2026',
    time: '10:00 AM - 12:00 PM',
    address: 'The Meridian Hotel, Downtown Branch',
    notes: 'Please enter through the service elevator.'
  });

  if (isConfirmed) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <CheckCircle size={64} color="#16A34A" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed</Text>
          <Text style={styles.successDesc}>Your service has been scheduled successfully.</Text>
          
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Booking ID</Text>
              <Text style={styles.receiptValue}>BKG-84729</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Provider</Text>
              <Text style={styles.receiptValue}>{provider?.name || 'Elite Fixers'}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Service</Text>
              <Text style={styles.receiptValue}>Deep Kitchen Cleaning</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date</Text>
              <Text style={styles.receiptValue}>{formData.date}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Time</Text>
              <Text style={styles.receiptValue}>{formData.time}</Text>
            </View>
          </View>

          <View style={styles.successActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onTrackService}>
              <Truck size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Track Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Smartphone size={16} color={NAVY} style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>Contact Provider</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn} onPress={onHome}>
              <Text style={styles.outlineBtnText}>Back Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Service Scheduling</Text>
          <Text style={styles.pageSubtitle}>Confirm booking with {provider?.name || 'Selected Provider'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          <View style={styles.formCard}>
            
            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Selected Provider</Text>
                <View style={styles.readOnlyWrapper}>
                  <Text style={styles.readOnlyText}>{provider?.name || 'Elite Fixers'}</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Technician Preference</Text>
                <View style={styles.inputWrapper}>
                  <User size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    value={formData.technician}
                    onChangeText={(t) => setFormData({...formData, technician: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Scheduled Date</Text>
                <View style={styles.inputWrapper}>
                  <Calendar size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    value={formData.date}
                    onChangeText={(t) => setFormData({...formData, date: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Time Slot</Text>
                <View style={styles.inputWrapper}>
                  <Clock size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    value={formData.time}
                    onChangeText={(t) => setFormData({...formData, time: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Address</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={16} color="#64748B" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={formData.address}
                  onChangeText={(t) => setFormData({...formData, address: t})}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Special Notes</Text>
              <View style={[styles.inputWrapper, { height: 80, alignItems: 'flex-start', paddingVertical: 12 }]}>
                <FileText size={16} color="#64748B" style={[styles.inputIcon, { marginTop: 2 }]} />
                <TextInput 
                  style={[styles.input, { height: '100%', textAlignVertical: 'top' }]} 
                  multiline
                  value={formData.notes}
                  onChangeText={(t) => setFormData({...formData, notes: t})}
                />
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.submitBtn} onPress={() => setIsConfirmed(true)}>
                <Text style={styles.submitBtnText}>Confirm Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rescheduleBtn}>
                <Text style={styles.rescheduleBtnText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={onBack}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%', gap: 32 },

  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  formRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', zIndex: 1 },
  inputGroup: { flex: 1, minWidth: 200, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 12, height: 44 },
  readOnlyWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, backgroundColor: '#F1F5F9', paddingHorizontal: 12, height: 44 },
  readOnlyText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },

  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  submitBtn: { flex: 1, minWidth: 150, height: 48, borderRadius: 12, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  rescheduleBtn: { flex: 1, minWidth: 120, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  rescheduleBtnText: { fontSize: 14, fontWeight: '700', color: NAVY },
  cancelBtn: { flex: 1, minWidth: 100, height: 48, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },

  // Success State
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, paddingTop: 48 },
  successIconBox: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 12, textAlign: 'center' },
  successDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', maxWidth: 400, marginBottom: 32 },
  
  receiptCard: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border, marginBottom: 32 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  receiptLabel: { fontSize: 14, color: '#64748B' },
  receiptValue: { fontSize: 14, fontWeight: '800', color: NAVY },

  successActions: { gap: 12, width: '100%', maxWidth: 400 },
  primaryBtn: { flexDirection: 'row', height: 48, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  secondaryBtn: { flexDirection: 'row', height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: NAVY },
  outlineBtn: { height: 48, borderRadius: 12, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  outlineBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' }
});
