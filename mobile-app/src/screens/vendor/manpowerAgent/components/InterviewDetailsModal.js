import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, Calendar, Clock, Video, MapPin, User, Briefcase, CheckCircle, AlertTriangle } from 'lucide-react-native';

import CreateDeploymentModal from './CreateDeploymentModal';

const NAVY = '#081A3A';

export default function InterviewDetailsModal({ visible, onClose, interview }) {
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [localStatus, setLocalStatus] = useState(interview?.status || 'Scheduled');
  const [toastMsg, setToastMsg] = useState("");
  
  const [createDeployVisible, setCreateDeployVisible] = useState(false);

  if (!interview) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleConfirm = () => {
    setLocalStatus('Confirmed');
    showToast("Interview Confirmed!");
  };

  const handleRescheduleSubmit = () => {
    setLocalStatus('Reschedule Requested');
    setRescheduleVisible(false);
    showToast("Reschedule request sent to employer.");
  };

  const handleMarkAttended = () => {
    setLocalStatus('Completed');
    showToast("Candidate marked as attended.");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.title}>Interview Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Alert */}
          <View style={[styles.statusAlert, 
            { backgroundColor: localStatus === 'Confirmed' ? '#ECFDF5' : localStatus === 'Reschedule Requested' ? '#FFFBEB' : localStatus === 'Completed' ? '#F3E8FF' : '#EFF6FF' },
            { borderColor: localStatus === 'Confirmed' ? '#A7F3D0' : localStatus === 'Reschedule Requested' ? '#FDE68A' : localStatus === 'Completed' ? '#D8B4FE' : '#BFDBFE' }
          ]}>
            <Text style={[styles.statusAlertText, 
              { color: localStatus === 'Confirmed' ? '#059669' : localStatus === 'Reschedule Requested' ? '#D97706' : localStatus === 'Completed' ? '#7E22CE' : '#2563EB' }
            ]}>Status: {localStatus}</Text>
          </View>

          {/* Main Info */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconBox}><User size={20} color={NAVY} /></View>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Candidate</Text>
                <Text style={styles.val}>{interview.candidateName}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <View style={styles.iconBox}><Briefcase size={20} color={NAVY} /></View>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.val}>{interview.role}</Text>
                <Text style={styles.subVal}>{interview.business} • {interview.reqId}</Text>
              </View>
            </View>
          </View>

          {/* Schedule Meta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Calendar size={18} color="#64748B" />
                <Text style={styles.metaText}>{interview.date}</Text>
              </View>
              <View style={styles.metaRow}>
                <Clock size={18} color="#64748B" />
                <Text style={styles.metaText}>{interview.time}</Text>
              </View>
              <View style={styles.metaRow}>
                {interview.mode === 'Video Call' ? <Video size={18} color="#64748B" /> : <MapPin size={18} color="#64748B" />}
                <Text style={styles.metaText}>{interview.mode} - {interview.location || 'Link will be shared'}</Text>
              </View>
            </View>
          </View>

          {interview.ownerNotes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Owner Notes:</Text>
              <Text style={styles.notesText}>{interview.ownerNotes}</Text>
            </View>
          )}

          {/* Result Block (If exists) */}
          {interview.result && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Interview Result</Text>
              <Text style={styles.resultStatus}>Employer Decision: <Text style={{color: '#10B981'}}>{interview.result}</Text></Text>
              {interview.result === 'Selected' && (
                <TouchableOpacity style={styles.deployBtn} onPress={() => setCreateDeployVisible(true)}>
                  <Text style={styles.deployBtnText}>Create Deployment</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

        </ScrollView>

        {/* Footer Actions */}
        {!interview.result && (
          <View style={styles.footer}>
            {localStatus === 'Scheduled' && (
              <>
                <TouchableOpacity style={styles.secondaryBtnOutline} onPress={() => setRescheduleVisible(true)}>
                  <Text style={styles.secondaryBtnText}>Request Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtnLarge} onPress={handleConfirm}>
                  <Text style={styles.primaryBtnLargeText}>Confirm Interview</Text>
                </TouchableOpacity>
              </>
            )}
            {localStatus === 'Confirmed' && (
              <TouchableOpacity style={[styles.primaryBtnLarge, {backgroundColor: '#8B5CF6'}]} onPress={handleMarkAttended}>
                <Text style={styles.primaryBtnLargeText}>Mark Candidate Attended</Text>
              </TouchableOpacity>
            )}
            {(localStatus === 'Reschedule Requested' || localStatus === 'Completed') && (
              <Text style={styles.footerWaitText}>Waiting for Employer action...</Text>
            )}
          </View>
        )}

        {/* Reschedule Bottom Sheet */}
        <Modal visible={rescheduleVisible} transparent animationType="slide" onRequestClose={() => setRescheduleVisible(false)}>
          <View style={styles.bottomSheetOverlay}>
            <TouchableOpacity style={styles.bottomSheetBackdrop} onPress={() => setRescheduleVisible(false)} />
            <View style={styles.bottomSheetContent}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Request Reschedule</Text>
                <TouchableOpacity onPress={() => setRescheduleVisible(false)}><X size={20} color="#1E293B" /></TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>Preferred Date</Text>
              <TextInput style={styles.input} placeholder="DD MMM YYYY" />
              
              <Text style={styles.inputLabel}>Preferred Time</Text>
              <TextInput style={styles.input} placeholder="HH:MM AM/PM" />
              
              <Text style={styles.inputLabel}>Reason / Note</Text>
              <TextInput style={styles.inputArea} placeholder="Please specify why the candidate needs a reschedule..." multiline />
              
              <TouchableOpacity style={styles.primaryBtnLarge} onPress={handleRescheduleSubmit}>
                <Text style={styles.primaryBtnLargeText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Create Deployment Full Screen Modal */}
        <CreateDeploymentModal 
          visible={createDeployVisible} 
          onClose={() => setCreateDeployVisible(false)} 
          interviewData={interview}
          onSave={(data) => {
            setCreateDeployVisible(false);
            showToast("Deployment created successfully.");
          }}
        />

        {/* Toast */}
        {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
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

  statusAlert: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  statusAlertText: { fontSize: 14, fontWeight: 'bold' },

  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 24 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  infoCol: { flex: 1 },
  label: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  val: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  subVal: { fontSize: 12, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  metaBox: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, gap: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 15, color: '#334155', marginLeft: 12 },

  notesBox: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 24 },
  notesLabel: { fontSize: 13, fontWeight: 'bold', color: '#D97706', marginBottom: 4 },
  notesText: { fontSize: 14, color: '#92400E', fontStyle: 'italic' },

  resultBox: { backgroundColor: '#ECFDF5', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0', marginBottom: 24 },
  resultTitle: { fontSize: 14, fontWeight: 'bold', color: '#065F46', marginBottom: 8 },
  resultStatus: { fontSize: 16, color: '#065F46', fontWeight: '600' },
  deployBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  deployBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  footer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12 },
  secondaryBtnOutline: { flex: 1, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },
  primaryBtnLarge: { flex: 1.5, backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  footerWaitText: { flex: 1, textAlign: 'center', paddingVertical: 14, color: '#64748B', fontWeight: '500' },

  bottomSheetOverlay: { flex: 1, justifyContent: 'flex-end' },
  bottomSheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheetContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, marginBottom: 16, color: '#1E293B' },
  inputArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 24, color: '#1E293B' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
