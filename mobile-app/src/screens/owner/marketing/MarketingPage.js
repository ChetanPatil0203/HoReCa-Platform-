import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import {
  Send,
  ClipboardPlus,
  ClipboardList,
  FileText,
  Megaphone,
  ChevronRight,
  BadgeCheck,
  X
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const PURPLE = '#8B5CF6';
const ORANGE = '#EA580C';
const LIGHT_BG = '#F8FAFC';
const GRAY_TEXT = '#64748B';

// =====================================
// MOCK DATA
// =====================================

const MY_REQUIREMENTS = [
  { id: 'REQ-091', title: 'Instagram, Facebook & Content Creation', type: 'online', service: 'Social Media Marketing', mode: 'Common Requirement', status: 'Open', proposals: 12, date: '2 days ago' },
  { id: 'REQ-092', title: 'New Menu Photoshoot', type: 'offline', service: 'Photography', mode: 'Direct Request', status: 'Agency Selected', proposals: 1, date: '5 days ago' },
  { id: 'REQ-093', title: 'Website Redesign', type: 'online', service: 'Website Development', mode: 'Common Requirement', status: 'In Progress', proposals: 5, date: '1 week ago' },
  { id: 'REQ-094', title: 'Highway Hoarding Ads', type: 'offline', service: 'Branding', mode: 'Direct Request', status: 'Completed', proposals: 1, date: '2 weeks ago' },
  { id: 'REQ-095', title: 'Influencer Marketing Campaign', type: 'online', service: 'Influencer Marketing', mode: 'Common Requirement', status: 'Draft', proposals: 0, date: 'Just now' },
];

const RECENT_PROPOSALS = [
  { id: 'PRP-01', agencyName: 'BrandCraft Agency', initials: 'BC', verified: true, service: 'Social Media Marketing', reqName: 'Instagram, Facebook & Content Creation', amount: '₹45,000', duration: '2 Months', status: 'New', time: 'Received 2 hours ago', type: 'online' },
  { id: 'PRP-02', agencyName: 'Pixel Digital', initials: 'PD', verified: true, service: 'Google Ads', reqName: 'Google Ad Campaigns', amount: '₹30,000', duration: '1 Month', status: 'Under Review', time: 'Received 1 day ago', type: 'online' },
  { id: 'PRP-03', agencyName: 'Outfront Media', initials: 'OM', verified: true, service: 'Hoardings', reqName: 'Highway Hoarding Ads', amount: '₹1,20,000', duration: '3 Months', status: 'Shortlisted', time: 'Received 3 days ago', type: 'offline' },
  { id: 'PRP-04', agencyName: 'EventX', initials: 'EX', verified: true, service: 'Event Promotion', reqName: 'Diwali Mela Setup', amount: '₹80,000', duration: '1 Week', status: 'Accepted', time: 'Received 1 week ago', type: 'offline' },
];

const ONLINE_SERVICES = ['Social Media Marketing', 'Website Development', 'Influencer Marketing', 'Digital Advertising', 'Content Creation', 'Graphic Design'];

const ONLINE_AGENCIES_MOCK = [
  { id: 'AGY-O1', name: 'BrandCraft Agency', initials: 'BC', verified: true, location: 'Mumbai, Maharashtra', type: 'online' },
  { id: 'AGY-O2', name: 'Pixel Digital', initials: 'PD', verified: true, location: 'Delhi, NCR', type: 'online' },
];


// =====================================
// HELPER COMPONENTS
// =====================================

const getStatusColor = (status) => {
  switch (status) {
    case 'Draft': return '#94A3B8';
    case 'Open': case 'New': return '#3B82F6';
    case 'Proposal Received': case 'In Progress': case 'Shortlisted': return '#8B5CF6';
    case 'Agency Selected': case 'Completed': case 'Accepted': return '#10B981';
    case 'Under Review': return '#F59E0B';
    case 'Cancelled': case 'Rejected': return '#EF4444';
    default: return '#94A3B8';
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case 'Draft': return '#F1F5F9';
    case 'Open': case 'New': return '#EFF6FF';
    case 'Proposal Received': case 'In Progress': case 'Shortlisted': return '#F5F3FF';
    case 'Agency Selected': case 'Completed': case 'Accepted': return '#ECFDF5';
    case 'Under Review': return '#FFFBEB';
    case 'Cancelled': case 'Rejected': return '#FEF2F2';
    default: return '#F1F5F9';
  }
};


// =====================================
// MAIN SCREEN
// =====================================

export default function MarketingPage() {
  const { width } = useWindowDimensions();
  // Using 700px as the breakpoint for stacking elements vertically
  const isMobile = width < 700;
  const isTablet = width >= 700 && width < 1024;
  
  const [marketingType, setMarketingType] = useState('online'); // 'online' or 'offline'
  
  // Modal states
  const [directRequestVisible, setDirectRequestVisible] = useState(false);
  const [postRequirementVisible, setPostRequirementVisible] = useState(false);
  const [viewRequirementVisible, setViewRequirementVisible] = useState(false);
  const [viewProposalVisible, setViewProposalVisible] = useState(false);
  
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedProp, setSelectedProp] = useState(null);

  // Form states for modals (simplified for mockup)
  const [drStep, setDrStep] = useState(1);
  const [prStep, setPrStep] = useState(1);

  // Data filtering based on selected type
  const filteredRequirements = MY_REQUIREMENTS.filter(req => req.type === marketingType);
  const filteredProposals = RECENT_PROPOSALS.filter(prop => prop.type === marketingType);

  const displayRequirements = filteredRequirements.slice(0, isMobile ? 3 : 4);
  const displayProposals = filteredProposals.slice(0, isMobile ? 2 : 3);

  const openDirectRequest = () => { setDrStep(1); setDirectRequestVisible(true); };
  const openPostRequirement = () => { setPrStep(1); setPostRequirementVisible(true); };

  // =====================================
  // RENDER HELPERS
  // =====================================

  const renderOverviewSegment = (title, count, icon, accentColor, bgColor) => {
    const Icon = icon;
    return (
      <TouchableOpacity style={[styles.overviewSegment, isMobile && styles.overviewSegmentMobile]}>
        <View style={styles.overviewSegmentHeader}>
          <View style={[styles.overviewIconContainer, { backgroundColor: bgColor }]}>
            <Icon size={20} color={accentColor} />
          </View>
          <Text style={styles.overviewCount}>{count}</Text>
        </View>
        <Text style={styles.overviewTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const renderRequirementCard = (req) => {
    if (isMobile) {
      // Compact Mobile Card
      return (
        <View key={req.id} style={styles.reqCard}>
          <View style={styles.reqCardHeader}>
            <Text style={styles.reqId}>{req.id}</Text>
            <View style={[styles.badge, { backgroundColor: getStatusBgColor(req.status) }]}>
              <Text style={[styles.badgeText, { color: getStatusColor(req.status) }]}>{req.status}</Text>
            </View>
          </View>
          <Text style={styles.reqTitle} numberOfLines={1}>{req.title}</Text>
          <Text style={styles.reqService}>{req.service}</Text>
          
          <View style={styles.reqDetailsRow}>
            <View style={[styles.modeBadge, req.mode === 'Direct Request' ? styles.modeDirect : styles.modeFeed]}>
              <Text style={[styles.modeBadgeText, req.mode === 'Direct Request' ? styles.modeDirectText : styles.modeFeedText]}>
                {req.mode}
              </Text>
            </View>
            <Text style={styles.reqProposals}>{req.proposals} Proposals</Text>
          </View>

          <View style={styles.reqFooter}>
            <Text style={styles.reqDate}>Posted {req.date}</Text>
            <TouchableOpacity style={styles.textActionBtn} onPress={() => { setSelectedReq(req); setViewRequirementVisible(true); }}>
              <Text style={styles.textActionBtnText}>View Requirement</Text>
              <ChevronRight size={16} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Desktop/Tablet Horizontal Row
    return (
      <View key={req.id} style={styles.reqRow}>
        <View style={styles.reqRowCol1}>
          <Text style={styles.reqTitle} numberOfLines={1}>{req.title}</Text>
          <Text style={styles.reqId}>{req.id}</Text>
        </View>
        <View style={styles.reqRowCol2}>
          <Text style={styles.reqService} numberOfLines={1}>{req.service}</Text>
          <Text style={styles.reqModeText} numberOfLines={1}>{req.mode}</Text>
        </View>
        <View style={styles.reqRowCol3}>
          <View style={{alignItems: 'flex-start'}}>
            <View style={[styles.badge, { backgroundColor: getStatusBgColor(req.status) }]}>
              <Text style={[styles.badgeText, { color: getStatusColor(req.status) }]}>{req.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.reqRowCol4}>
          <Text style={styles.reqProposalsDesktop}>{req.proposals} Proposals</Text>
          <Text style={styles.reqDate}>{req.date}</Text>
        </View>
        <View style={styles.reqRowCol5}>
          <TouchableOpacity style={styles.viewRowBtn} onPress={() => { setSelectedReq(req); setViewRequirementVisible(true); }}>
            <Text style={styles.viewRowBtnText}>View</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProposalCard = (prop) => (
    <View key={prop.id} style={styles.reqCard}>
      <View style={styles.propHeader}>
        <View style={styles.propAvatar}>
          <Text style={styles.propAvatarText}>{prop.initials}</Text>
        </View>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <View style={styles.propNameRow}>
            <Text style={styles.propName} numberOfLines={1}>{prop.agencyName}</Text>
            {prop.verified && <BadgeCheck size={16} color={PURPLE} style={{ marginLeft: 4 }} />}
          </View>
          <Text style={styles.propReqName} numberOfLines={1}>{prop.reqName}</Text>
        </View>
      </View>
      
      <View style={styles.propDetailsGrid}>
        <View style={styles.propDetailItem}>
          <Text style={styles.propDetailLabel}>Amount</Text>
          <Text style={styles.propDetailValue}>{prop.amount}</Text>
        </View>
        <View style={styles.propDetailItem}>
          <Text style={styles.propDetailLabel}>Duration</Text>
          <Text style={styles.propDetailValue}>{prop.duration}</Text>
        </View>
      </View>

      <View style={styles.reqFooter}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View style={[styles.badge, { backgroundColor: getStatusBgColor(prop.status) }]}>
            <Text style={[styles.badgeText, { color: getStatusColor(prop.status) }]}>{prop.status}</Text>
          </View>
          <Text style={styles.reqDate} numberOfLines={1}>{prop.time}</Text>
        </View>
        <TouchableOpacity style={styles.textActionBtn} onPress={() => { setSelectedProp(prop); setViewProposalVisible(true); }}>
          <Text style={styles.textActionBtnText}>View Proposal</Text>
          <ChevronRight size={16} color={NAVY} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── PAGE HEADER ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={styles.pageHeaderInner}>
          <Text style={styles.pageTitle}>Marketing</Text>
          <Text style={styles.pageSubtitle}>Promote your business with verified marketing agencies</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.contentWrapper, !isMobile && styles.contentWrapperDesktop]}>
          
          {/* ── PRIMARY REQUIREMENT ACTIONS ── */}
          <View style={[styles.actionsContainer, isMobile ? styles.actionsContainerMobile : null]}>
            {/* Direct Request Card */}
            <TouchableOpacity style={styles.actionCard} onPress={openDirectRequest} activeOpacity={0.9}>
              <View style={[styles.actionCardBg, styles.actionCardBgOrange]} />
              <View style={styles.actionCardContent}>
                <View style={styles.actionCardHeaderRow}>
                  <View style={[styles.actionIconContainer, styles.actionIconOrange]}>
                    <Send size={24} color={ORANGE} />
                  </View>
                  <View style={[styles.actionBadge, styles.actionBadgeOrange]}>
                    <Text style={styles.actionBadgeTextOrange}>Quick</Text>
                  </View>
                </View>
                <Text style={styles.actionTitle}>Direct Request</Text>
                <Text style={styles.actionDesc}>Send your requirement directly to one selected marketing agency.</Text>
                <View style={styles.actionLinkRow}>
                  <Text style={[styles.actionLinkText, { color: ORANGE }]}>Send Direct Request</Text>
                  <ChevronRight size={16} color={ORANGE} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Post Requirement Card */}
            <TouchableOpacity style={styles.actionCard} onPress={openPostRequirement} activeOpacity={0.9}>
              <View style={[styles.actionCardBg, styles.actionCardBgPurple]} />
              <View style={styles.actionCardContent}>
                <View style={styles.actionCardHeaderRow}>
                  <View style={[styles.actionIconContainer, styles.actionIconPurple]}>
                    <ClipboardPlus size={24} color={PURPLE} />
                  </View>
                  <View style={[styles.actionBadge, styles.actionBadgePurple]}>
                    <Text style={styles.actionBadgeTextPurple}>Recommended</Text>
                  </View>
                </View>
                <Text style={styles.actionTitle}>Post Requirement</Text>
                <Text style={styles.actionDesc}>Post one requirement and receive proposals from eligible agencies.</Text>
                <View style={styles.actionLinkRow}>
                  <Text style={[styles.actionLinkText, { color: PURPLE }]}>Post Requirement</Text>
                  <ChevronRight size={16} color={PURPLE} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* ── MARKETING TYPE TABS ── */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabBtn, marketingType === 'online' && styles.tabBtnActive]}
              onPress={() => setMarketingType('online')}
            >
              <Text style={[styles.tabBtnText, marketingType === 'online' && styles.tabBtnTextActive]}>Online Marketing</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, marketingType === 'offline' && styles.tabBtnActive]}
              onPress={() => setMarketingType('offline')}
            >
              <Text style={[styles.tabBtnText, marketingType === 'offline' && styles.tabBtnTextActive]}>Offline Marketing</Text>
            </TouchableOpacity>
          </View>

          {/* ── MARKETING OVERVIEW ── */}
          <View style={styles.overviewContainer}>
            <View style={[styles.overviewGrid, isMobile ? styles.overviewGridMobile : null]}>
              {renderOverviewSegment('Active Requirements', 4, ClipboardList, '#3B82F6', '#EFF6FF')}
              <View style={styles.overviewDivider} />
              {renderOverviewSegment('Proposals Received', 12, FileText, '#8B5CF6', '#F5F3FF')}
              <View style={styles.overviewDivider} />
              {renderOverviewSegment('Active Campaigns', 3, Megaphone, '#10B981', '#ECFDF5')}
            </View>
          </View>

          {/* ── MAIN CONTENT LAYOUT ── */}
          <View style={[styles.mainContentGrid, isMobile ? styles.mainContentCol : null]}>
            
            {/* Left Column (Requirements) */}
            <View style={isMobile ? styles.columnMobile : styles.columnLeft}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>My Requirements</Text>
                  <Text style={styles.sectionSubtitle}>Track your direct and posted marketing requirements</Text>
                </View>
                <TouchableOpacity><Text style={styles.viewAllBtn}>View All</Text></TouchableOpacity>
              </View>
              
              <View style={styles.listContainer}>
                {displayRequirements.length > 0 ? (
                  displayRequirements.map(renderRequirementCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No active {marketingType} requirements.</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Right Column (Proposals) */}
            <View style={isMobile ? styles.columnMobile : styles.columnRight}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Recent Proposals</Text>
                  <Text style={styles.sectionSubtitle}>Latest proposals received from marketing agencies</Text>
                </View>
                <TouchableOpacity><Text style={styles.viewAllBtn}>View All</Text></TouchableOpacity>
              </View>

              <View style={styles.listContainer}>
                {displayProposals.length > 0 ? (
                  displayProposals.map(renderProposalCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No recent {marketingType} proposals.</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ── MODALS ── */}

      {/* Direct Request Modal */}
      <Modal visible={directRequestVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setDirectRequestVisible(false)}>
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Send Direct Request</Text>
            <TouchableOpacity onPress={() => setDirectRequestVisible(false)}><X size={24} color={NAVY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.modalStepText}>Step {drStep} of 5</Text>
            {drStep === 1 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Select Marketing Type</Text>
                <TouchableOpacity style={styles.optionBtn} onPress={() => setDrStep(2)}>
                  <Text style={styles.optionBtnText}>Online Marketing</Text>
                  <ChevronRight size={20} color={GRAY_TEXT} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionBtn} onPress={() => setDrStep(2)}>
                  <Text style={styles.optionBtnText}>Offline Marketing</Text>
                  <ChevronRight size={20} color={GRAY_TEXT} />
                </TouchableOpacity>
              </View>
            )}
            {drStep === 2 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Select Marketing Service</Text>
                {ONLINE_SERVICES.map((srv, idx) => (
                  <TouchableOpacity key={idx} style={styles.optionBtn} onPress={() => setDrStep(3)}>
                    <Text style={styles.optionBtnText}>{srv}</Text>
                    <ChevronRight size={20} color={GRAY_TEXT} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {drStep === 3 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Select Agency</Text>
                {ONLINE_AGENCIES_MOCK.map((ag, idx) => (
                  <TouchableOpacity key={idx} style={styles.optionBtn} onPress={() => setDrStep(4)}>
                    <View>
                      <Text style={styles.optionBtnText}>{ag.name}</Text>
                      <Text style={styles.optionSubText}>{ag.location}</Text>
                    </View>
                    <ChevronRight size={20} color={GRAY_TEXT} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {drStep === 4 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Requirement Details</Text>
                <TextInput style={styles.input} placeholder="Requirement Title" placeholderTextColor={GRAY_TEXT} />
                <TextInput style={styles.input} placeholder="Marketing Objective" placeholderTextColor={GRAY_TEXT} />
                <TextInput style={styles.input} placeholder="Budget Range" placeholderTextColor={GRAY_TEXT} />
                <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Requirement Description" multiline placeholderTextColor={GRAY_TEXT} />
                <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setDrStep(5)}>
                  <Text style={styles.primaryBtnLargeText}>Review Request</Text>
                </TouchableOpacity>
              </View>
            )}
            {drStep === 5 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Review and Send</Text>
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>Selected Agency:</Text>
                  <Text style={styles.reviewValue}>BrandCraft Agency</Text>
                  <Text style={styles.reviewLabel}>Service:</Text>
                  <Text style={styles.reviewValue}>Social Media Marketing</Text>
                </View>
                <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setDirectRequestVisible(false)}>
                  <Text style={styles.primaryBtnLargeText}>Send Direct Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Post Requirement Modal */}
      <Modal visible={postRequirementVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setPostRequirementVisible(false)}>
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Post Requirement</Text>
            <TouchableOpacity onPress={() => setPostRequirementVisible(false)}><X size={24} color={NAVY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.modalStepText}>Step {prStep} of 5</Text>
            {prStep === 1 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Select Marketing Type</Text>
                <TouchableOpacity style={styles.optionBtn} onPress={() => setPrStep(2)}>
                  <Text style={styles.optionBtnText}>Online Marketing</Text>
                  <ChevronRight size={20} color={GRAY_TEXT} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionBtn} onPress={() => setPrStep(2)}>
                  <Text style={styles.optionBtnText}>Offline Marketing</Text>
                  <ChevronRight size={20} color={GRAY_TEXT} />
                </TouchableOpacity>
              </View>
            )}
            {prStep === 2 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Select Marketing Service</Text>
                {ONLINE_SERVICES.map((srv, idx) => (
                  <TouchableOpacity key={idx} style={styles.optionBtn} onPress={() => setPrStep(3)}>
                    <Text style={styles.optionBtnText}>{srv}</Text>
                    <ChevronRight size={20} color={GRAY_TEXT} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {prStep === 3 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Requirement Details</Text>
                <TextInput style={styles.input} placeholder="Requirement Title" placeholderTextColor={GRAY_TEXT} />
                <TextInput style={styles.input} placeholder="Marketing Objective" placeholderTextColor={GRAY_TEXT} />
                <TextInput style={styles.input} placeholder="Budget Range" placeholderTextColor={GRAY_TEXT} />
                <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Requirement Description" multiline placeholderTextColor={GRAY_TEXT} />
                <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setPrStep(4)}>
                  <Text style={styles.primaryBtnLargeText}>Preview Eligibility</Text>
                </TouchableOpacity>
              </View>
            )}
            {prStep === 4 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Agency Eligibility Preview</Text>
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>This requirement will be visible to eligible verified marketing agencies.</Text>
                  <Text style={[styles.reviewValue, { color: PURPLE, marginTop: 12 }]}>Estimated matching agencies: 12</Text>
                </View>
                <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setPrStep(5)}>
                  <Text style={styles.primaryBtnLargeText}>Review and Post</Text>
                </TouchableOpacity>
              </View>
            )}
            {prStep === 5 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Review</Text>
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>Service:</Text>
                  <Text style={styles.reviewValue}>Social Media Marketing</Text>
                  <Text style={styles.reviewLabel}>Visibility:</Text>
                  <Text style={styles.reviewValue}>Marketing Agency Common Feed Wall</Text>
                </View>
                <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setPostRequirementVisible(false)}>
                  <Text style={styles.primaryBtnLargeText}>Post Requirement</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* View Requirement Modal */}
      <Modal visible={viewRequirementVisible} animationType="slide" transparent={true} onRequestClose={() => setViewRequirementVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCentered}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Requirement Details</Text>
              <TouchableOpacity onPress={() => setViewRequirementVisible(false)}><X size={24} color={NAVY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedReq && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>ID:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.id}</Text>
                  <Text style={styles.reviewLabel}>Title:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.title}</Text>
                  <Text style={styles.reviewLabel}>Service:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.service}</Text>
                  <Text style={styles.reviewLabel}>Status:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.status}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* View Proposal Modal */}
      <Modal visible={viewProposalVisible} animationType="slide" transparent={true} onRequestClose={() => setViewProposalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCentered}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Proposal Details</Text>
              <TouchableOpacity onPress={() => setViewProposalVisible(false)}><X size={24} color={NAVY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedProp && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>Agency:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.agencyName}</Text>
                  <Text style={styles.reviewLabel}>Requirement:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.reqName}</Text>
                  <Text style={styles.reviewLabel}>Amount:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.amount}</Text>
                  <Text style={styles.reviewLabel}>Duration:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.duration}</Text>
                  <View style={{ marginTop: 24, gap: 12 }}>
                    <TouchableOpacity style={[styles.primaryBtnLarge, { backgroundColor: '#10B981' }]} onPress={() => setViewProposalVisible(false)}>
                      <Text style={styles.primaryBtnLargeText}>Accept Proposal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryBtnLarge, { backgroundColor: '#EF4444' }]} onPress={() => setViewProposalVisible(false)}>
                      <Text style={styles.primaryBtnLargeText}>Reject Proposal</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  pageHeader: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderInner: { width: '100%', maxWidth: 1320, alignSelf: 'center', paddingHorizontal: 32, paddingVertical: 24 },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: GRAY_TEXT },
  
  scroll: { flex: 1, width: '100%' },
  scrollContent: { paddingBottom: 120, width: '100%', alignItems: 'center' },
  contentWrapper: { padding: 16, gap: 24, width: '100%' },
  contentWrapperDesktop: { paddingHorizontal: 32, paddingVertical: 24, maxWidth: 1320, flex: 1 },

  // Actions
  actionsContainer: { flexDirection: 'row', gap: 24, width: '100%' },
  actionsContainerMobile: { flexDirection: 'column', gap: 16 },
  actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  actionCardContent: { padding: 20 },
  actionCardBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03 },
  actionCardBgOrange: { backgroundColor: ORANGE },
  actionCardBgPurple: { backgroundColor: PURPLE },
  actionCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  actionIconContainer: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionIconOrange: { backgroundColor: '#FFF7ED' },
  actionIconPurple: { backgroundColor: '#F5F3FF' },
  actionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  actionBadgeOrange: { backgroundColor: '#FFEDD5' },
  actionBadgePurple: { backgroundColor: '#EDE9FE' },
  actionBadgeTextOrange: { color: '#C2410C', fontSize: 12, fontWeight: '700' },
  actionBadgeTextPurple: { color: '#6D28D9', fontSize: 12, fontWeight: '700' },
  actionTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 6 },
  actionDesc: { fontSize: 13, color: GRAY_TEXT, lineHeight: 18, marginBottom: 16 },
  actionLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionLinkText: { fontSize: 13, fontWeight: '700' },

  // Tabs
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: colors.border, width: '100%' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: NAVY },
  tabBtnText: { fontSize: 15, fontWeight: '700', color: GRAY_TEXT },
  tabBtnTextActive: { color: '#fff' },

  // Overview
  overviewContainer: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', width: '100%' },
  overviewGrid: { flexDirection: 'row', alignItems: 'center' },
  overviewGridMobile: { flexWrap: 'wrap' },
  overviewSegment: { flex: 1, padding: 20, alignItems: 'center' },
  overviewSegmentMobile: { minWidth: '33%', flexBasis: '33%', flexGrow: 1 },
  overviewDivider: { width: 1, height: '60%', backgroundColor: colors.border },
  overviewIconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  overviewSegmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  overviewCount: { fontSize: 24, fontWeight: '900', color: NAVY },
  overviewTitle: { fontSize: 13, color: GRAY_TEXT, fontWeight: '600', textAlign: 'center' },

  // Sections
  mainContentGrid: { flexDirection: 'row', gap: 24, width: '100%', alignItems: 'flex-start' },
  mainContentCol: { flexDirection: 'column' },
  columnLeft: { flex: 1.45, gap: 16 },
  columnRight: { flex: 0.75, minWidth: 340, gap: 16 },
  columnMobile: { width: '100%', gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  sectionSubtitle: { fontSize: 13, color: GRAY_TEXT },
  viewAllBtn: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  listContainer: { gap: 12 },
  emptyState: { padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  emptyStateText: { color: GRAY_TEXT, fontSize: 14 },

  // Request Mobile Card
  reqCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  reqCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reqId: { fontSize: 12, fontWeight: '700', color: GRAY_TEXT },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  reqTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 4 },
  reqService: { fontSize: 13, color: GRAY_TEXT, marginBottom: 12 },
  reqDetailsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  modeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  modeDirect: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  modeFeed: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
  modeDirectText: { color: '#C2410C', fontSize: 11, fontWeight: '600' },
  modeFeedText: { color: '#6D28D9', fontSize: 11, fontWeight: '600' },
  reqProposals: { fontSize: 13, fontWeight: '600', color: NAVY },
  reqFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  reqDate: { fontSize: 12, color: GRAY_TEXT },
  textActionBtn: { flexDirection: 'row', alignItems: 'center' },
  textActionBtnText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 2 },

  // Request Desktop Row
  reqRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  reqRowCol1: { flex: 2, paddingRight: 12 },
  reqRowCol2: { flex: 1.5, paddingRight: 12 },
  reqRowCol3: { flex: 1, paddingRight: 12 },
  reqRowCol4: { flex: 1, paddingRight: 12 },
  reqRowCol5: { width: 80, alignItems: 'flex-end' },
  reqModeText: { fontSize: 11, color: GRAY_TEXT, marginTop: 4, fontWeight: '600' },
  reqProposalsDesktop: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 4 },
  viewRowBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#F8FAFC', borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  viewRowBtnText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },

  // Proposal Card specific
  propHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  propAvatar: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  propAvatarText: { fontSize: 16, fontWeight: '800', color: PURPLE },
  propNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  propName: { fontSize: 15, fontWeight: '800', color: NAVY },
  propReqName: { fontSize: 12, color: GRAY_TEXT },
  propDetailsGrid: { flexDirection: 'row', gap: 16, marginBottom: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8 },
  propDetailItem: { flex: 1 },
  propDetailLabel: { fontSize: 11, color: GRAY_TEXT, marginBottom: 4 },
  propDetailValue: { fontSize: 14, fontWeight: '800', color: NAVY },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContentCentered: { width: '90%', maxWidth: 500, backgroundColor: '#fff', borderRadius: 16, maxHeight: '80%' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  modalBody: { flex: 1, padding: 20 },
  modalScrollContent: { paddingBottom: 40 },
  modalStepText: { fontSize: 12, fontWeight: '700', color: PURPLE, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
  stepContent: { gap: 16 },
  stepTitle: { fontSize: 20, fontWeight: '800', color: NAVY, marginBottom: 8 },
  optionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  optionBtnText: { fontSize: 16, fontWeight: '600', color: NAVY },
  optionSubText: { fontSize: 13, color: GRAY_TEXT, marginTop: 4 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 15, color: NAVY },
  primaryBtnLarge: { backgroundColor: NAVY, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  primaryBtnLargeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  reviewBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  reviewLabel: { fontSize: 13, color: GRAY_TEXT, marginBottom: 4 },
  reviewValue: { fontSize: 16, fontWeight: '700', color: NAVY, marginBottom: 12 },
});
