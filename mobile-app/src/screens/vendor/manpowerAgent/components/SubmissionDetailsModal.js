import React from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileText, Building2, User, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';

const NAVY = '#081A3A';

export default function SubmissionDetailsModal({ visible, onClose, submission }) {
  if (!submission) return null;

  const TIMELINE = [
    { status: 'Submitted', desc: 'Sent to employer' },
    { status: 'Viewed', desc: 'Employer viewed profile' },
    { status: 'Shortlisted', desc: 'Candidate shortlisted' },
    { status: 'Interview Scheduled', desc: 'Interview arranged' },
    { status: 'Selected', desc: 'Candidate finalized' }
  ];

  const getStatusIndex = (currentStatus) => {
    const statuses = ['Submitted', 'Viewed', 'Shortlisted', 'Interview Scheduled', 'Selected'];
    return statuses.indexOf(currentStatus);
  };

  const currentIndex = getStatusIndex(submission.status);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.title}>Submission Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Info Card */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconBox}><User size={20} color={NAVY} /></View>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Candidate</Text>
                <Text style={styles.val}>{submission.candidateName}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <View style={styles.iconBox}><FileText size={20} color={NAVY} /></View>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Requirement Role</Text>
                <Text style={styles.val}>{submission.role}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <View style={styles.iconBox}><Building2 size={20} color={NAVY} /></View>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Business</Text>
                <Text style={styles.val}>{submission.business}</Text>
              </View>
            </View>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Submission Meta</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Submitted Date:</Text>
              <Text style={styles.metaVal}>{submission.date || 'N/A'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Agency Note:</Text>
              <Text style={styles.metaVal}>{submission.note || 'None'}</Text>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            
            {submission.status === 'Rejected' ? (
              <View style={styles.rejectedBox}>
                <AlertCircle size={24} color="#DC2626" />
                <View style={{marginLeft: 12}}>
                  <Text style={styles.rejectedTitle}>Candidate Rejected</Text>
                  <Text style={styles.rejectedSub}>{submission.feedback || 'No specific feedback provided by employer.'}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.timeline}>
                {TIMELINE.map((step, idx) => {
                  const isCompleted = idx <= currentIndex;
                  const isActive = idx === currentIndex;
                  
                  return (
                    <View key={idx} style={styles.timelineStep}>
                      <View style={styles.timelineIconCol}>
                        <View style={[styles.timelineNode, isCompleted && styles.timelineNodeActive]}>
                          {isCompleted ? <CheckCircle size={14} color="#fff" /> : <Clock size={14} color="#94A3B8" />}
                        </View>
                        {idx < TIMELINE.length - 1 && <View style={[styles.timelineLine, isCompleted && idx < currentIndex && styles.timelineLineActive]} />}
                      </View>
                      <View style={styles.timelineTextCol}>
                        <Text style={[styles.timelineStepTitle, isActive && styles.timelineStepTitleActive]}>{step.status}</Text>
                        <Text style={styles.timelineStepDesc}>{step.desc}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {submission.feedback && submission.status !== 'Rejected' && (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackLabel}>Owner Feedback:</Text>
              <Text style={styles.feedbackText}>{submission.feedback}</Text>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  closeBtn: { padding: 4 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  
  content: { flex: 1, padding: 16 },
  
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 24 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  infoCol: { flex: 1 },
  label: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  val: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  
  metaRow: { flexDirection: 'row', marginBottom: 8 },
  metaLabel: { width: 120, fontSize: 14, color: '#64748B' },
  metaVal: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '500' },

  timeline: { paddingLeft: 8 },
  timelineStep: { flexDirection: 'row', minHeight: 60 },
  timelineIconCol: { alignItems: 'center', width: 30, marginRight: 16 },
  timelineNode: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  timelineNodeActive: { backgroundColor: '#10B981' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: -4 },
  timelineLineActive: { backgroundColor: '#10B981' },
  timelineTextCol: { flex: 1, paddingBottom: 24 },
  timelineStepTitle: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  timelineStepTitleActive: { color: '#1E293B' },
  timelineStepDesc: { fontSize: 13, color: '#94A3B8', marginTop: 4 },

  rejectedBox: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA' },
  rejectedTitle: { fontSize: 16, fontWeight: 'bold', color: '#991B1B' },
  rejectedSub: { fontSize: 14, color: '#B91C1C', marginTop: 4 },

  feedbackBox: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 24 },
  feedbackLabel: { fontSize: 13, fontWeight: 'bold', color: '#D97706', marginBottom: 4 },
  feedbackText: { fontSize: 14, color: '#92400E', fontStyle: 'italic' },
});
