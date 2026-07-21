import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform, SafeAreaView } from 'react-native';
import { CheckCircle, Clock, AlertCircle, FilePlus, Bell, ChevronRight, FileText, X, UploadCloud, Calendar } from 'lucide-react-native';

const MOCK_DOCUMENTS = [
  {
    id: '1',
    name: 'FSSAI License',
    status: 'Active',
    validTill: '24 Jan 2026',
    licenseNumber: '10021022000123',
    issueDate: '24 Jan 2021',
  },
  {
    id: '2',
    name: 'GST Registration',
    status: 'Active',
    validTill: '31 Mar 2026',
    licenseNumber: '27AADCB2230M1Z2',
    issueDate: '01 Apr 2021',
  },
  {
    id: '3',
    name: 'Fire Safety Certificate',
    status: 'Expiring Soon',
    validTill: '12 Jul 2025',
    licenseNumber: 'FSC/2024/9912',
    issueDate: '12 Jul 2024',
  },
  {
    id: '4',
    name: 'Shop & Establishment License',
    status: 'Active',
    validTill: '18 Feb 2026',
    licenseNumber: 'SHOP/MH/2023/44',
    issueDate: '18 Feb 2023',
  }
];

export default function CompliancePage() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // Modals state
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10B981';
      case 'Expiring Soon': return '#F59E0B';
      case 'Expired': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Active': return '#ECFDF5';
      case 'Expiring Soon': return '#FFFBEB';
      case 'Expired': return '#FEF2F2';
      default: return '#F8FAFC';
    }
  };

  const openDetails = (doc) => {
    setSelectedDoc(doc);
    setDetailsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.pageTitle}>Compliance</Text>
        <Text style={styles.pageSubtitle}>Manage your licenses and certificates</Text>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { borderColor: '#ECFDF5' }]}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle size={20} color="#10B981" />
          </View>
          <View>
            <Text style={styles.summaryCount}>4</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { borderColor: '#FFFBEB' }]}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#FFFBEB' }]}>
            <Clock size={20} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.summaryCount}>1</Text>
            <Text style={styles.summaryLabel}>Expiring Soon</Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { borderColor: '#FEF2F2' }]}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#FEF2F2' }]}>
            <AlertCircle size={20} color="#EF4444" />
          </View>
          <View>
            <Text style={styles.summaryCount}>0</Text>
            <Text style={styles.summaryLabel}>Expired</Text>
          </View>
        </View>
      </View>

      {/* Primary Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => setUploadModalVisible(true)}>
          <FilePlus size={18} color="#fff" />
          <Text style={styles.actionBtnTextPrimary}>Upload Document</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtnSecondary} onPress={() => setReminderModalVisible(true)}>
          <Bell size={18} color="#7C3AED" />
          <Text style={styles.actionBtnTextSecondary}>Set Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Documents List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>My Documents</Text>
        
        {documents.map((doc) => (
          <TouchableOpacity 
            key={doc.id} 
            style={styles.docCard}
            onPress={() => openDetails(doc)}
          >
            <View style={styles.docIconBox}>
              <FileText size={22} color="#64748B" />
            </View>
            
            <View style={styles.docInfo}>
              <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
              <View style={styles.docMetaRow}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(doc.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(doc.status) }]}>{doc.status}</Text>
                </View>
                <Text style={styles.docExpiryText}>Valid till {doc.validTill}</Text>
              </View>
            </View>
            
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* MODAL: Document Details */}
      <Modal visible={detailsModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedDoc && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Document Name</Text>
                  <Text style={styles.detailValue}>{selectedDoc.name}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>License Number</Text>
                  <Text style={styles.detailValue}>{selectedDoc.licenseNumber}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Issue Date</Text>
                  <Text style={styles.detailValue}>{selectedDoc.issueDate}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Expiry Date</Text>
                  <Text style={styles.detailValue}>{selectedDoc.validTill}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Current Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(selectedDoc.status), alignSelf: 'flex-start' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedDoc.status) }]}>{selectedDoc.status}</Text>
                  </View>
                </View>

                <View style={styles.previewBox}>
                  <FileText size={40} color="#94A3B8" style={{marginBottom: 8}} />
                  <Text style={{color: '#64748B', fontSize: 13}}>Document Preview</Text>
                </View>

                <TouchableOpacity style={styles.modalActionBtnPrimary}>
                  <Text style={styles.modalActionTextPrimary}>View Full Document</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalActionBtnOutline}>
                  <Text style={styles.modalActionTextOutline}>Replace / Update</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL: Upload Document */}
      <Modal visible={uploadModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { marginTop: 'auto', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Document</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Document Type</Text>
                <TextInput style={styles.input} placeholder="e.g. FSSAI License" placeholderTextColor="#94A3B8" />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Document / License Number</Text>
                <TextInput style={styles.input} placeholder="Enter license number" placeholderTextColor="#94A3B8" />
              </View>

              <View style={{flexDirection: 'row', gap: 12}}>
                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={styles.inputLabel}>Issue Date</Text>
                  <TextInput style={styles.input} placeholder="DD MMM YYYY" placeholderTextColor="#94A3B8" />
                </View>
                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput style={styles.input} placeholder="DD MMM YYYY" placeholderTextColor="#94A3B8" />
                </View>
              </View>

              <TouchableOpacity style={styles.uploadArea}>
                <UploadCloud size={32} color="#7C3AED" style={{marginBottom: 8}} />
                <Text style={styles.uploadAreaTitle}>Tap to upload file</Text>
                <Text style={styles.uploadAreaSub}>PDF, JPG or PNG (Max 5MB)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalActionBtnPrimary, {marginTop: 24}]} onPress={() => setUploadModalVisible(false)}>
                <Text style={styles.modalActionTextPrimary}>Save Document</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: Set Reminder */}
      <Modal visible={reminderModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 340 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Renewal Reminder</Text>
              <TouchableOpacity onPress={() => setReminderModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={{color: '#64748B', fontSize: 14, marginBottom: 16}}>
                Get notified before your compliance documents expire.
              </Text>

              <TouchableOpacity style={styles.reminderOption}>
                <Calendar size={18} color="#7C3AED" style={{marginRight: 12}} />
                <Text style={styles.reminderOptionText}>30 days before</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.reminderOption}>
                <Calendar size={18} color="#7C3AED" style={{marginRight: 12}} />
                <Text style={styles.reminderOptionText}>15 days before</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reminderOption}>
                <Calendar size={18} color="#7C3AED" style={{marginRight: 12}} />
                <Text style={styles.reminderOptionText}>7 days before</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalActionBtnPrimary, {marginTop: 24}]} onPress={() => setReminderModalVisible(false)}>
                <Text style={styles.modalActionTextPrimary}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  headerArea: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#081A3A',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#081A3A',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionBtnTextPrimary: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionBtnTextSecondary: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#081A3A',
    marginBottom: 16,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#081A3A',
    marginBottom: 6,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  docExpiryText: {
    fontSize: 12,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#081A3A',
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#081A3A',
    fontWeight: '500',
  },
  previewBox: {
    height: 120,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  modalActionBtnPrimary: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalActionTextPrimary: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalActionBtnOutline: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  modalActionTextOutline: {
    color: '#081A3A',
    fontSize: 15,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#081A3A',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#081A3A',
    backgroundColor: '#FAFAF9',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#F8FAFC',
  },
  uploadAreaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 4,
  },
  uploadAreaSub: {
    fontSize: 12,
    color: '#64748B',
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginBottom: 10,
  },
  reminderOptionText: {
    fontSize: 15,
    color: '#081A3A',
    fontWeight: '500',
  }
});
