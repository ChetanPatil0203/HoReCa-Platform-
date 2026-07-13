import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, Image } from 'react-native';
import { ArrowLeft, CheckCircle, Clock, Check, FileText, ImageIcon, ShieldCheck, Star, AlertTriangle, RefreshCw, FileImage } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';

const MOCK_TIMELINE = [
  { id: 1, title: 'Request Sent', time: '14 Jul, 09:00 AM', completed: true },
  { id: 2, title: 'Accepted by Provider', time: '14 Jul, 09:30 AM', completed: true },
  { id: 3, title: 'Technician Assigned', time: '14 Jul, 10:15 AM', subtitle: 'John Doe (+91 9876543210)', completed: true },
  { id: 4, title: 'On The Way', time: '15 Jul, 09:30 AM', completed: true },
  { id: 5, title: 'Work Started', time: '15 Jul, 10:00 AM', completed: true },
  { id: 6, title: 'Completed', time: '15 Jul, 01:30 PM', completed: true } // Toggle this for active vs completed state
];

export default function TrackServicePage({ request, onBack, onReview, onComplaint, onBookAgain }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  // Hardcoding true for demonstration of Completed Services view
  const isServiceCompleted = true; 

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Service Tracking</Text>
          <Text style={styles.pageSubtitle}>BKG-84729 • Elite Fixers</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Timeline Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Tracking Timeline</Text>
            <View style={styles.timelineContainer}>
              {MOCK_TIMELINE.map((step, index) => (
                <View key={step.id} style={styles.timelineStep}>
                  <View style={styles.timelineIconCol}>
                    <View style={[styles.timelineNode, step.completed ? styles.nodeCompleted : styles.nodePending]}>
                      {step.completed && <Check size={14} color="#fff" />}
                    </View>
                    {index < MOCK_TIMELINE.length - 1 && (
                      <View style={[styles.timelineLine, step.completed ? styles.lineCompleted : styles.linePending]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.stepTitle, step.completed ? styles.textNavy : styles.textGray]}>{step.title}</Text>
                    {step.subtitle && <Text style={styles.stepSubtitle}>{step.subtitle}</Text>}
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Completed Service Information */}
          {isServiceCompleted && (
            <View style={styles.sectionCard}>
              <View style={styles.completedHeader}>
                <CheckCircle size={24} color="#16A34A" style={{ marginRight: 8 }} />
                <Text style={styles.completedTitle}>Service Completed Successfully</Text>
              </View>

              <View style={styles.infoGrid}>
                {/* Invoice */}
                <View style={styles.infoBox}>
                  <View style={styles.infoBoxHeader}>
                    <FileText size={18} color={NAVY} />
                    <Text style={styles.infoBoxTitle}>Invoice</Text>
                  </View>
                  <Text style={styles.infoText}>INV-2026-992</Text>
                  <Text style={styles.infoTextBold}>Total: ₹5,400</Text>
                  <TouchableOpacity style={styles.linkBtn}>
                    <Text style={styles.linkText}>Download PDF</Text>
                  </TouchableOpacity>
                </View>

                {/* Warranty */}
                <View style={styles.infoBox}>
                  <View style={styles.infoBoxHeader}>
                    <ShieldCheck size={18} color={NAVY} />
                    <Text style={styles.infoBoxTitle}>Warranty</Text>
                  </View>
                  <Text style={styles.infoText}>Covered for 30 Days</Text>
                  <Text style={styles.infoTextBold}>Valid until 14 Aug 2026</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.subHeading}>Completion Notes</Text>
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>
                  "Deep cleaning of the kitchen completed. Exhaust fans were heavily greased and took extra time, but everything is functioning properly now. Replaced one minor filter."
                </Text>
              </View>

              <Text style={styles.subHeading}>Before & After Images</Text>
              <View style={styles.imagesRow}>
                <View style={styles.imagePlaceholder}>
                  <FileImage size={24} color="#94A3B8" />
                  <Text style={styles.imageLabel}>Before</Text>
                </View>
                <View style={styles.imagePlaceholder}>
                  <FileImage size={24} color="#94A3B8" />
                  <Text style={styles.imageLabel}>After</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.actionBtnPrimary} onPress={onBookAgain}>
                  <RefreshCw size={16} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.actionBtnTextPrimary}>Book Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnOutline} onPress={onReview}>
                  <Star size={16} color={NAVY} style={{ marginRight: 8 }} />
                  <Text style={styles.actionBtnTextOutline}>Write Review</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: '#FECACA' }]} onPress={onComplaint}>
                  <AlertTriangle size={16} color="#DC2626" style={{ marginRight: 8 }} />
                  <Text style={[styles.actionBtnTextOutline, { color: '#DC2626' }]}>Raise Complaint</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}

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

  sectionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 24 },
  
  // Timeline
  timelineContainer: { paddingLeft: 8 },
  timelineStep: { flexDirection: 'row', marginBottom: 20 },
  timelineIconCol: { alignItems: 'center', marginRight: 16, width: 24 },
  timelineNode: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  nodeCompleted: { backgroundColor: '#16A34A' },
  nodePending: { backgroundColor: '#E2E8F0', borderWidth: 2, borderColor: '#fff' },
  timelineLine: { width: 2, height: '100%', position: 'absolute', top: 24, bottom: -20, zIndex: 1 },
  lineCompleted: { backgroundColor: '#16A34A' },
  linePending: { backgroundColor: '#E2E8F0' },
  timelineContent: { flex: 1, paddingBottom: 8 },
  stepTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  textNavy: { color: NAVY },
  textGray: { color: '#94A3B8' },
  stepSubtitle: { fontSize: 13, color: '#475569', marginBottom: 4 },
  stepTime: { fontSize: 12, color: '#64748B' },

  // Completed Section
  completedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  completedTitle: { fontSize: 18, fontWeight: '800', color: '#16A34A' },
  
  infoGrid: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  infoBox: { flex: 1, minWidth: 200, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  infoBoxHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  infoBoxTitle: { fontSize: 15, fontWeight: '800', color: NAVY },
  infoText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  infoTextBold: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 12 },
  linkBtn: { alignSelf: 'flex-start' },
  linkText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 24 },
  subHeading: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 12 },
  
  notesBox: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 24 },
  notesText: { fontSize: 14, color: '#92400E', lineHeight: 22, fontStyle: 'italic' },

  imagesRow: { flexDirection: 'row', gap: 16 },
  imagePlaceholder: { flex: 1, height: 120, backgroundColor: '#F1F5F9', borderRadius: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  imageLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginTop: 8 },

  actionButtonsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionBtnPrimary: { flex: 1, minWidth: 150, flexDirection: 'row', height: 48, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  actionBtnTextPrimary: { fontSize: 14, fontWeight: '700', color: '#fff' },
  actionBtnOutline: { flex: 1, minWidth: 150, flexDirection: 'row', height: 48, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  actionBtnTextOutline: { fontSize: 14, fontWeight: '700', color: NAVY }
});
