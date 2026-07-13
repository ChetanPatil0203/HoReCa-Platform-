import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, CheckCircle, Check, Image as ImageIcon, BarChart2, Star, RefreshCw, FileText } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';

const MOCK_TIMELINE = [
  { id: 1, title: 'Requirement Sent', time: '14 Jul, 09:00 AM', completed: true },
  { id: 2, title: 'Proposal Accepted', time: '14 Jul, 02:30 PM', completed: true },
  { id: 3, title: 'Creative Approval', time: '16 Jul, 10:15 AM', completed: true },
  { id: 4, title: 'Campaign Started', time: '18 Jul, 09:00 AM', completed: true },
  { id: 5, title: 'Campaign Running', time: '18 Jul - 18 Aug', completed: true },
  { id: 6, title: 'Completed', time: '18 Aug, 05:00 PM', completed: true }
];

const MOCK_REPORT = {
  reach: '1.2M',
  impressions: '3.5M',
  clicks: '84.5K',
  leads: '4,200',
  conversions: '850',
  roi: '4.2x',
  budgetUsed: '₹50,000'
};

export default function TrackCampaignPage({ campaign, onBack, onReview, onBookAgain }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const isCompleted = true; // Hardcoded for demo of report

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Campaign Tracking</Text>
          <Text style={styles.pageSubtitle}>Summer Festival Promo • CMP-001</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Timeline Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Campaign Timeline</Text>
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
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Campaign Report */}
          {isCompleted && (
            <View style={styles.sectionCard}>
              <View style={styles.completedHeader}>
                <BarChart2 size={24} color="#16A34A" style={{ marginRight: 8 }} />
                <Text style={styles.completedTitle}>Final Campaign Report</Text>
              </View>

              <View style={styles.metricsGrid}>
                {Object.entries(MOCK_REPORT).map(([key, val]) => (
                  <View key={key} style={styles.metricBox}>
                    <Text style={styles.metricValue}>{val}</Text>
                    <Text style={styles.metricLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              <Text style={styles.subHeading}>Creative Gallery</Text>
              <View style={styles.imagesRow}>
                {[1, 2, 3].map(i => (
                  <View key={i} style={styles.imagePlaceholder}>
                    <ImageIcon size={24} color="#94A3B8" />
                  </View>
                ))}
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
  stepTime: { fontSize: 12, color: '#64748B' },

  // Report Section
  completedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  completedTitle: { fontSize: 18, fontWeight: '800', color: '#16A34A' },
  
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metricBox: { flex: 1, minWidth: 120, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  metricValue: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 4 },
  metricLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', textAlign: 'center' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 24 },
  subHeading: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 12 },
  
  imagesRow: { flexDirection: 'row', gap: 16 },
  imagePlaceholder: { flex: 1, height: 100, backgroundColor: '#F1F5F9', borderRadius: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },

  actionButtonsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionBtnPrimary: { flex: 1, minWidth: 150, flexDirection: 'row', height: 48, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  actionBtnTextPrimary: { fontSize: 14, fontWeight: '700', color: '#fff' },
  actionBtnOutline: { flex: 1, minWidth: 150, flexDirection: 'row', height: 48, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  actionBtnTextOutline: { fontSize: 14, fontWeight: '700', color: NAVY }
});
