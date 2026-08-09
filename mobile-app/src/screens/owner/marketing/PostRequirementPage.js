import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  useWindowDimensions,
  Modal,
  Pressable,
  ActivityIndicator
} from 'react-native';
import {
  X,
  ChevronDown,
  Calendar,
  FileText,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { createRequirementApi } from '../../../services/api.service';

// Design Tokens
const NAVY = '#0B2246';
const SECONDARY_NAVY = '#102A4C';
const GOLD = '#F2C230';
const BG_PAGE = '#F5F7FA';
const CARD_BG = '#FFFFFF';
const INPUT_BG = '#F7F9FC';
const BORDER = '#E3E9F1';
const TEXT_PRIMARY = '#091B3A';
const TEXT_SECONDARY = '#71829B';
const SUCCESS = '#16B77A';
const WARNING = '#F59E0B';
const ERROR = '#EF4444';

const ONLINE_SERVICES = [
  'Social Media Marketing',
  'SEO',
  'Performance Marketing',
  'Content Creation',
  'Graphic Design',
  'Branding',
  'Website Development',
  'Photography / Videography'
];

const OFFLINE_SERVICES = [
  'Print Advertising',
  'Outdoor Advertising',
  'Event Promotion',
  'Local Branding',
  'Newspaper Advertising',
  'Radio Promotion',
  'Promotional Material Design',
  'Influencer / Celebrity Appearance'
];

const DURATION_OPTIONS = [
  'One-time',
  '1 Week',
  '2 Weeks',
  '1 Month',
  '2 Months',
  '3 Months',
  'Custom'
];

const PRIORITY_OPTIONS = ['Normal', 'High', 'Urgent'];

export default function PostRequirementPage({ onBack, onSuccess, visible = true }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallScreen = width < 360;

  const { user } = useContext(AuthContext);
  const ownerId = user?.id;

  // Form Fields State
  const [marketingType, setMarketingType] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [requirementTitle, setRequirementTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [customDuration, setCustomDuration] = useState('');

  // Default Start Date = Today + 7 days
  const [startDate, setStartDate] = useState(() => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 7);
    return tmr.toISOString().split('T')[0];
  });

  // Default Deadline = Today + 3 days
  const [proposalDeadline, setProposalDeadline] = useState(() => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 3);
    return tmr.toISOString().split('T')[0];
  });

  const [targetAudience, setTargetAudience] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [attachedFile, setAttachedFile] = useState(null);

  // Validation & Modal states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dropdown & Picker Visibility
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [servicePickerVisible, setServicePickerVisible] = useState(false);
  const [durationPickerVisible, setDurationPickerVisible] = useState(false);
  const [priorityPickerVisible, setPriorityPickerVisible] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null); // 'startDate' | 'proposalDeadline' | null

  // Date Calendar Month/Year state
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Handle Marketing Type Selection
  const handleSelectMarketingType = (type) => {
    setMarketingType(type);
    setServiceCategory(''); // Clear selected Service Category when Marketing Type changes
    if (errors.marketingType) setErrors(prev => ({ ...prev, marketingType: null }));
    if (errors.serviceCategory) setErrors(prev => ({ ...prev, serviceCategory: null }));
    setTypePickerVisible(false);
  };

  // Form Validation
  const validateForm = () => {
    const errs = {};

    if (!marketingType) errs.marketingType = 'Marketing type is required';
    if (!serviceCategory) errs.serviceCategory = 'Service category is required';

    if (!requirementTitle.trim()) {
      errs.requirementTitle = 'Requirement title is required';
    } else if (requirementTitle.length > 80) {
      errs.requirementTitle = 'Title must be 80 characters or less';
    }

    if (!description.trim()) {
      errs.description = 'Requirement description is required';
    } else if (description.length > 500) {
      errs.description = 'Description must be 500 characters or less';
    }

    const minB = parseInt(minBudget, 10);
    const maxB = parseInt(maxBudget, 10);

    if (!minBudget.trim() || isNaN(minB) || minB <= 0) {
      errs.minBudget = 'Enter valid min budget';
    }
    if (!maxBudget.trim() || isNaN(maxB) || maxB <= 0) {
      errs.maxBudget = 'Enter valid max budget';
    } else if (minB && maxB && maxB < minB) {
      errs.maxBudget = 'Max budget cannot be lower than min budget';
    }

    if (!duration) {
      errs.duration = 'Expected duration is required';
    } else if (duration === 'Custom' && !customDuration.trim()) {
      errs.customDuration = 'Please specify custom duration';
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (!startDate) {
      errs.startDate = 'Start date is required';
    } else if (startDate < todayStr) {
      errs.startDate = 'Past dates are not selectable';
    }

    if (!proposalDeadline) {
      errs.proposalDeadline = 'Proposal deadline is required';
    } else if (proposalDeadline < todayStr) {
      errs.proposalDeadline = 'Deadline cannot be in the past';
    } else if (startDate && proposalDeadline >= startDate) {
      errs.proposalDeadline = 'Deadline must be before preferred start date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Check overall form validity for enabling submit button
  const todayStr = new Date().toISOString().split('T')[0];
  const isFormValid = Boolean(
    marketingType &&
    serviceCategory &&
    requirementTitle.trim() &&
    requirementTitle.length <= 80 &&
    description.trim() &&
    description.length <= 500 &&
    minBudget.trim() &&
    maxBudget.trim() &&
    parseInt(maxBudget, 10) >= parseInt(minBudget, 10) &&
    duration &&
    (duration !== 'Custom' || customDuration.trim()) &&
    startDate &&
    startDate >= todayStr &&
    proposalDeadline &&
    proposalDeadline >= todayStr &&
    proposalDeadline < startDate
  );

  const handlePostClick = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  // File Picker Handler
  const handlePickFile = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          setAttachedFile({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          });
        }
      };
      input.click();
    } else {
      setAttachedFile({
        name: 'Campaign_Brief_Reference.pdf',
        size: '1.2 MB'
      });
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  // Final Submit Handler
  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      const minBFormatted = Number(minBudget).toLocaleString('en-IN');
      const maxBFormatted = Number(maxBudget).toLocaleString('en-IN');

      const createdRequirement = await createRequirementApi({
        ownerId,
        type: 'marketing',
        requestType: 'public',
        title: requirementTitle.trim(),
        description: description.trim(),
        budget: `₹${minBFormatted} - ₹${maxBFormatted}`,
        location: targetAudience.trim() || 'Not Specified',
        extraData: {
          marketingType,
          serviceCategory,
          duration: duration === 'Custom' ? customDuration : duration,
          startDate,
          proposalDeadline,
          priority,
          targetAudience,
          attachmentName: attachedFile ? attachedFile.name : null
        }
      });

      setShowConfirmModal(false);
      setToastMessage('Requirement posted successfully.');

      setTimeout(() => {
        setToastMessage(null);
        if (onSuccess) onSuccess(createdRequirement);
        if (onBack) onBack();
      }, 1500);

    } catch (err) {
      console.error('Failed to post marketing requirement:', err);
      setErrors({ form: 'Failed to post requirement. Please check network and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Service list based on selected Marketing Type
  const currentServiceOptions = marketingType === 'Online Marketing'
    ? ONLINE_SERVICES
    : marketingType === 'Offline Marketing'
      ? OFFLINE_SERVICES
      : [];

  // Helper Calendar Generator
  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthName = calendarDate.toLocaleString('default', { month: 'long' });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const todayString = new Date().toISOString().split('T')[0];

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      let isPast = dateStr < todayString;
      if (datePickerField === 'proposalDeadline' && startDate) {
        if (dateStr >= startDate) isPast = true;
      }

      const isSelected = datePickerField === 'startDate'
        ? dateStr === startDate
        : dateStr === proposalDeadline;

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          disabled={isPast}
          style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelected,
            isPast && styles.calendarDayDisabled
          ]}
          onPress={() => {
            if (datePickerField === 'startDate') {
              setStartDate(dateStr);
              if (proposalDeadline >= dateStr) {
                // Adjust deadline to stay before start date if invalid
                const prevDate = new Date(dateStr);
                prevDate.setDate(prevDate.getDate() - 1);
                setProposalDeadline(prevDate.toISOString().split('T')[0]);
              }
              if (errors.startDate) setErrors(prev => ({ ...prev, startDate: null }));
            } else if (datePickerField === 'proposalDeadline') {
              setProposalDeadline(dateStr);
              if (errors.proposalDeadline) setErrors(prev => ({ ...prev, proposalDeadline: null }));
            }
            setDatePickerField(null);
          }}
        >
          <Text style={[
            styles.calendarDayText,
            isSelected && styles.calendarDayTextSelected,
            isPast && styles.calendarDayTextDisabled
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        {/* Calendar Nav */}
        <View style={styles.calendarHeaderRow}>
          <TouchableOpacity
            onPress={() => setCalendarDate(new Date(year, month - 1, 1))}
            style={styles.calNavBtn}
          >
            <ChevronLeft size={18} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.calendarTitleText}>{monthName} {year}</Text>
          <TouchableOpacity
            onPress={() => setCalendarDate(new Date(year, month + 1, 1))}
            style={styles.calNavBtn}
          >
            <ChevronRight size={18} color={TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Days Header */}
        <View style={styles.calendarDaysHeader}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <Text key={i} style={styles.calendarDayHeaderLabel}>{d}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onBack}
    >
      <View style={styles.backdrop}>
        <View style={[
          styles.popupCard,
          isMobile ? styles.popupCardMobile : styles.popupCardWeb
        ]}>

          {/* Toast Banner */}
          {toastMessage && (
            <View style={styles.toastBanner}>
              <Check size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}

          {/* POPUP HEADER */}
          <View style={styles.popupHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Post Requirement</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                Broadcast your requirement to verified marketing agencies.
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          {/* SINGLE SCROLLABLE FORM AREA */}
          <ScrollView
            style={styles.formScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formScrollContent}
          >

            {/* 1. MARKETING TYPE DROPDOWN */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Marketing Type *</Text>
              <TouchableOpacity
                style={[styles.dropdownTrigger, errors.marketingType && styles.inputErrorBorder]}
                onPress={() => setTypePickerVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={marketingType ? styles.inputText : styles.placeholderText}>
                  {marketingType || 'Select marketing type'}
                </Text>
                <ChevronDown size={18} color={TEXT_SECONDARY} />
              </TouchableOpacity>
              {errors.marketingType && <Text style={styles.errorInlineText}>{errors.marketingType}</Text>}
            </View>

            {/* 2. SERVICE CATEGORY DROPDOWN */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Service Category *</Text>
              <TouchableOpacity
                style={[
                  styles.dropdownTrigger,
                  !marketingType && styles.dropdownDisabled,
                  errors.serviceCategory && styles.inputErrorBorder
                ]}
                disabled={!marketingType}
                onPress={() => setServicePickerVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={serviceCategory ? styles.inputText : styles.placeholderText}>
                  {serviceCategory || (marketingType ? 'Select service category' : 'Select marketing type first')}
                </Text>
                <ChevronDown size={18} color={TEXT_SECONDARY} />
              </TouchableOpacity>
              {errors.serviceCategory && <Text style={styles.errorInlineText}>{errors.serviceCategory}</Text>}
            </View>

            {/* 3. REQUIREMENT TITLE */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Requirement Title *</Text>
              <TextInput
                style={[styles.textInput, errors.requirementTitle && styles.inputErrorBorder]}
                placeholder="Example: Summer Social Media Campaign"
                placeholderTextColor={TEXT_SECONDARY}
                value={requirementTitle}
                maxLength={80}
                onChangeText={(text) => {
                  setRequirementTitle(text);
                  if (errors.requirementTitle) setErrors(prev => ({ ...prev, requirementTitle: null }));
                }}
              />
              {errors.requirementTitle && <Text style={styles.errorInlineText}>{errors.requirementTitle}</Text>}
            </View>

            {/* 4. REQUIREMENT DESCRIPTION */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelWithCounter}>
                <Text style={styles.fieldLabel}>Requirement Description *</Text>
                <Text style={styles.charCounter}>{description.length}/500</Text>
              </View>
              <TextInput
                style={[styles.multilineInput, errors.description && styles.inputErrorBorder]}
                placeholder="Briefly explain your marketing objective, expected deliverables and important preferences."
                placeholderTextColor={TEXT_SECONDARY}
                multiline
                numberOfLines={4}
                maxLength={500}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                }}
              />
              {errors.description && <Text style={styles.errorInlineText}>{errors.description}</Text>}
            </View>

            {/* 5. BUDGET RANGE (PAIRED INPUTS) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Budget Range *</Text>
              <View style={[styles.pairedRow, isSmallScreen && styles.pairedRowStacked]}>
                <View style={styles.pairedCol}>
                  <View style={[styles.budgetInputBox, errors.minBudget && styles.inputErrorBorder]}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.budgetInput}
                      placeholder="Minimum Budget"
                      placeholderTextColor={TEXT_SECONDARY}
                      keyboardType="numeric"
                      value={minBudget}
                      onChangeText={(text) => {
                        setMinBudget(text.replace(/[^0-9]/g, ''));
                        if (errors.minBudget) setErrors(prev => ({ ...prev, minBudget: null }));
                      }}
                    />
                  </View>
                  {errors.minBudget && <Text style={styles.errorInlineText}>{errors.minBudget}</Text>}
                </View>

                <View style={styles.pairedCol}>
                  <View style={[styles.budgetInputBox, errors.maxBudget && styles.inputErrorBorder]}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.budgetInput}
                      placeholder="Maximum Budget"
                      placeholderTextColor={TEXT_SECONDARY}
                      keyboardType="numeric"
                      value={maxBudget}
                      onChangeText={(text) => {
                        setMaxBudget(text.replace(/[^0-9]/g, ''));
                        if (errors.maxBudget) setErrors(prev => ({ ...prev, maxBudget: null }));
                      }}
                    />
                  </View>
                  {errors.maxBudget && <Text style={styles.errorInlineText}>{errors.maxBudget}</Text>}
                </View>
              </View>
            </View>

            {/* 6. EXPECTED DURATION & 7. PREFERRED START DATE (PAIRED ROW) */}
            <View style={styles.fieldGroup}>
              <View style={[styles.pairedRow, isSmallScreen && styles.pairedRowStacked]}>

                {/* 6. Expected Duration Dropdown */}
                <View style={styles.pairedCol}>
                  <Text style={styles.fieldLabel}>Expected Duration *</Text>
                  <TouchableOpacity
                    style={[styles.dropdownTrigger, errors.duration && styles.inputErrorBorder]}
                    onPress={() => setDurationPickerVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={duration ? styles.inputText : styles.placeholderText}>
                      {duration || 'Select duration'}
                    </Text>
                    <ChevronDown size={18} color={TEXT_SECONDARY} />
                  </TouchableOpacity>
                  {errors.duration && <Text style={styles.errorInlineText}>{errors.duration}</Text>}
                </View>

                {/* 7. Preferred Start Date Picker */}
                <View style={styles.pairedCol}>
                  <Text style={styles.fieldLabel}>Preferred Start Date *</Text>
                  <TouchableOpacity
                    style={[styles.dropdownTrigger, errors.startDate && styles.inputErrorBorder]}
                    onPress={() => setDatePickerField('startDate')}
                    activeOpacity={0.8}
                  >
                    <Calendar size={18} color={TEXT_SECONDARY} style={{ marginRight: 8 }} />
                    <Text style={startDate ? styles.inputText : styles.placeholderText}>
                      {startDate || 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                  {errors.startDate && <Text style={styles.errorInlineText}>{errors.startDate}</Text>}
                </View>

              </View>

              {/* Custom Duration Input if selected */}
              {duration === 'Custom' && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.fieldLabel}>Custom Duration *</Text>
                  <TextInput
                    style={[styles.textInput, errors.customDuration && styles.inputErrorBorder]}
                    placeholder="Example: 45 Days"
                    placeholderTextColor={TEXT_SECONDARY}
                    value={customDuration}
                    onChangeText={(text) => {
                      setCustomDuration(text);
                      if (errors.customDuration) setErrors(prev => ({ ...prev, customDuration: null }));
                    }}
                  />
                  {errors.customDuration && <Text style={styles.errorInlineText}>{errors.customDuration}</Text>}
                </View>
              )}
            </View>

            {/* 8. PROPOSAL DEADLINE & 10. PRIORITY (PAIRED ROW) */}
            <View style={styles.fieldGroup}>
              <View style={[styles.pairedRow, isSmallScreen && styles.pairedRowStacked]}>

                {/* 8. Proposal Deadline Date Picker */}
                <View style={styles.pairedCol}>
                  <Text style={styles.fieldLabel}>Proposal Deadline *</Text>
                  <TouchableOpacity
                    style={[styles.dropdownTrigger, errors.proposalDeadline && styles.inputErrorBorder]}
                    onPress={() => setDatePickerField('proposalDeadline')}
                    activeOpacity={0.8}
                  >
                    <Calendar size={18} color={TEXT_SECONDARY} style={{ marginRight: 8 }} />
                    <Text style={proposalDeadline ? styles.inputText : styles.placeholderText}>
                      {proposalDeadline || 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.helperText}>Agencies can submit proposals until this date.</Text>
                  {errors.proposalDeadline && <Text style={styles.errorInlineText}>{errors.proposalDeadline}</Text>}
                </View>

                {/* 10. Priority Dropdown */}
                <View style={styles.pairedCol}>
                  <Text style={styles.fieldLabel}>Priority</Text>
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setPriorityPickerVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.inputText}>{priority}</Text>
                    <ChevronDown size={18} color={TEXT_SECONDARY} />
                  </TouchableOpacity>
                </View>

              </View>
            </View>

            {/* 9. TARGET LOCATION / AUDIENCE */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Target Location / Audience</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Example: Jalgaon city, families and college students"
                placeholderTextColor={TEXT_SECONDARY}
                value={targetAudience}
                onChangeText={setTargetAudience}
              />
            </View>

            {/* 11. REFERENCE ATTACHMENT */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Reference Attachment</Text>
              <Text style={styles.helperText}>Optional — upload a campaign brief, image or PDF reference.</Text>

              {attachedFile ? (
                <View style={styles.attachedCard}>
                  <View style={styles.fileIconBox}>
                    <FileText size={18} color={NAVY} />
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.fileNameText} numberOfLines={1}>{attachedFile.name}</Text>
                    <Text style={styles.fileSizeText}>{attachedFile.size}</Text>
                  </View>
                  <TouchableOpacity style={styles.replaceFileBtn} onPress={handlePickFile}>
                    <Text style={styles.replaceFileText}>Replace</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeFileBtn} onPress={handleRemoveFile}>
                    <X size={16} color={ERROR} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadArea} onPress={handlePickFile} activeOpacity={0.7}>
                  <Upload size={18} color={NAVY} style={{ marginBottom: 4 }} />
                  <Text style={styles.uploadAreaTitle}>Upload Attachment</Text>
                  <Text style={styles.uploadAreaSub}>Campaign brief, image or PDF</Text>
                </TouchableOpacity>
              )}
            </View>

            {errors.form && (
              <View style={styles.formErrorBox}>
                <AlertCircle size={16} color={ERROR} style={{ marginRight: 6 }} />
                <Text style={styles.formErrorText}>{errors.form}</Text>
              </View>
            )}

          </ScrollView>

          {/* STICKY FOOTER ACTIONS */}
          <View style={styles.stickyFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onBack}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendBtn,
                !isFormValid && styles.sendBtnDisabled
              ]}
              onPress={handlePostClick}
              disabled={!isFormValid}
            >
              <Text style={styles.sendBtnText}>Post Requirement</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* ================= DROPDOWN MODALS ================= */}

      {/* 1. Marketing Type Dropdown Modal */}
      <Modal visible={typePickerVisible} transparent animationType="fade" onRequestClose={() => setTypePickerVisible(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setTypePickerVisible(false)}>
          <View style={styles.pickerMenu}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>Select Marketing Type</Text>
              <TouchableOpacity onPress={() => setTypePickerVisible(false)}>
                <X size={18} color={TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            {['Online Marketing', 'Offline Marketing'].map((type) => {
              const isSelected = marketingType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                  onPress={() => handleSelectMarketingType(type)}
                >
                  <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                    {type}
                  </Text>
                  {isSelected && <Check size={18} color={NAVY} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* 2. Service Category Dropdown Modal */}
      <Modal visible={servicePickerVisible} transparent animationType="fade" onRequestClose={() => setServicePickerVisible(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setServicePickerVisible(false)}>
          <View style={styles.pickerMenu}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>Select Service Category ({marketingType})</Text>
              <TouchableOpacity onPress={() => setServicePickerVisible(false)}>
                <X size={18} color={TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 320 }}>
              {currentServiceOptions.map((srv) => {
                const isSelected = serviceCategory === srv;
                return (
                  <TouchableOpacity
                    key={srv}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => {
                      setServiceCategory(srv);
                      if (errors.serviceCategory) setErrors(prev => ({ ...prev, serviceCategory: null }));
                      setServicePickerVisible(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                      {srv}
                    </Text>
                    {isSelected && <Check size={18} color={NAVY} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* 3. Duration Dropdown Modal */}
      <Modal visible={durationPickerVisible} transparent animationType="fade" onRequestClose={() => setDurationPickerVisible(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setDurationPickerVisible(false)}>
          <View style={styles.pickerMenu}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>Select Expected Duration</Text>
              <TouchableOpacity onPress={() => setDurationPickerVisible(false)}>
                <X size={18} color={TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = duration === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => {
                      setDuration(opt);
                      if (errors.duration) setErrors(prev => ({ ...prev, duration: null }));
                      setDurationPickerVisible(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                      {opt}
                    </Text>
                    {isSelected && <Check size={18} color={NAVY} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* 4. Priority Dropdown Modal */}
      <Modal visible={priorityPickerVisible} transparent animationType="fade" onRequestClose={() => setPriorityPickerVisible(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setPriorityPickerVisible(false)}>
          <View style={styles.pickerMenu}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>Select Priority</Text>
              <TouchableOpacity onPress={() => setPriorityPickerVisible(false)}>
                <X size={18} color={TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            {PRIORITY_OPTIONS.map((opt) => {
              const isSelected = priority === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                  onPress={() => {
                    setPriority(opt);
                    setPriorityPickerVisible(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                    {opt}
                  </Text>
                  {isSelected && <Check size={18} color={NAVY} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* 5. Date Calendar Modal */}
      <Modal visible={Boolean(datePickerField)} transparent animationType="fade" onRequestClose={() => setDatePickerField(null)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setDatePickerField(null)}>
          <View style={styles.pickerMenu}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>
                {datePickerField === 'startDate' ? 'Select Preferred Start Date' : 'Select Proposal Deadline'}
              </Text>
              <TouchableOpacity onPress={() => setDatePickerField(null)}>
                <X size={18} color={TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            {renderCalendar()}
          </View>
        </Pressable>
      </Modal>

      {/* ================= CONFIRMATION MODAL ================= */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Post this requirement?</Text>
            <Text style={styles.confirmSub}>Review requirement broadcast details before posting.</Text>

            <View style={styles.confirmSummaryBox}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Marketing Type</Text>
                <Text style={styles.confirmVal}>{marketingType}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Service Category</Text>
                <Text style={styles.confirmVal}>{serviceCategory}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Budget Range</Text>
                <Text style={[styles.confirmVal, { color: SUCCESS, fontWeight: '700' }]}>
                  ₹{Number(minBudget).toLocaleString('en-IN')} - ₹{Number(maxBudget).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Preferred Start Date</Text>
                <Text style={styles.confirmVal}>{startDate}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Proposal Deadline</Text>
                <Text style={styles.confirmVal}>{proposalDeadline}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Audience</Text>
                <Text style={styles.confirmVal}>Verified matching marketing agencies</Text>
              </View>
            </View>

            <Text style={styles.confirmBroadcastNotice}>
              This requirement will appear in the Feed Wall of eligible verified agencies.
            </Text>

            <View style={styles.confirmActionsRow}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmSendBtn}
                onPress={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmSendText}>Confirm & Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  popupCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    flexDirection: 'column'
  },
  popupCardMobile: {
    width: '92%',
    maxWidth: 520,
    maxHeight: '86%'
  },
  popupCardWeb: {
    width: 640,
    maxWidth: 680,
    maxHeight: '84%'
  },

  toastBanner: {
    backgroundColor: SUCCESS,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },

  popupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginBottom: 2
  },
  headerSubtitle: {
    fontSize: 13,
    color: TEXT_SECONDARY
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: INPUT_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },

  formScrollView: {
    flex: 1
  },
  formScrollContent: {
    padding: 20,
    gap: 14
  },

  fieldGroup: {
    gap: 6
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_PRIMARY
  },
  labelWithCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  charCounter: {
    fontSize: 12,
    color: TEXT_SECONDARY
  },
  helperText: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    marginTop: 2
  },

  dropdownTrigger: {
    height: 48,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dropdownDisabled: {
    opacity: 0.6,
    backgroundColor: '#EEF2F6'
  },

  textInput: {
    height: 48,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: TEXT_PRIMARY,
    ...Platform.select({ web: { outlineStyle: 'none' } })
  },
  multilineInput: {
    height: 96,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT_PRIMARY,
    textAlignVertical: 'top',
    ...Platform.select({ web: { outlineStyle: 'none' } })
  },

  inputText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: '500'
  },
  placeholderText: {
    fontSize: 14,
    color: TEXT_SECONDARY
  },

  pairedRow: {
    flexDirection: 'row',
    gap: 12
  },
  pairedRowStacked: {
    flexDirection: 'column'
  },
  pairedCol: {
    flex: 1,
    gap: 4
  },

  budgetInputBox: {
    height: 48,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginRight: 6
  },
  budgetInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PRIMARY,
    ...Platform.select({ web: { outlineStyle: 'none' } })
  },

  uploadArea: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: BORDER,
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadAreaTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY
  },
  uploadAreaSub: {
    fontSize: 11,
    color: TEXT_SECONDARY
  },

  attachedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 10
  },
  fileIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8EEF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_PRIMARY
  },
  fileSizeText: {
    fontSize: 11,
    color: TEXT_SECONDARY
  },
  replaceFileBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    marginRight: 8
  },
  replaceFileText: {
    fontSize: 12,
    fontWeight: '600',
    color: NAVY
  },
  removeFileBtn: {
    padding: 4
  },

  inputErrorBorder: {
    borderColor: ERROR
  },
  errorInlineText: {
    fontSize: 12,
    color: ERROR,
    marginTop: 2
  },

  formErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 10,
    marginTop: 4
  },
  formErrorText: {
    fontSize: 13,
    color: ERROR,
    fontWeight: '600'
  },

  stickyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: CARD_BG,
    gap: 12
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_SECONDARY
  },
  sendBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    opacity: 0.5
  },
  sendBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },

  // Picker Overlays & Menus
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  pickerMenu: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER
  },
  pickerHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT_PRIMARY
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  pickerItemActive: {
    backgroundColor: INPUT_BG
  },
  pickerItemText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: '500'
  },
  pickerItemTextActive: {
    fontWeight: '700',
    color: NAVY
  },

  // Custom Calendar Styles
  calendarContainer: {
    paddingVertical: 8
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  calNavBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: INPUT_BG
  },
  calendarTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8
  },
  calendarDayHeaderLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SECONDARY
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  calendarDayEmpty: {
    width: `${100 / 7}%`,
    height: 36
  },
  calendarDay: {
    width: `${100 / 7}%`,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  calendarDaySelected: {
    backgroundColor: NAVY
  },
  calendarDayDisabled: {
    opacity: 0.3
  },
  calendarDayText: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontWeight: '500'
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  calendarDayTextDisabled: {
    color: TEXT_SECONDARY
  },

  // Confirmation Modal Styles
  confirmBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  confirmCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 20,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginBottom: 4
  },
  confirmSub: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginBottom: 16
  },
  confirmSummaryBox: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 12
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  confirmLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY
  },
  confirmVal: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    maxWidth: '60%',
    textAlign: 'right'
  },
  confirmBroadcastNotice: {
    fontSize: 12,
    color: SECONDARY_NAVY,
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500'
  },
  confirmActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  confirmCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER
  },
  confirmCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_SECONDARY
  },
  confirmSendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: NAVY,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmSendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
