import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  useWindowDimensions
} from 'react-native';
import {
  X,
  Send,
  Paperclip,
  ChevronDown,
  CircleCheck,
  CircleAlert,
  FileText,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Search,
  Check,
  Clock,
  ShieldAlert
} from 'lucide-react-native';

const COLORS = {
  navy: '#071B3A',
  gold: '#F2C230',
  background: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E3E9F1',
  primaryText: '#091B3A',
  secondaryText: '#71829B',
  success: '#16B77A',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  inputBg: '#F8FAFC',
};

const CATEGORIES = [
  'Account & Login',
  'Payment & Billing',
  'Order / Delivery',
  'Manpower',
  'Service Booking',
  'Marketing Campaign',
  'Compliance',
  'Technical Issue',
  'Complaint',
  'Other'
];

const RELATED_TO_OPTIONS = [
  'None',
  'Raw Material Order',
  'Manpower Requirement',
  'Service Booking',
  'Marketing Campaign',
  'Invoice / Payment',
  'Compliance Document'
];

const SAMPLE_RECORDS = {};

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function SubmitSupportTicketModal({ visible, onClose, onSubmitSuccess, onViewTicket }) {
  const { width } = useWindowDimensions();

  // Form State
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [relatedTo, setRelatedTo] = useState('None');
  const [relatedRecord, setRelatedRecord] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [contactPreference, setContactPreference] = useState('In-App Response');
  const [attachments, setAttachments] = useState([]);

  // Dropdown Picker Modals
  const [pickerType, setPickerType] = useState(null); // 'category' | 'relatedTo' | 'relatedRecord'
  const [recordSearch, setRecordSearch] = useState('');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [fileError, setFileError] = useState('');

  // Related Records List based on selection
  const availableRecords = useMemo(() => {
    if (!relatedTo || relatedTo === 'None') return [];
    const list = SAMPLE_RECORDS[relatedTo] || [];
    if (!recordSearch.trim()) return list;
    return list.filter(item => item.title.toLowerCase().includes(recordSearch.toLowerCase()));
  }, [relatedTo, recordSearch]);

  // Validation
  const isFormValid = useMemo(() => {
    if (!category) return false;
    if (!subject.trim() || subject.trim().length > 100) return false;
    if (!description.trim() || description.trim().length > 700) return false;
    if (!priority) return false;
    if (relatedTo !== 'None' && !relatedRecord) return false;
    return true;
  }, [category, subject, description, priority, relatedTo, relatedRecord]);

  const handleResetForm = () => {
    setCategory('');
    setSubject('');
    setDescription('');
    setRelatedTo('None');
    setRelatedRecord('');
    setPriority('Medium');
    setContactPreference('In-App Response');
    setAttachments([]);
    setIsSubmitting(false);
    setSubmittedTicket(null);
    setValidationError('');
    setFileError('');
  };

  const handleClose = () => {
    handleResetForm();
    onClose && onClose();
  };

  const handleSelectRelatedTo = (opt) => {
    setRelatedTo(opt);
    setRelatedRecord('');
    setPickerType(null);
  };

  // Attachments Handler
  const handleAddSampleAttachment = () => {
    setFileError('');
    if (attachments.length >= 3) {
      setFileError('Maximum 3 attachments allowed.');
      return;
    }

    const sampleFiles = [
      { name: 'payment_screenshot_invoice_204.png', size: '1.4 MB', type: 'image', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=60' },
      { name: 'order_discrepancy_note.pdf', size: '420 KB', type: 'pdf', url: null },
      { name: 'fssai_license_copy.jpg', size: '2.1 MB', type: 'image', url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=60' }
    ];

    const nextFile = sampleFiles[attachments.length % sampleFiles.length];
    setAttachments(prev => [...prev, { ...nextFile, id: Date.now().toString() }]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => prev.filter(item => item.id !== id));
    setFileError('');
  };

  const handleReplaceAttachment = (id) => {
    setAttachments(prev => prev.map(item => {
      if (item.id === id) {
        return {
          id: id,
          name: 'updated_attachment_doc.pdf',
          size: '890 KB',
          type: 'pdf',
          url: null
        };
      }
      return item;
    }));
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      setValidationError('Please complete all required fields (*)');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `SUP-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: generatedId,
        category,
        subject: subject.trim(),
        description: description.trim(),
        relatedTo,
        relatedRecord: relatedTo !== 'None' ? relatedRecord : null,
        priority,
        contactPreference,
        attachmentsCount: attachments.length,
        status: 'Open',
        createdAt: 'Just now',
        lastUpdated: 'Just now • Submitted'
      };

      setIsSubmitting(false);
      setSubmittedTicket(newTicket);
      onSubmitSuccess && onSubmitSuccess(newTicket);
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close Modal"
          >
            <X size={22} color={COLORS.primaryText} />
          </TouchableOpacity>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Submit Support Ticket</Text>
            <Text style={styles.headerSubtitle}>Tell us what happened and we’ll help you resolve it.</Text>
          </View>
        </View>

        {/* SUCCESS STATE */}
        {submittedTicket ? (
          <View style={styles.successContainer}>
            <View style={styles.successCard}>
              <View style={styles.successIconCircle}>
                <CircleCheck size={44} color={COLORS.success} />
              </View>
              <Text style={styles.successTitle}>Ticket Submitted Successfully</Text>
              <Text style={styles.successDesc}>Your support request has been received and queued for review.</Text>

              <View style={styles.ticketSummaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ticket ID</Text>
                  <Text style={styles.summaryValBold}>{submittedTicket.id}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category</Text>
                  <Text style={styles.summaryVal}>{submittedTicket.category}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Priority</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: submittedTicket.priority === 'Urgent' ? '#FEE2E2' : '#FEF3C7' }]}>
                    <Text style={[styles.priorityBadgeText, { color: submittedTicket.priority === 'Urgent' ? COLORS.error : '#D97706' }]}>
                      {submittedTicket.priority}
                    </Text>
                  </View>
                </View>
                {submittedTicket.relatedRecord ? (
                  <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.summaryLabel}>Related Record</Text>
                    <Text style={styles.summaryVal} numberOfLines={1}>{submittedTicket.relatedRecord}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.slaBox}>
                <Clock size={16} color={COLORS.info} style={{ marginRight: 8 }} />
                <Text style={styles.slaText}>Estimated response time: <Text style={{ fontWeight: '700' }}>Within 2 to 4 hours</Text></Text>
              </View>

              <View style={styles.successActions}>
                <TouchableOpacity
                  style={styles.primaryViewBtn}
                  onPress={() => {
                    const ticketToView = submittedTicket;
                    handleClose();
                    onViewTicket && onViewTicket(ticketToView);
                  }}
                >
                  <Text style={styles.primaryViewBtnText}>View Ticket</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBackBtn} onPress={handleClose}>
                  <Text style={styles.secondaryBackBtnText}>Back to Support</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* FORM STATE */
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.formScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {validationError ? (
                <View style={styles.errorBanner}>
                  <CircleAlert size={16} color={COLORS.error} style={{ marginRight: 6 }} />
                  <Text style={styles.errorBannerText}>{validationError}</Text>
                </View>
              ) : null}

              {/* 1. Category */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Category <Text style={styles.reqAsterisk}>*</Text></Text>
                <TouchableOpacity
                  style={styles.selectBtn}
                  onPress={() => setPickerType('category')}
                  activeOpacity={0.7}
                >
                  <Text style={category ? styles.selectVal : styles.selectPlaceholder}>
                    {category || 'Select issue category'}
                  </Text>
                  <ChevronDown size={18} color={COLORS.secondaryText} />
                </TouchableOpacity>
              </View>

              {/* 2. Subject */}
              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Subject <Text style={styles.reqAsterisk}>*</Text></Text>
                  <Text style={styles.charCounter}>{subject.length}/100</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Brief summary of the issue"
                  placeholderTextColor="#94A3B8"
                  maxLength={100}
                />
              </View>

              {/* 3. Description */}
              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Description <Text style={styles.reqAsterisk}>*</Text></Text>
                  <Text style={styles.charCounter}>{description.length}/700</Text>
                </View>
                <TextInput
                  style={styles.textAreaInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Explain what happened, when it occurred and what help you need."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={5}
                  maxLength={700}
                  textAlignVertical="top"
                />
              </View>

              {/* 4. Related To */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Related To</Text>
                <TouchableOpacity
                  style={styles.selectBtn}
                  onPress={() => setPickerType('relatedTo')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectVal}>{relatedTo}</Text>
                  <ChevronDown size={18} color={COLORS.secondaryText} />
                </TouchableOpacity>
              </View>

              {/* 5. Related Record (Conditional) */}
              {relatedTo !== 'None' && (
                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>Related Record <Text style={styles.reqAsterisk}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => {
                      setRecordSearch('');
                      setPickerType('relatedRecord');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={relatedRecord ? styles.selectVal : styles.selectPlaceholder} numberOfLines={1}>
                      {relatedRecord || `Select related ${relatedTo.toLowerCase()}`}
                    </Text>
                    <ChevronDown size={18} color={COLORS.secondaryText} />
                  </TouchableOpacity>
                </View>
              )}

              {/* 6. Priority */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Priority <Text style={styles.reqAsterisk}>*</Text></Text>
                <View style={styles.priorityRow}>
                  {PRIORITIES.map(p => {
                    const isSelected = priority === p;
                    let activeBg = COLORS.navy;
                    if (p === 'Urgent') activeBg = '#DC2626';

                    return (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.priorityPill,
                          isSelected && { backgroundColor: activeBg, borderColor: activeBg }
                        ]}
                        onPress={() => setPriority(p)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.priorityPillText, isSelected && { color: '#FFFFFF', fontWeight: '700' }]}>
                          {p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {priority === 'Urgent' && (
                  <View style={styles.urgentHelperBox}>
                    <ShieldAlert size={14} color="#DC2626" style={{ marginRight: 6 }} />
                    <Text style={styles.urgentHelperText}>
                      Use only when business operations are blocked or there is a serious security/payment issue.
                    </Text>
                  </View>
                )}
              </View>

              {/* 7. Attachments */}
              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Attachments</Text>
                  <Text style={styles.helperLabel}>Optional (Max 3 files)</Text>
                </View>
                <Text style={styles.attachSubtext}>Upload screenshots, images or PDFs.</Text>

                {attachments.map((file) => (
                  <View key={file.id} style={styles.fileCard}>
                    <View style={styles.fileIconBox}>
                      {file.type === 'image' ? (
                        <ImageIcon size={18} color={COLORS.info} />
                      ) : (
                        <FileText size={18} color={COLORS.warning} />
                      )}
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                      <Text style={styles.fileSize}>{file.size}</Text>
                    </View>
                    <TouchableOpacity style={styles.fileActionBtn} onPress={() => handleReplaceAttachment(file.id)}>
                      <RefreshCw size={14} color={COLORS.secondaryText} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fileActionBtn} onPress={() => handleRemoveAttachment(file.id)}>
                      <Trash2 size={14} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                ))}

                {attachments.length < 3 && (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={handleAddSampleAttachment}
                    activeOpacity={0.7}
                  >
                    <Paperclip size={18} color={COLORS.navy} style={{ marginRight: 8 }} />
                    <Text style={styles.uploadBoxText}>Attach Screenshots or Documents</Text>
                  </TouchableOpacity>
                )}

                {fileError ? <Text style={styles.fileErrorText}>{fileError}</Text> : null}
              </View>

              {/* 8. Contact Preference */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Preferred Contact Method</Text>
                <View style={styles.contactPrefRow}>
                  {['In-App Response', 'Email'].map(method => {
                    const isSelected = contactPreference === method;
                    return (
                      <TouchableOpacity
                        key={method}
                        style={[styles.prefBtn, isSelected && styles.prefBtnActive]}
                        onPress={() => setContactPreference(method)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.prefBtnText, isSelected && styles.prefBtnTextActive]}>
                          {method}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* STICKY BOTTOM ACTION BAR */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!isFormValid || isSubmitting) && styles.submitBtnDisabled
                ]}
                disabled={!isFormValid || isSubmitting}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Send size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.submitBtnText}>SUBMIT TICKET</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* SELECTOR PICKER MODAL SHEET */}
        <Modal
          visible={Boolean(pickerType)}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerType(null)}
        >
          <TouchableOpacity
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setPickerType(null)}
          >
            <TouchableOpacity style={styles.pickerCard} activeOpacity={1}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>
                  {pickerType === 'category' ? 'Select Category' : pickerType === 'relatedTo' ? 'Select Entity Type' : `Select ${relatedTo}`}
                </Text>
                <TouchableOpacity onPress={() => setPickerType(null)}>
                  <X size={20} color={COLORS.secondaryText} />
                </TouchableOpacity>
              </View>

              {pickerType === 'relatedRecord' && (
                <View style={styles.searchBox}>
                  <Search size={16} color={COLORS.secondaryText} style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.searchInput}
                    value={recordSearch}
                    onChangeText={setRecordSearch}
                    placeholder="Search records..."
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              )}

              <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                {pickerType === 'category' && CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.pickerItem}
                    onPress={() => { setCategory(cat); setPickerType(null); }}
                  >
                    <Text style={[styles.pickerItemText, category === cat && { fontWeight: '700', color: COLORS.navy }]}>{cat}</Text>
                    {category === cat && <Check size={16} color={COLORS.navy} />}
                  </TouchableOpacity>
                ))}

                {pickerType === 'relatedTo' && RELATED_TO_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.pickerItem}
                    onPress={() => handleSelectRelatedTo(opt)}
                  >
                    <Text style={[styles.pickerItemText, relatedTo === opt && { fontWeight: '700', color: COLORS.navy }]}>{opt}</Text>
                    {relatedTo === opt && <Check size={16} color={COLORS.navy} />}
                  </TouchableOpacity>
                ))}

                {pickerType === 'relatedRecord' && (
                  availableRecords.length > 0 ? (
                    availableRecords.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.pickerItem}
                        onPress={() => { setRelatedRecord(item.title); setPickerType(null); }}
                      >
                        <Text style={[styles.pickerItemText, relatedRecord === item.title && { fontWeight: '700', color: COLORS.navy }]} numberOfLines={1}>{item.title}</Text>
                        {relatedRecord === item.title && <Check size={16} color={COLORS.navy} />}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <TouchableOpacity
                      style={styles.pickerItem}
                      onPress={() => {
                        setRelatedRecord(recordSearch.trim() || `General ${relatedTo}`);
                        setPickerType(null);
                      }}
                    >
                      <Text style={[styles.pickerItemText, { color: COLORS.navy, fontWeight: '700' }]}>
                        {recordSearch.trim() ? `Use "${recordSearch.trim()}"` : `General ${relatedTo}`}
                      </Text>
                      <Check size={16} color={COLORS.navy} />
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.card },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginRight: 12
  },
  headerTitleBlock: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primaryText },
  headerSubtitle: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },

  formScroll: { flex: 1, backgroundColor: COLORS.background },
  formScrollContent: { padding: 16 },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14
  },
  errorBannerText: { fontSize: 12, color: COLORS.error, fontWeight: '600' },

  fieldBlock: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.primaryText, marginBottom: 6 },
  reqAsterisk: { color: COLORS.error },
  charCounter: { fontSize: 11, color: COLORS.secondaryText },
  helperLabel: { fontSize: 11, color: COLORS.secondaryText },

  selectBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
  },
  selectVal: { fontSize: 14, color: COLORS.primaryText, fontWeight: '600', flex: 1 },
  selectPlaceholder: { fontSize: 14, color: '#94A3B8', flex: 1 },

  textInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.primaryText,
  },
  textAreaInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 110,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.primaryText,
  },

  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityPill: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityPillText: { fontSize: 13, color: COLORS.primaryText, fontWeight: '600' },

  urgentHelperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 8
  },
  urgentHelperText: { fontSize: 11, color: '#DC2626', flex: 1, lineHeight: 15 },

  attachSubtext: { fontSize: 11, color: COLORS.secondaryText, marginBottom: 8 },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16
  },
  uploadBoxText: { fontSize: 13, color: COLORS.navy, fontWeight: '700' },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8
  },
  fileIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 12, fontWeight: '700', color: COLORS.primaryText },
  fileSize: { fontSize: 10, color: COLORS.secondaryText, marginTop: 1 },
  fileActionBtn: { padding: 6, marginLeft: 4 },
  fileErrorText: { fontSize: 11, color: COLORS.error, marginTop: 4 },

  contactPrefRow: { flexDirection: 'row', gap: 10 },
  prefBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  prefBtnActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy
  },
  prefBtnText: { fontSize: 13, color: COLORS.secondaryText, fontWeight: '600' },
  prefBtnTextActive: { color: '#FFFFFF', fontWeight: '700' },

  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.navy,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  /* SUCCESS STATE STYLES */
  successContainer: { flex: 1, backgroundColor: COLORS.background, padding: 20, justifyContent: 'center' },
  successCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  successTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primaryText, marginBottom: 6, textAlign: 'center' },
  successDesc: { fontSize: 13, color: COLORS.secondaryText, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  ticketSummaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  summaryLabel: { fontSize: 12, color: COLORS.secondaryText },
  summaryVal: { fontSize: 12, fontWeight: '600', color: COLORS.primaryText },
  summaryValBold: { fontSize: 14, fontWeight: '800', color: COLORS.navy },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityBadgeText: { fontSize: 11, fontWeight: '700' },
  slaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%'
  },
  slaText: { fontSize: 12, color: COLORS.primaryText },
  successActions: { width: '100%', gap: 10 },
  primaryViewBtn: {
    backgroundColor: COLORS.navy,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryViewBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryBackBtn: {
    backgroundColor: COLORS.background,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  secondaryBackBtnText: { color: COLORS.primaryText, fontSize: 14, fontWeight: '700' },

  /* PICKER SHEET */
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.4)',
    justifyContent: 'flex-end'
  },
  pickerCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: 450
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 10
  },
  pickerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primaryText },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.primaryText },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  pickerItemText: { fontSize: 14, color: COLORS.primaryText }
});
