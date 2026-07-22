import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, 
  ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions,
  TouchableWithoutFeedback, Switch
} from 'react-native';
import { 
  Search, SlidersHorizontal, ChevronRight, MoreVertical, 
  X, CheckCircle, UploadCloud, CalendarDays, IndianRupee 
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const TABS = ["Active", "Scheduled", "Awaiting Approval", "Paused", "Completed"];

const CAMPAIGNS = [
  {
    id: "CMP-001",
    title: "Summer Season Social Media Launch",
    client: "Azure Palace Hotel",
    category: "Social Media Marketing",
    budget: "₹50,000",
    startDate: "01 Jul 2026",
    endDate: "30 Sep 2026",
    progress: 45,
    stage: "Content Production",
    nextMilestone: "Client Creative Review",
    milestoneDue: "25 Jul 2026",
    team: ["JS", "AM", "PT", "RK", "SS"], // 5 members, should show +2
    status: "Active",
    details: {
       objective: "Drive luxury summer package inquiries.",
       targetAudience: "HNIs, Families (30-50)",
       deliverables: "12 Reels, 30 Posts, Daily Stories",
       clientApprovalStatus: "Pending next milestone",
       attachments: 4,
       updates: "Drafted 5 posts. Waiting for video edits.",
       timeline: "On Track"
    }
  },
  {
    id: "CMP-002",
    title: "Weekend Brunch Influencer Push",
    client: "Café Zephyr Group",
    category: "Influencer Marketing",
    budget: "₹30,000",
    startDate: "20 Aug 2026",
    endDate: "20 Sep 2026",
    progress: 0,
    stage: "Planning",
    nextMilestone: "Influencer Selection",
    milestoneDue: "10 Aug 2026",
    team: ["AM"],
    status: "Scheduled",
    details: {
       objective: "Increase weekend footfall.",
       targetAudience: "Foodies, Millennials",
       deliverables: "10 Influencer Collabs",
       clientApprovalStatus: "Approved",
       attachments: 2,
       updates: "Campaign created. Influencer list pending.",
       timeline: "Scheduled"
    }
  },
  {
    id: "CMP-003",
    title: "New Menu Launch PR",
    client: "Spice Route Restaurant",
    category: "Branding",
    budget: "₹25,000",
    startDate: "15 Jun 2026",
    endDate: "15 Jul 2026",
    progress: 95,
    stage: "Client Review",
    nextMilestone: "Final Sign-off",
    milestoneDue: "10 Jul 2026",
    team: ["JS", "RV"],
    status: "Awaiting Approval",
    details: {
       objective: "Promote the new summer menu.",
       targetAudience: "Local residents, Food bloggers",
       deliverables: "Press Release, Pamphlets",
       clientApprovalStatus: "Awaiting Final Review",
       attachments: 5,
       updates: "Revised pamphlet design sent for approval.",
       timeline: "Delayed by 2 days"
    }
  }
];

const STAGES = ["Planning", "Content Production", "Client Review", "Publishing", "Optimisation", "Reporting"];
const PAUSE_REASONS = ["Waiting for client content", "Waiting for client approval", "Payment pending", "Campaign assets unavailable", "Internal workload", "Other"];
const DELIVERABLE_TYPES = ["Image", "Video", "Design", "Document", "Campaign Copy", "Website Link", "Social Media Post", "Other"];

export default function MarketingCampaignsScreen({ setActivePage }) {
  const [activeTab, setActiveTab] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [pauseModalVisible, setPauseModalVisible] = useState(false);
  
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [successToast, setSuccessToast] = useState("");

  // Update Progress Form
  const [updProgress, setUpdProgress] = useState("");
  const [updStage, setUpdStage] = useState("");
  const [updNote, setUpdNote] = useState("");
  const [updMilestone, setUpdMilestone] = useState("");
  const [updDue, setUpdDue] = useState("");

  // Upload Form
  const [upTitle, setUpTitle] = useState("");
  const [upType, setUpType] = useState("");
  const [upVersion, setUpVersion] = useState("1.0");
  const [upDesc, setUpDesc] = useState("");
  const [upSubmitClient, setUpSubmitClient] = useState(true);

  // Pause Form
  const [pauseReason, setPauseReason] = useState(null);
  const [pauseOther, setPauseOther] = useState("");

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const getFilteredCampaigns = () => {
    return CAMPAIGNS.filter(c => c.status === activeTab);
  };

  const getTabCount = (tabName) => {
    return CAMPAIGNS.filter(c => c.status === tabName).length;
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active': return { bg: '#DCFCE7', text: '#15803D' };
      case 'Scheduled': return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'Awaiting Approval': return { bg: '#FEF3C7', text: '#B45309' };
      case 'Paused': return { bg: '#F1F5F9', text: '#475569' };
      case 'Completed': return { bg: '#CCFBF1', text: '#0F766E' };
      case 'Cancelled': return { bg: '#FEE2E2', text: '#B91C1C' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const isProgressValid = () => {
    const p = parseInt(updProgress);
    return !isNaN(p) && p >= 0 && p <= 100 && updStage && updNote && updMilestone && updDue;
  };

  const isUploadValid = () => {
    return upTitle && upType;
  };

  const submitProgress = () => {
    setProgressModalVisible(false);
    showToast("Campaign progress updated successfully.");
  };

  const submitStart = () => {
    setStartModalVisible(false);
    showToast("Campaign started successfully.");
  };

  const submitUpload = () => {
    setUploadModalVisible(false);
    if (upSubmitClient) showToast("Creative uploaded and sent for client approval.");
    else showToast("Creative uploaded successfully.");
  };

  const submitPause = () => {
    setPauseModalVisible(false);
    showToast("Campaign paused successfully.");
  };

  const renderTeamAvatars = (team) => {
    if (!team || team.length === 0) {
      return (
        <View style={styles.noTeamBadge}>
          <Text style={styles.noTeamText}>Team not assigned</Text>
        </View>
      );
    }
    const visible = team.slice(0, 3);
    const extra = team.length - 3;
    return (
      <View style={styles.avatarGroup}>
        {visible.map((initials, i) => (
          <View key={i} style={[styles.avatarBox, { zIndex: 10 - i, marginLeft: i > 0 ? -8 : 0 }]}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        ))}
        {extra > 0 && (
          <View style={[styles.avatarBox, styles.avatarExtra, { zIndex: 1, marginLeft: -8 }]}>
            <Text style={styles.avatarInitialsExtra}>+{extra}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderCard = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    const isMenuOpen = activeMenuId === item.id;
    const isNarrow = width < 360;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.idText}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status === 'Awaiting Approval' ? 'AWAITING CLIENT APPROVAL' : item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.clientName}>{item.client}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <CalendarDays size={14} color="#64748B" />
            <Text style={styles.metaText}>{item.startDate} – {item.endDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <IndianRupee size={14} color="#64748B" />
            <Text style={styles.metaText}>{item.budget}</Text>
          </View>
        </View>

        <View style={styles.progressArea}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Campaign Progress</Text>
            <Text style={styles.progressValue}>{item.progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.status === 'Completed' ? '#0F766E' : '#8B5CF6' }]} />
          </View>
        </View>

        <View style={[styles.stageMilestoneGrid, isNarrow && { flexDirection: 'column', gap: 12 }]}>
          <View style={styles.stageCol}>
            <Text style={styles.stageLabel}>Current Stage</Text>
            <Text style={styles.stageValue}>{item.stage}</Text>
          </View>
          <View style={styles.stageCol}>
            <Text style={styles.stageLabel}>Next Milestone</Text>
            <Text style={styles.stageValue}>{item.nextMilestone}</Text>
            <Text style={styles.dueText}>Due {item.milestoneDue}</Text>
          </View>
        </View>

        <View style={styles.teamRow}>
          <Text style={styles.teamLabel}>Team</Text>
          {renderTeamAvatars(item.team)}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.textAction} onPress={() => { setSelectedCampaign(item); setDetailsModalVisible(true); }}>
            <Text style={styles.textActionLabel}>View Details</Text>
            <ChevronRight size={16} color="#1E3A8A" />
          </TouchableOpacity>
          <View style={styles.rightActions}>
            {item.status === 'Active' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => {
                setSelectedCampaign(item); setUpdProgress(item.progress.toString()); setUpdStage(item.stage); setUpdNote(""); setUpdMilestone(item.nextMilestone); setUpdDue(item.milestoneDue); setProgressModalVisible(true);
              }}>
                <Text style={styles.btnPrimaryText}>Update Progress</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Scheduled' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => { setSelectedCampaign(item); setStartModalVisible(true); }}>
                <Text style={styles.btnPrimaryText}>Start Campaign</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Awaiting Approval' && (
              <TouchableOpacity style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>View Submission</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Paused' && (
              <TouchableOpacity style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>Resume Campaign</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Completed' && (
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>View Summary</Text>
              </TouchableOpacity>
            )}

            {item.status !== 'Cancelled' && item.status !== 'Completed' && (
              <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}>
                <MoreVertical size={20} color="#64748B" />
              </TouchableOpacity>
            )}
            {item.status === 'Completed' && (
              <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}>
                <MoreVertical size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {isMenuOpen && (
          <View style={styles.moreMenu}>
            {item.status === 'Active' && (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveMenuId(null); setSelectedCampaign(item); setUpTitle(""); setUpType(""); setUpDesc(""); setUploadModalVisible(true); }}>
                  <Text style={styles.menuItemText}><UploadCloud size={14} color="#334155" style={{marginRight: 6}}/>Upload Creative</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Manage Team</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Edit Schedule</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveMenuId(null); setSelectedCampaign(item); setPauseReason(null); setPauseOther(""); setPauseModalVisible(true); }}>
                  <Text style={styles.menuItemText}>Pause Campaign</Text>
                </TouchableOpacity>
              </>
            )}
            {item.status === 'Scheduled' && (
              <>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Edit Campaign</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Manage Team</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Reschedule</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemDanger}>Cancel Campaign</Text></TouchableOpacity>
              </>
            )}
            {item.status === 'Awaiting Approval' && (
              <>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>View Submitted Creative</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveMenuId(null); setSelectedCampaign(item); setUpTitle(""); setUpType(""); setUpDesc(""); setUploadModalVisible(true); }}>
                  <Text style={styles.menuItemText}>Upload Revised Creative</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Contact Client</Text></TouchableOpacity>
              </>
            )}
            {item.status === 'Paused' && (
              <>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Resume Campaign</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Edit Schedule</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemDanger}>Cancel Campaign</Text></TouchableOpacity>
              </>
            )}
            {item.status === 'Completed' && (
              <>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>View Final Report</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Download Report</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemText}>Add to Portfolio</Text></TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
      <View style={styles.container}>
        <View style={styles.headerArea}>
          <Text style={styles.pageTitle}>Campaigns</Text>
          <Text style={styles.pageSubtitle}>Manage active projects, deliverables and client approvals</Text>
          <View style={styles.headerActions}>
            <View style={styles.searchBar}>
              <Search size={18} color="#94A3B8" />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search campaigns..." 
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterSheetVisible(true)}>
              <SlidersHorizontal size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                <View style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab && styles.tabBadgeTextActive]}>{getTabCount(tab)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={getFilteredCampaigns()}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <CheckCircle size={32} color="#CBD5E1" style={{marginBottom: 12}} />
              <Text style={styles.emptyStateTitle}>No {activeTab.toLowerCase()} campaigns</Text>
              <Text style={styles.emptyStateSub}>
                {activeTab === 'Active' ? 'Accepted campaigns will appear here after they begin.' : 
                 activeTab === 'Scheduled' ? 'Upcoming campaigns will appear here.' :
                 activeTab === 'Awaiting Approval' ? 'Submitted creatives waiting for client approval will appear here.' :
                 activeTab === 'Paused' ? 'Paused campaigns will appear here.' :
                 'Successfully completed campaigns will appear here.'}
              </Text>
            </View>
          }
        />

        {successToast ? (
          <View style={styles.toast}>
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.toastText}>{successToast}</Text>
          </View>
        ) : null}

        {/* View Details Modal */}
        <Modal visible={detailsModalVisible} transparent animationType="fade" onRequestClose={() => setDetailsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Campaign Details</Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              {selectedCampaign && (
                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <Text style={styles.idText}>{selectedCampaign.id}</Text>
                  <Text style={styles.modalCampaignTitle}>{selectedCampaign.title}</Text>
                  <Text style={styles.clientName}>{selectedCampaign.client}</Text>
                  <View style={[styles.categoryBadge, { alignSelf: 'flex-start' }]}>
                    <Text style={styles.categoryText}>{selectedCampaign.category}</Text>
                  </View>
                  
                  <View style={styles.sectionDivider} />
                  <Text style={styles.sectionTitle}>Campaign Meta</Text>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Objective</Text><Text style={styles.detailValueM}>{selectedCampaign.details.objective}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Target Audience</Text><Text style={styles.detailValueM}>{selectedCampaign.details.targetAudience}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Deliverables</Text><Text style={styles.detailValueM}>{selectedCampaign.details.deliverables}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Budget</Text><Text style={styles.detailValueM}>{selectedCampaign.budget}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Duration</Text><Text style={styles.detailValueM}>{selectedCampaign.startDate} – {selectedCampaign.endDate}</Text></View>

                  <View style={styles.sectionDivider} />
                  <Text style={styles.sectionTitle}>Execution Status</Text>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Progress</Text><Text style={styles.detailValueM}>{selectedCampaign.progress}%</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Current Stage</Text><Text style={styles.detailValueM}>{selectedCampaign.stage}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Next Milestone</Text><Text style={styles.detailValueM}>{selectedCampaign.nextMilestone} (Due: {selectedCampaign.milestoneDue})</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Client Approval</Text><Text style={styles.detailValueM}>{selectedCampaign.details.clientApprovalStatus}</Text></View>

                  <View style={styles.sectionDivider} />
                  <Text style={styles.sectionTitle}>Recent Updates</Text>
                  <Text style={styles.modalNote}>{selectedCampaign.details.updates}</Text>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* Update Progress Modal */}
        <Modal visible={progressModalVisible} transparent animationType="slide" onRequestClose={() => setProgressModalVisible(false)}>
          <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Update Campaign Progress</Text>
                </View>
                <TouchableOpacity onPress={() => setProgressModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <View style={styles.contextBox}>
                  <Text style={styles.contextClient}>{selectedCampaign?.title}</Text>
                  <Text style={styles.contextCat}>{selectedCampaign?.client}</Text>
                </View>

                <View style={width < 600 ? { flexDirection: 'column' } : styles.inputRow}>
                  <View style={{flex:1, marginRight: width < 600 ? 0 : 8, marginBottom: width < 600 ? 12 : 0}}>
                    <Text style={styles.inputLabel}>Current Progress (%) *</Text>
                    <TextInput style={styles.input} value={updProgress} onChangeText={setUpdProgress} placeholder="e.g. 50" keyboardType="numeric" />
                  </View>
                  <View style={{flex:1, marginLeft: width < 600 ? 0 : 8}}>
                    <Text style={styles.inputLabel}>Current Stage *</Text>
                    <View style={styles.pseudoSelect}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {STAGES.map(s => (
                          <TouchableOpacity key={s} style={[styles.selChip, updStage === s && styles.selChipActive]} onPress={() => setUpdStage(s)}>
                            <Text style={[styles.selChipText, updStage === s && styles.selChipTextActive]}>{s}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </View>

                <Text style={styles.inputLabel}>Update Note *</Text>
                <TextInput style={[styles.input, styles.textArea]} value={updNote} onChangeText={setUpdNote} placeholder="Detail what has been accomplished..." multiline numberOfLines={3} />

                <View style={width < 600 ? { flexDirection: 'column' } : styles.inputRow}>
                  <View style={{flex:1, marginRight: width < 600 ? 0 : 8, marginBottom: width < 600 ? 12 : 0}}>
                    <Text style={styles.inputLabel}>Next Milestone *</Text>
                    <TextInput style={styles.input} value={updMilestone} onChangeText={setUpdMilestone} placeholder="e.g. Draft Review" />
                  </View>
                  <View style={{flex:1, marginLeft: width < 600 ? 0 : 8}}>
                    <Text style={styles.inputLabel}>Milestone Due Date *</Text>
                    <TextInput style={styles.input} value={updDue} onChangeText={setUpdDue} placeholder="DD MMM YYYY" />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Attachment (Optional)</Text>
                <View style={styles.uploadArea}>
                  <UploadCloud size={20} color="#64748B" />
                  <Text style={styles.uploadText}>Tap to attach files</Text>
                </View>
              </ScrollView>
              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setProgressModalVisible(false)}>
                  <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.btnPrimaryModal, !isProgressValid() && { opacity: 0.5 }]} 
                  disabled={!isProgressValid()}
                  onPress={submitProgress}
                >
                  <Text style={styles.btnPrimaryText}>Save Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Start Campaign Modal */}
        <Modal visible={startModalVisible} transparent animationType="fade" onRequestClose={() => setStartModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '60%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Start this campaign?</Text>
                <TouchableOpacity onPress={() => setStartModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <View style={styles.modalScroll}>
                <View style={styles.detailRow}><Text style={styles.detailLabelM}>Campaign</Text><Text style={styles.detailValueM}>{selectedCampaign?.title}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabelM}>Client</Text><Text style={styles.detailValueM}>{selectedCampaign?.client}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabelM}>Start Date</Text><Text style={styles.detailValueM}>{selectedCampaign?.startDate}</Text></View>
              </View>
              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setStartModalVisible(false)}>
                  <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimaryModal} onPress={submitStart}>
                  <Text style={styles.btnPrimaryText}>Start Campaign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Upload Creative Modal */}
        <Modal visible={uploadModalVisible} transparent animationType="slide" onRequestClose={() => setUploadModalVisible(false)}>
          <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{selectedCampaign?.status === 'Awaiting Approval' ? 'Upload Revised Creative' : 'Upload Creative'}</Text>
                </View>
                <TouchableOpacity onPress={() => setUploadModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <Text style={styles.inputLabel}>Creative Title *</Text>
                <TextInput style={styles.input} value={upTitle} onChangeText={setUpTitle} placeholder="e.g. Facebook Ad - Variant A" />

                <Text style={styles.inputLabel}>Deliverable Type *</Text>
                <View style={styles.pseudoSelect}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {DELIVERABLE_TYPES.map(s => (
                      <TouchableOpacity key={s} style={[styles.selChip, upType === s && styles.selChipActive]} onPress={() => setUpType(s)}>
                        <Text style={[styles.selChipText, upType === s && styles.selChipTextActive]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={width < 600 ? { flexDirection: 'column' } : styles.inputRow}>
                  <View style={{flex:1, marginRight: width < 600 ? 0 : 8}}>
                    <Text style={styles.inputLabel}>Version Number</Text>
                    <TextInput style={styles.input} value={upVersion} onChangeText={setUpVersion} />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Description / Notes</Text>
                <TextInput style={[styles.input, styles.textArea]} value={upDesc} onChangeText={setUpDesc} placeholder="Any notes for the team or client..." multiline numberOfLines={3} />

                <Text style={styles.inputLabel}>File Upload *</Text>
                <View style={styles.uploadArea}>
                  <UploadCloud size={24} color="#64748B" />
                  <Text style={styles.uploadText}>Select file from device</Text>
                </View>

                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Submit for Client Approval</Text>
                  <Switch value={upSubmitClient} onValueChange={setUpSubmitClient} trackColor={{false: '#E2E8F0', true: '#C4B5FD'}} thumbColor={upSubmitClient ? '#8B5CF6' : '#94A3B8'} />
                </View>
              </ScrollView>
              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setUploadModalVisible(false)}>
                  <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.btnPrimaryModal, !isUploadValid() && { opacity: 0.5 }]} 
                  disabled={!isUploadValid()}
                  onPress={submitUpload}
                >
                  <Text style={styles.btnPrimaryText}>Upload Creative</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Pause Campaign Modal */}
        <Modal visible={pauseModalVisible} transparent animationType="fade" onRequestClose={() => setPauseModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '70%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pause this campaign?</Text>
                <TouchableOpacity onPress={() => setPauseModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                {PAUSE_REASONS.map(reason => (
                  <TouchableOpacity key={reason} style={styles.radioRow} onPress={() => setPauseReason(reason)}>
                    <View style={[styles.radioOuter, pauseReason === reason && styles.radioOuterSelected]}>
                      {pauseReason === reason && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
                {pauseReason === 'Other' && (
                  <TextInput 
                    style={[styles.input, { marginTop: 12 }]} 
                    placeholder="Please specify" 
                    value={pauseOther} 
                    onChangeText={setPauseOther} 
                  />
                )}
              </ScrollView>
              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setPauseModalVisible(false)}>
                  <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.btnDangerModal, (!pauseReason || (pauseReason === 'Other' && !pauseOther)) && { opacity: 0.5 }]} 
                  disabled={!pauseReason || (pauseReason === 'Other' && !pauseOther)}
                  onPress={submitPause}
                >
                  <Text style={styles.btnPrimaryText}>Pause Campaign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Filter Bottom Sheet */}
        <Modal visible={filterSheetVisible} transparent animationType="slide" onRequestClose={() => setFilterSheetVisible(false)}>
          <View style={styles.bottomSheetOverlay}>
            <TouchableOpacity style={{flex: 1}} onPress={() => setFilterSheetVisible(false)} />
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setFilterSheetVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView style={{padding: 16}}>
                <Text style={styles.filterLabel}>Campaign Status</Text>
                <Text style={styles.filterLabel}>Marketing Service</Text>
                <Text style={styles.filterLabel}>Client</Text>
                <Text style={styles.filterLabel}>Date Range</Text>
                <Text style={styles.filterLabel}>Assigned Team</Text>
                <Text style={styles.filterLabel}>Progress Range</Text>
              </ScrollView>
              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setFilterSheetVisible(false)}>
                  <Text style={styles.btnOutlineTextBlack}>Clear Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => setFilterSheetVisible(false)}>
                  <Text style={styles.btnPrimaryText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  headerArea: {
    paddingHorizontal: 16, paddingTop: 18, paddingBottom: 16, backgroundColor: '#fff'
  },
  pageTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 14, color: '#64748B', marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row', marginTop: 16, gap: 12,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, height: 42,
  },
  searchInput: {
    flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A',
  },
  filterBtn: {
    width: 42, height: 42, backgroundColor: '#EFF6FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  tabsWrapper: {
    paddingTop: 12, paddingBottom: 16, paddingLeft: 16,
  },
  tabsScroll: {
    paddingRight: 16, gap: 8,
  },
  tab: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1,
  },
  tabActive: {
    backgroundColor: '#1E3A8A', borderColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 14, fontWeight: '600', color: '#64748B',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabBadge: {
    backgroundColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabBadgeText: {
    fontSize: 11, fontWeight: 'bold', color: '#475569',
  },
  tabBadgeTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16, paddingBottom: 115, gap: 12,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, position: 'relative'
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6,
  },
  idText: {
    fontSize: 12, fontWeight: '600', color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  statusText: {
    fontSize: 10, fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 2,
  },
  clientName: {
    fontSize: 13, fontWeight: '500', color: '#334155', marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8,
  },
  categoryText: {
    fontSize: 10, fontWeight: '600', color: '#475569',
  },
  metaRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  metaText: {
    fontSize: 12, color: '#475569', fontWeight: '500',
  },
  progressArea: {
    marginBottom: 10,
  },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12, fontWeight: '600', color: '#475569',
  },
  progressValue: {
    fontSize: 12, fontWeight: 'bold', color: '#0F172A',
  },
  progressTrack: {
    height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 3,
  },
  stageMilestoneGrid: {
    flexDirection: 'row', gap: 12, marginBottom: 10,
  },
  stageCol: {
    flex: 1,
  },
  stageLabel: {
    fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2,
  },
  stageValue: {
    fontSize: 12, color: '#1E293B', fontWeight: '600',
  },
  dueText: {
    fontSize: 10, color: '#64748B', marginTop: 2,
  },
  teamRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  teamLabel: {
    fontSize: 13, fontWeight: '600', color: '#475569', marginRight: 12,
  },
  noTeamBadge: {
    backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  noTeamText: {
    color: '#B91C1C', fontSize: 11, fontWeight: '600',
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatarBox: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#E2E8F0', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  avatarExtra: {
    backgroundColor: '#F1F5F9', borderColor: '#E2E8F0',
  },
  avatarInitials: {
    fontSize: 9, fontWeight: 'bold', color: '#475569',
  },
  avatarInitialsExtra: {
    fontSize: 9, fontWeight: 'bold', color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10,
  },
  textAction: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
  },
  textActionLabel: {
    fontSize: 14, fontWeight: '600', color: '#1E3A8A', marginRight: 4,
  },
  rightActions: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  btnPrimary: {
    backgroundColor: '#1E3A8A', paddingHorizontal: 16, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff', fontWeight: '600', fontSize: 14,
  },
  btnOutline: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', paddingHorizontal: 16, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineText: {
    color: '#334155', fontWeight: '600', fontSize: 14,
  },
  moreBtn: {
    padding: 8, marginLeft: -4,
  },
  moreMenu: {
    position: 'absolute', right: 16, bottom: 56, width: 220, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, zIndex: 10,
  },
  menuItem: {
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center'
  },
  menuItemText: {
    fontSize: 14, color: '#334155', fontWeight: '500',
  },
  menuItemDanger: {
    fontSize: 14, color: '#EF4444', fontWeight: '500',
  },
  
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 580, maxHeight: '84%', overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 13, color: '#64748B', marginTop: 2,
  },
  modalScroll: {
    padding: 16,
  },
  modalCampaignTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginTop: 8, marginBottom: 4,
  },
  sectionDivider: {
    height: 1, backgroundColor: '#F1F5F9', marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row', marginBottom: 8,
  },
  detailLabelM: {
    flex: 1, fontSize: 13, color: '#64748B',
  },
  detailValueM: {
    flex: 2, fontSize: 13, color: '#1E293B', fontWeight: '500',
  },
  modalNote: {
    fontSize: 13, color: '#475569', lineHeight: 20, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8,
  },
  modalFooterActions: {
    flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12,
  },
  btnPrimaryModal: {
    flex: 1, backgroundColor: '#1E3A8A', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineModal: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  btnDangerModal: {
    flex: 1, backgroundColor: '#EF4444', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineTextBlack: {
    color: '#0F172A', fontWeight: '600', fontSize: 14,
  },

  contextBox: {
    backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16,
  },
  contextClient: {
    fontSize: 14, fontWeight: 'bold', color: '#0F172A',
  },
  contextCat: {
    fontSize: 12, color: '#64748B', marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12,
  },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: '#0F172A',
  },
  textArea: {
    height: 80, paddingVertical: 10, textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  pseudoSelect: {
    backgroundColor: '#F8FAFC', padding: 6, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', height: 44, justifyContent: 'center',
  },
  selChip: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, marginRight: 6,
  },
  selChipActive: {
    backgroundColor: '#1E3A8A',
  },
  selChipText: {
    fontSize: 13, color: '#475569',
  },
  selChipTextActive: {
    color: '#fff', fontWeight: 'bold'
  },
  uploadArea: {
    borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, padding: 24, alignItems: 'center', backgroundColor: '#F8FAFC', marginTop: 4,
  },
  uploadText: {
    marginTop: 8, fontSize: 13, color: '#64748B',
  },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  toggleLabel: {
    fontSize: 14, fontWeight: '600', color: '#1E293B',
  },

  radioRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: '#1E3A8A',
  },
  radioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#1E3A8A',
  },
  radioText: {
    fontSize: 14, color: '#1E293B',
  },

  bottomSheetOverlay: {
    flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%',
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
  },
  sheetFooter: {
    flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12, backgroundColor: '#fff',
  },
  filterLabel: {
    fontSize: 14, fontWeight: '500', color: '#334155', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },

  emptyState: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginTop: 4,
  },
  emptyStateSub: {
    fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center', paddingHorizontal: 20
  },
  toast: {
    position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, zIndex: 999
  },
  toastText: {
    color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 14,
  }
});
