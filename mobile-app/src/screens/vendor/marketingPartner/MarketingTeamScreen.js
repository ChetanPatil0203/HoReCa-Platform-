import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, 
  Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, 
  TouchableWithoutFeedback 
} from 'react-native';
import { 
  UsersRound, UserRoundCheck, BriefcaseBusiness, UserPlus, Search, 
  SlidersHorizontal, ChevronRight, MoreVertical, Pencil, CalendarClock, 
  UserRoundX, X, UploadCloud 
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const NAVY = '#071B3A';
const PURPLE = '#8B5CF6';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const GRAY = '#64748B';
const RED = '#EF4444';
const WHITE = '#FFFFFF';
const MUTED = '#94A3B8';
const LIGHT_BG = '#F8FAFC';

// Mock Data
const MOCK_TEAM = [
  { 
    id: 'EMP-01', initials: 'AK', name: 'Aarav Kumar', role: 'Campaign Manager', 
    skills: ['Strategy', 'Client Handling', 'Planning'], 
    availability: 'Assigned', 
    campaigns: [{ name: 'Azure Palace Summer Launch', role: 'Campaign Lead' }]
  },
  { 
    id: 'EMP-02', initials: 'SM', name: 'Sneha Mishra', role: 'Social Media Manager', 
    skills: ['Instagram', 'Reels', 'Facebook'], 
    availability: 'Available', 
    campaigns: [] 
  },
  { 
    id: 'EMP-03', initials: 'RJ', name: 'Rohan Joshi', role: 'Graphic Designer', 
    skills: ['Photoshop', 'Illustrator', 'Figma', 'After Effects'], 
    availability: 'Available', 
    campaigns: [] 
  },
  { 
    id: 'EMP-04', initials: 'PK', name: 'Priya Kapoor', role: 'Content Writer', 
    skills: ['Copywriting', 'Blogs'], 
    availability: 'Unavailable', 
    campaigns: [] 
  },
];

const ROLES = [
  "Campaign Manager", "Social Media Manager", "Graphic Designer", 
  "Content Writer", "Photographer", "Videographer", 
  "Performance Marketer", "Web Developer", "Brand Strategist", "Account Manager"
];

const ACTIVE_CAMPAIGNS = ["Azure Palace Summer Launch", "Weekend Brunch Influencer Push"];

export default function MarketingTeamScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modals visibility
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [availModalVisible, setAvailModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [modalMode, setModalMode] = useState('Add'); // Add or Edit

  // Form States (simplified for mockup)
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Campaign Manager');
  const [formCampaign, setFormCampaign] = useState('');

  const openMoreMenu = (emp) => {
    setSelectedEmp(emp);
    setMoreMenuVisible(true);
  };

  const openAssign = (emp) => {
    setSelectedEmp(emp);
    setAssignModalVisible(true);
  };

  const openManage = (emp) => {
    setSelectedEmp(emp);
    setManageModalVisible(true);
  };

  const getAvailColor = (avail) => {
    switch (avail) {
      case 'Available': return { bg: '#D1FAE5', text: '#059669' };
      case 'Assigned': return { bg: '#F3E8FF', text: '#7E22CE' };
      case 'Unavailable': return { bg: '#F1F5F9', text: '#475569' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const renderTeamCard = ({ item }) => {
    const avail = getAvailColor(item.availability);
    const visibleSkills = item.skills.slice(0, 3);
    const extraSkillsCount = item.skills.length - 3;
    
    return (
      <View style={[styles.card, !isMobile && { width: '48%', marginRight: '2%' }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.avatarBox}><Text style={styles.avatarText}>{item.initials}</Text></View>
            <View style={styles.headerInfo}>
              <Text style={styles.empName}>{item.name}</Text>
              <Text style={styles.empRole}>{item.role}</Text>
            </View>
          </View>
          <View style={styles.cardHeaderRight}>
            <View style={[styles.badge, { backgroundColor: avail.bg }]}>
              <Text style={[styles.badgeText, { color: avail.text }]}>{item.availability}</Text>
            </View>
            <TouchableOpacity style={styles.moreBtn} onPress={() => openMoreMenu(item)}>
              <MoreVertical size={20} color={MUTED} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.skillsRow}>
          {visibleSkills.map(skill => (
            <View key={skill} style={styles.skillChip}><Text style={styles.skillChipText}>{skill}</Text></View>
          ))}
          {extraSkillsCount > 0 && (
            <View style={styles.skillChip}><Text style={styles.skillChipText}>+{extraSkillsCount} more</Text></View>
          )}
        </View>

        {item.campaigns && item.campaigns.length > 0 ? (
          <View style={styles.campaignStrip}>
            <Text style={styles.campStripLabel}>Current Campaign</Text>
            <Text style={styles.campStripTitle} numberOfLines={2}>{item.campaigns[0].name}</Text>
            <Text style={styles.campStripRole}>Campaign Role: {item.campaigns[0].role}</Text>
            {item.campaigns.length > 1 && (
              <Text style={styles.campStripExtra}>+{item.campaigns.length - 1} more campaign</Text>
            )}
          </View>
        ) : (
          <View style={styles.noCampStrip}>
            <View style={styles.dotGreen} />
            <Text style={styles.noCampText}>Available for Campaign Assignment</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.textActionBtn} onPress={() => { setSelectedEmp(item); setProfileModalVisible(true); }}>
            <Text style={styles.textActionText}>View Profile</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          
          {item.availability === 'Assigned' ? (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => openManage(item)}>
              <Text style={styles.primaryActionText}>Manage Assignment</Text>
            </TouchableOpacity>
          ) : item.availability === 'Available' ? (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => openAssign(item)}>
              <Text style={styles.primaryActionText}>Assign Campaign</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  // -------------------------------------------------------------
  // Modals
  // -------------------------------------------------------------

  const renderMoreMenu = () => (
    <Modal visible={moreMenuVisible} transparent animationType="fade" onRequestClose={() => setMoreMenuVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setMoreMenuVisible(false)}>
        <View style={styles.menuOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContent}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMoreMenuVisible(false); setModalMode('Edit'); setAddModalVisible(true); }}>
                <Pencil size={18} color={NAVY} />
                <Text style={styles.menuText}>Edit Member</Text>
              </TouchableOpacity>
              
              {selectedEmp?.availability === 'Assigned' && (
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMoreMenuVisible(false); openManage(selectedEmp); }}>
                  <BriefcaseBusiness size={18} color={NAVY} />
                  <Text style={styles.menuText}>Manage Assignment</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMoreMenuVisible(false); setAvailModalVisible(true); }}>
                <CalendarClock size={18} color={NAVY} />
                <Text style={styles.menuText}>Change Availability</Text>
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMoreMenuVisible(false); setRemoveModalVisible(true); }}>
                <UserRoundX size={18} color={RED} />
                <Text style={[styles.menuText, { color: RED }]}>Remove Member</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderAddEditModal = () => (
    <Modal visible={addModalVisible} transparent animationType="slide">
      <View style={styles.bottomSheetOverlay}>
        <KeyboardAvoidingView style={styles.modalCentered} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{modalMode === 'Add' ? 'Add Team Member' : 'Edit Team Member'}</Text>
              {modalMode === 'Add' && <Text style={styles.modalSubtitle}>Add a member to your marketing agency team</Text>}
            </View>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}><X size={24} color={GRAY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput style={styles.input} placeholder="e.g. Rahul Sharma" />
            
            <View style={isMobile ? null : styles.row}>
              <View style={isMobile ? null : styles.col}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput style={styles.input} placeholder="name@agency.com" keyboardType="email-address" />
              </View>
              <View style={isMobile ? null : styles.col}>
                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <TextInput style={styles.input} placeholder="+91..." keyboardType="phone-pad" />
              </View>
            </View>

            <Text style={styles.inputLabel}>Team Role *</Text>
            <View style={styles.pseudoSelect}>
              <Text style={styles.pseudoSelectText}>{formRole}</Text>
              <ChevronRight size={16} color={MUTED} />
            </View>

            <Text style={styles.inputLabel}>Primary Skills *</Text>
            <TextInput style={styles.input} placeholder="e.g. Strategy, Social Media" />
          </ScrollView>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setAddModalVisible(false)}>
              <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => setAddModalVisible(false)}>
              <Text style={styles.btnPrimaryText}>{modalMode === 'Add' ? 'Add Team Member' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  const renderRemoveModal = () => {
    const hasDependencies = selectedEmp?.campaigns && selectedEmp.campaigns.length > 0;
    return (
      <Modal visible={removeModalVisible} transparent animationType="fade">
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.dialogContent}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>{hasDependencies ? 'Cannot remove this team member' : 'Remove this team member?'}</Text>
            </View>
            <Text style={styles.dialogText}>
              {hasDependencies 
                ? 'This member is currently assigned to active campaign work. Reassign or remove their campaign assignments first.' 
                : 'The member will no longer have access to the agency workspace.'}
            </Text>
            <View style={styles.modalFooterActions}>
              <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setRemoveModalVisible(false)}>
                <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
              </TouchableOpacity>
              {hasDependencies ? (
                <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => { setRemoveModalVisible(false); openManage(selectedEmp); }}>
                  <Text style={styles.btnPrimaryText}>Manage Assignments</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.btnPrimaryModal, { backgroundColor: RED }]} onPress={() => setRemoveModalVisible(false)}>
                  <Text style={styles.btnPrimaryText}>Remove Member</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProfileModal = () => (
    <Modal visible={profileModalVisible} transparent animationType="slide">
      <View style={styles.bottomSheetOverlay}>
        <View style={styles.modalCentered}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Member Profile</Text>
            <TouchableOpacity onPress={() => setProfileModalVisible(false)}><X size={24} color={GRAY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.profTop}>
              <View style={[styles.avatarBox, { width: 64, height: 64, borderRadius: 32 }]}><Text style={{fontSize: 24, color: WHITE, fontWeight: 'bold'}}>{selectedEmp?.initials}</Text></View>
              <Text style={styles.profName}>{selectedEmp?.name}</Text>
              <Text style={styles.profRole}>{selectedEmp?.role}</Text>
              <View style={[styles.badge, { backgroundColor: getAvailColor(selectedEmp?.availability).bg, marginTop: 8 }]}>
                <Text style={[styles.badgeText, { color: getAvailColor(selectedEmp?.availability).text }]}>{selectedEmp?.availability}</Text>
              </View>
            </View>
            <View style={styles.profDetailRow}><Text style={styles.profLabel}>Skills</Text><Text style={styles.profVal}>{selectedEmp?.skills?.join(', ')}</Text></View>
            <View style={styles.profDetailRow}><Text style={styles.profLabel}>Email</Text><Text style={styles.profVal}>contact@agency.com</Text></View>
            <View style={styles.profDetailRow}><Text style={styles.profLabel}>Mobile</Text><Text style={styles.profVal}>+91 98765 43210</Text></View>
          </ScrollView>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => { setProfileModalVisible(false); setModalMode('Edit'); setAddModalVisible(true); }}>
              <Text style={styles.btnOutlineTextBlack}>Edit Member</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => { setProfileModalVisible(false); selectedEmp?.availability === 'Assigned' ? openManage(selectedEmp) : openAssign(selectedEmp); }}>
              <Text style={styles.btnPrimaryText}>{selectedEmp?.availability === 'Assigned' ? 'Manage Assignment' : 'Assign Campaign'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isMobile ? (width < 340 ? 12 : 16) : 24 }]}>
        
        <View style={[styles.header, width < 340 && { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <View style={{ flex: 1, paddingRight: width < 340 ? 0 : 12, marginBottom: width < 340 ? 12 : 0 }}>
            <Text style={styles.pageTitle}>Team</Text>
            <Text style={styles.pageSubtitle}>Manage team members, skills and campaign assignments</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => { setModalMode('Add'); setAddModalVisible(true); }}>
            <UserPlus size={18} color={WHITE} />
            <Text style={styles.addBtnText}>Add Team Member</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>Team Overview</Text>
          <View style={styles.overviewCols}>
            <TouchableOpacity style={styles.overviewCol}>
              <UsersRound size={20} color={BLUE} />
              <Text style={styles.overviewVal}>14</Text>
              <Text style={styles.overviewLabel}>Total Members</Text>
            </TouchableOpacity>
            <View style={styles.overviewDivider} />
            <TouchableOpacity style={styles.overviewCol}>
              <UserRoundCheck size={20} color={GREEN} />
              <Text style={styles.overviewVal}>8</Text>
              <Text style={styles.overviewLabel}>Available</Text>
            </TouchableOpacity>
            <View style={styles.overviewDivider} />
            <TouchableOpacity style={styles.overviewCol}>
              <BriefcaseBusiness size={20} color={PURPLE} />
              <Text style={styles.overviewVal}>4</Text>
              <Text style={styles.overviewLabel}>Assigned</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchFilterRow}>
          <View style={styles.searchBox}>
            <Search size={18} color={MUTED} />
            <TextInput style={styles.searchInput} placeholder="Search by member, role, or skill..." />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
            <SlidersHorizontal size={20} color={NAVY} />
          </TouchableOpacity>
        </View>

        <View style={styles.pillsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {['All', 'Available', 'Assigned', 'Unavailable'].map(f => (
              <TouchableOpacity key={f} style={[styles.pill, activeFilter === f && styles.pillActive]} onPress={() => setActiveFilter(f)}>
                <Text style={[styles.pillText, activeFilter === f && styles.pillTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={MOCK_TEAM}
          keyExtractor={item => item.id}
          renderItem={renderTeamCard}
          scrollEnabled={false}
          numColumns={isMobile ? 1 : 2}
          key={isMobile ? 'mobile' : 'desktop'}
          columnWrapperStyle={!isMobile && styles.cardRow}
        />

      </ScrollView>

      {renderAddEditModal()}
      {renderMoreMenu()}
      {renderRemoveModal()}
      {renderProfileModal()}
      {/* Note: Assign/Manage modals would follow the same pattern as Profile modal */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, paddingBottom: 16, backgroundColor: LIGHT_BG },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: GRAY },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 16, height: 42, borderRadius: 10, gap: 8, justifyContent: 'center' },
  addBtnText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },
  
  scrollContent: { paddingBottom: 115, maxWidth: 1320, alignSelf: 'center', width: '100%' },

  overviewCard: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  overviewCardTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 16, textAlign: 'center' },
  overviewCols: { flexDirection: 'row', alignItems: 'center' },
  overviewCol: { flex: 1, alignItems: 'center' },
  overviewDivider: { width: 1, height: 40, backgroundColor: '#E2E8F0' },
  overviewVal: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginVertical: 4 },
  overviewLabel: { fontSize: 12, color: GRAY },

  searchFilterRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, paddingHorizontal: 14, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: NAVY },
  filterBtn: { width: 44, height: 44, backgroundColor: WHITE, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },

  pillsWrap: { marginBottom: 16 },
  pillsScroll: { gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: NAVY, borderColor: NAVY },
  pillText: { fontSize: 13, color: NAVY, fontWeight: '500' },
  pillTextActive: { color: WHITE },

  cardRow: { justifyContent: 'flex-start' },
  card: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: PURPLE, fontSize: 16, fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  empName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  empRole: { fontSize: 13, color: GRAY, fontWeight: '500' },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  moreBtn: { padding: 4, marginLeft: 8 },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  skillChip: { backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  skillChipText: { fontSize: 11, color: GRAY, fontWeight: '500' },

  campaignStrip: { backgroundColor: '#F5F3FF', borderRadius: 10, padding: 12, marginBottom: 16 },
  campStripLabel: { fontSize: 10, fontWeight: 'bold', color: PURPLE, textTransform: 'uppercase', marginBottom: 4 },
  campStripTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  campStripRole: { fontSize: 12, color: NAVY, opacity: 0.8 },
  campStripExtra: { fontSize: 11, color: PURPLE, marginTop: 4, fontWeight: '600' },

  noCampStrip: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 6 },
  dotGreen: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN },
  noCampText: { fontSize: 12, color: GREEN, fontWeight: '500' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 16 },
  textActionText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 2 },
  primaryActionBtn: { backgroundColor: NAVY, paddingHorizontal: 14, height: 40, borderRadius: 10, justifyContent: 'center' },
  primaryActionText: { color: WHITE, fontSize: 13, fontWeight: 'bold' },

  // Modals & Menus
  menuOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  menuContent: { backgroundColor: WHITE, borderRadius: 14, width: 220, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, gap: 12 },
  menuText: { fontSize: 14, fontWeight: '500', color: NAVY },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },

  bottomSheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCentered: { backgroundColor: WHITE, borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: GRAY },
  modalScroll: { padding: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, color: NAVY, marginBottom: 16 },
  pseudoSelect: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, height: 44, marginBottom: 16 },
  pseudoSelectText: { fontSize: 14, color: NAVY },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  modalFooterActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: WHITE, gap: 12 },
  btnOutlineModal: { paddingHorizontal: 16, height: 44, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  btnOutlineTextBlack: { color: NAVY, fontWeight: 'bold', fontSize: 14 },
  btnPrimaryModal: { paddingHorizontal: 20, height: 44, borderRadius: 10, justifyContent: 'center', backgroundColor: NAVY },
  btnPrimaryText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },

  dialogContent: { backgroundColor: WHITE, borderRadius: 20, width: '100%', maxWidth: 400, overflow: 'hidden' },
  dialogHeader: { padding: 20, paddingBottom: 10 },
  dialogTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  dialogText: { fontSize: 14, color: GRAY, paddingHorizontal: 20, paddingBottom: 20, lineHeight: 20 },

  profTop: { alignItems: 'center', marginBottom: 24 },
  profName: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginTop: 12, marginBottom: 4 },
  profRole: { fontSize: 14, color: GRAY },
  profDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  profLabel: { fontSize: 13, color: GRAY, flex: 1 },
  profVal: { fontSize: 14, fontWeight: '500', color: NAVY, flex: 2, textAlign: 'right' },
});
