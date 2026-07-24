import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, FlatList, TextInput, Pressable, useWindowDimensions } from 'react-native';
import {
  UserRoundCheck, CircleCheck, UserRoundX, Search, SlidersHorizontal, BriefcaseBusiness,
  Building2, MapPin, CalendarDays, ChevronRight, X, UserRoundSearch, History, FileText,
  ShieldCheck, MoreVertical, Pencil, Copy, Clock
} from 'lucide-react-native';

const NAVY = '#081A3A';

const MOCK_DEPLOYMENTS = [];

export default function ManpowerDeploymentsPage() {
  const { width } = useWindowDimensions();
  const summaryGridGap = 12;
  const summaryCardWidth = (width - 32 - summaryGridGap) / 2;

  const [deployments, setDeployments] = useState(MOCK_DEPLOYMENTS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [viewVisible, setViewVisible] = useState(false);
  const [selectedDep, setSelectedDep] = useState(null);

  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [leftJobModalVisible, setLeftJobModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  // Form states
  const [completionDate, setCompletionDate] = useState("");
  const [exitReason, setExitReason] = useState("");
  const [replacementReq, setReplacementReq] = useState("No");

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Working': return '#10B981'; // Green
      case 'Completed': return '#3B82F6'; // Blue
      case 'Left Job': return '#EF4444'; // Red
      default: return '#64748B'; // Gray
    }
  };

  const getStatusIcon = (status, size = 14, color) => {
    switch (status) {
      case 'Working': return <UserRoundCheck size={size} color={color || '#10B981'} />;
      case 'Completed': return <CircleCheck size={size} color={color || '#3B82F6'} />;
      case 'Left Job': return <UserRoundX size={size} color={color || '#EF4444'} />;
      default: return null;
    }
  };

  const openView = (dep) => {
    setSelectedDep(dep);
    setViewVisible(true);
  };

  const markAsCompleted = () => {
    setDeployments(prev => prev.map(d => d.id === selectedDep.id ? { ...d, status: 'Completed' } : d));
    setCompleteModalVisible(false);
    setViewVisible(false);
    showToast(`Staff assignment completed successfully.`);
  };

  const reportLeftJob = () => {
    setDeployments(prev => prev.map(d => d.id === selectedDep.id ? { ...d, status: 'Left Job' } : d));
    setLeftJobModalVisible(false);
    setViewVisible(false);
    showToast(`Staff exit recorded successfully.`);
  };

  const saveAssignmentUpdate = () => {
    setUpdateModalVisible(false);
    showToast(`Assignment updated successfully.`);
  };

  const filteredDeployments = deployments.filter(d => {
    const matchesTab = activeTab === 'All' || d.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      d.candidate.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q) ||
      d.business.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const workingCount = deployments.filter(d => d.status === 'Working').length;
  const completedCount = deployments.filter(d => d.status === 'Completed').length;
  const leftJobCount = deployments.filter(d => d.status === 'Left Job').length;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDeployments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <UserRoundCheck size={24} color={NAVY} />
                <Text style={styles.headerTitle}>Staff Records</Text>
              </View>
              <Text style={styles.headerSub}>Track staff currently working and completed assignments.</Text>
            </View>

            {/* Staff Overview */}
            <View style={styles.summaryGrid}>
              <Pressable style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]} onPress={() => setActiveTab('All')}>
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Total Staff</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#F8FAFC' }]}><UserRoundSearch size={20} color={NAVY} strokeWidth={2.5} /></View>
                </View>
                <Text style={styles.overviewCount}>{deployments.length}</Text>
              </Pressable>

              <Pressable style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]} onPress={() => setActiveTab('Working')}>
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Working</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#ECFDF5' }]}><UserRoundCheck size={20} color="#10B981" strokeWidth={2.5} /></View>
                </View>
                <Text style={styles.overviewCount}>{workingCount}</Text>
              </Pressable>

              <Pressable style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]} onPress={() => setActiveTab('Completed')}>
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Completed</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#EFF6FF' }]}><CircleCheck size={20} color="#3B82F6" strokeWidth={2.5} /></View>
                </View>
                <Text style={styles.overviewCount}>{completedCount}</Text>
              </Pressable>

              <Pressable style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]} onPress={() => setActiveTab('Left Job')}>
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Left Job</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#FEF2F2' }]}><UserRoundX size={20} color="#EF4444" strokeWidth={2.5} /></View>
                </View>
                <Text style={styles.overviewCount}>{leftJobCount}</Text>
              </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
              <View style={styles.searchBox}>
                <Search size={18} color="#94A3B8" />
                <TextInput style={styles.searchInput} placeholder="Search by staff, role, or business..." value={searchQuery} onChangeText={setSearchQuery} />
                <TouchableOpacity style={styles.filterIconBtn}><SlidersHorizontal size={18} color="#64748B" /></TouchableOpacity>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                {['All', 'Working', 'Completed', 'Left Job'].map(tab => (
                  <TouchableOpacity key={tab} style={[styles.filterChip, activeTab === tab && styles.filterChipActive]} onPress={() => setActiveTab(tab)}>
                    <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <UserRoundSearch size={32} color="#CBD5E1" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No staff records found</Text>
            <Text style={styles.emptyDesc}>Staff records will appear here after candidates start working with HoReCa businesses.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [styles.recordCard, { opacity: pressed ? 0.95 : 1 }]} onPress={() => openView(item)}>
            <View style={styles.recordHeader}>
              <View style={styles.recordAvatar}><Text style={styles.recordAvatarText}>{item.candidate.charAt(0)}</Text></View>
              <View style={styles.recordHeaderInfo}>
                <Text style={styles.recordName} numberOfLines={1}>{item.candidate}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.recordBody}>
              <View style={styles.infoRow}><BriefcaseBusiness size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.role}</Text></View>
              <View style={styles.infoRow}><Building2 size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.business}</Text></View>
              <View style={styles.infoRow}><MapPin size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.location}</Text></View>
            </View>

            <View style={styles.recordFooter}>
              <View style={styles.infoRow}><CalendarDays size={14} color="#64748B" /><Text style={[styles.infoText, { fontSize: 12 }]}>Joined: {item.joiningDate}</Text></View>
              <View style={styles.viewDetailsAction}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ChevronRight size={14} color={NAVY} />
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* Staff Record Details Modal (Premium Redesign) */}
      <Modal visible={viewVisible} animationType="fade" transparent={true} onRequestClose={() => setViewVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => { setViewVisible(false); setMoreMenuVisible(false); }}>
          <Pressable style={[styles.popupCardMain, { alignSelf: 'center', width: '90%', maxWidth: 560, maxHeight: '84%', flexShrink: 1 }]}>

            <View style={styles.popupHeaderMain}>
              <Text style={styles.popupTitleMain}>Staff Record Details</Text>
              <TouchableOpacity onPress={() => setViewVisible(false)} style={styles.modalCloseBtnMain}>
                <X size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
              {selectedDep && (
                <>
                  {/* Staff Identity */}
                  <View style={styles.identitySection}>
                    <View style={styles.recordAvatarLg}><Text style={styles.recordAvatarTextLg}>{selectedDep.candidate.charAt(0)}</Text></View>
                    <View style={styles.identityInfo}>
                      <Text style={styles.identityName}>{selectedDep.candidate}</Text>
                      <Text style={styles.identityRole}>{selectedDep.role}</Text>
                      <View style={styles.identityMetaRow}>
                        <Text style={styles.identityId}>STF-{selectedDep.id.split('-')[1]}</Text>
                        <View style={styles.dotDivider} />
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedDep.status) + '15', paddingVertical: 2 }]}>
                          <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedDep.status), fontSize: 11 }]}>{selectedDep.status}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Assignment Summary */}
                  <View style={styles.premiumCard}>
                    <View style={styles.cardHeaderRow}>
                      <BriefcaseBusiness size={18} color={NAVY} />
                      <Text style={styles.cardHeaderTitle}>Current Assignment</Text>
                    </View>
                    <View style={styles.gridContainer}>
                      <View style={styles.gridCol}>
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>Business</Text>
                          <Text style={styles.gridValue}>{selectedDep.business}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>Role</Text>
                          <Text style={styles.gridValue}>{selectedDep.role}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>Joining Date</Text>
                          <Text style={styles.gridValue}>{selectedDep.joiningDate}</Text>
                        </View>
                      </View>
                      <View style={styles.gridCol}>
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>Location</Text>
                          <Text style={styles.gridValue}>{selectedDep.location}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>Shift</Text>
                          <Text style={styles.gridValue}>{selectedDep.type}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>Employment Type</Text>
                          <Text style={styles.gridValue}>Full Time</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Employment Details */}
                  <View style={styles.premiumCard}>
                    <View style={styles.cardHeaderRow}>
                      <FileText size={18} color={NAVY} />
                      <Text style={styles.cardHeaderTitle}>Employment Details</Text>
                    </View>
                    <View style={styles.listContainer}>
                      <View style={styles.listItem}>
                        <Text style={styles.listLabel}>Agreed Salary</Text>
                        <Text style={styles.listValue}>{selectedDep.salary || '₹25,000 / Month'}</Text>
                      </View>
                      <View style={styles.listItem}>
                        <Text style={styles.listLabel}>Working Hours</Text>
                        <Text style={styles.listValue}>{selectedDep.hours || '8 Hours'}</Text>
                      </View>
                      <View style={styles.listItem}>
                        <Text style={styles.listLabel}>Weekly Off</Text>
                        <Text style={styles.listValue}>{selectedDep.weeklyOff || '1 Day'}</Text>
                      </View>
                      <View style={styles.listItem}>
                        <Text style={styles.listLabel}>Contract Duration</Text>
                        <Text style={styles.listValue}>{selectedDep.contract || '6 Months'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Current Status Explanation */}
                  <View style={[styles.statusBanner, { backgroundColor: getStatusColor(selectedDep.status) + '10', borderColor: getStatusColor(selectedDep.status) + '30' }]}>
                    <View style={styles.statusBannerHeader}>
                      {getStatusIcon(selectedDep.status, 18, getStatusColor(selectedDep.status))}
                      <Text style={[styles.statusBannerTitle, { color: getStatusColor(selectedDep.status) }]}>{selectedDep.status}</Text>
                    </View>
                    <Text style={styles.statusBannerDesc}>
                      {selectedDep.status === 'Working' && `Staff member is currently deployed at ${selectedDep.business}.`}
                      {selectedDep.status === 'Completed' && `Staff member completed this assignment successfully.`}
                      {selectedDep.status === 'Left Job' && `Staff member left this assignment before completion.`}
                    </Text>
                  </View>

                  {/* Assignment Timeline */}
                  <View style={styles.premiumCard}>
                    <View style={styles.cardHeaderRow}>
                      <History size={18} color={NAVY} />
                      <Text style={styles.cardHeaderTitle}>Assignment Timeline</Text>
                    </View>
                    <View style={styles.timeline}>
                      <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                          <Text style={styles.timelineTitle}>Candidate Selected</Text>
                          <Text style={styles.timelineDate}>Before {selectedDep.joiningDate}</Text>
                        </View>
                      </View>
                      <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                          <Text style={styles.timelineTitle}>Staff Joined & Started</Text>
                          <Text style={styles.timelineDate}>{selectedDep.joiningDate}</Text>
                        </View>
                      </View>
                      {selectedDep.status === 'Completed' && (
                        <View style={[styles.timelineItem, styles.timelineItemLast]}>
                          <View style={[styles.timelineDot, { backgroundColor: '#3B82F6' }]} />
                          <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Assignment Completed</Text>
                            <Text style={styles.timelineDate}>Recently</Text>
                          </View>
                        </View>
                      )}
                      {selectedDep.status === 'Left Job' && (
                        <View style={[styles.timelineItem, styles.timelineItemLast]}>
                          <View style={[styles.timelineDot, { backgroundColor: '#EF4444' }]} />
                          <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Staff Exit Reported</Text>
                            <Text style={styles.timelineDate}>Recently</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Verification */}
                  <View style={styles.verificationRow}>
                    <ShieldCheck size={16} color="#10B981" />
                    <Text style={styles.verificationText}>Candidate Verification: Verified</Text>
                  </View>

                  <TouchableOpacity style={styles.viewProfileBtn} onPress={() => { setViewVisible(false); showToast("Candidate Profile viewed."); }}>
                    <Text style={styles.viewProfileText}>View Candidate Profile</Text>
                    <ChevronRight size={14} color={NAVY} />
                  </TouchableOpacity>

                  <View style={{ height: 100 }} />
                </>
              )}
            </ScrollView>

            {/* Contextual Actions */}
            {selectedDep && (
              <View style={styles.stickyFooter}>
                {selectedDep.status === 'Working' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setCompleteModalVisible(true)}>
                      <CircleCheck size={18} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.primaryBtnLargeText}>Mark as Completed</Text>
                    </TouchableOpacity>
                    <View style={{ position: 'relative' }}>
                      <TouchableOpacity style={styles.moreActionBtn} onPress={() => setMoreMenuVisible(!moreMenuVisible)}>
                        <MoreVertical size={20} color={NAVY} />
                      </TouchableOpacity>
                      {moreMenuVisible && (
                        <View style={styles.moreDropdown}>
                          <TouchableOpacity style={styles.moreDropdownItem} onPress={() => { setMoreMenuVisible(false); setUpdateModalVisible(true); }}>
                            <Pencil size={16} color="#475569" style={{ marginRight: 8 }} />
                            <Text style={styles.moreDropdownText}>Update Assignment</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.moreDropdownItem, { borderTopWidth: 1, borderTopColor: '#F1F5F9' }]} onPress={() => { setMoreMenuVisible(false); setLeftJobModalVisible(true); }}>
                            <UserRoundX size={16} color="#EF4444" style={{ marginRight: 8 }} />
                            <Text style={[styles.moreDropdownText, { color: '#EF4444' }]}>Report Left Job</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                )}
                {selectedDep.status === 'Completed' && (
                  <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => { showToast("Viewing completion summary..."); }}>
                    <FileText size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryBtnLargeText}>View Completion Summary</Text>
                  </TouchableOpacity>
                )}
                {selectedDep.status === 'Left Job' && (
                  <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => { showToast("Viewing exit details..."); }}>
                    <FileText size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryBtnLargeText}>View Exit Details</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Pressable>
        </TouchableOpacity>
      </Modal>

      {/* Mark as Completed Modal */}
      <Modal visible={completeModalVisible} animationType="fade" transparent={true} onRequestClose={() => setCompleteModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCompleteModalVisible(false)}>
          <Pressable style={[styles.subModalCard, { width: '90%', maxWidth: 400, alignSelf: 'center' }]}>
            <View style={styles.subModalHeader}>
              <Text style={styles.subModalTitle}>Complete this assignment?</Text>
            </View>
            <View style={{ padding: 20 }}>
              <Text style={styles.subModalDesc}>Mark {selectedDep?.candidate} as completed at {selectedDep?.business}.</Text>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Completion Date</Text>
                <TextInput style={styles.input} placeholder="e.g. 30 Sep 2026" value={completionDate} onChangeText={setCompletionDate} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Completion Note (Optional)</Text>
                <TextInput style={styles.inputArea} placeholder="Any feedback..." multiline={true} numberOfLines={3} />
              </View>
              <View style={styles.subModalActions}>
                <TouchableOpacity style={styles.subSecondaryBtn} onPress={() => setCompleteModalVisible(false)}><Text style={styles.subSecondaryBtnText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={styles.subPrimaryBtn} onPress={markAsCompleted}><Text style={styles.subPrimaryBtnText}>Mark as Completed</Text></TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </TouchableOpacity>
      </Modal>

      {/* Report Left Job Modal */}
      <Modal visible={leftJobModalVisible} animationType="fade" transparent={true} onRequestClose={() => setLeftJobModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLeftJobModalVisible(false)}>
          <Pressable style={[styles.subModalCard, { width: '90%', maxWidth: 400, alignSelf: 'center' }]}>
            <View style={styles.subModalHeader}>
              <Text style={styles.subModalTitle}>Report Staff Exit</Text>
            </View>
            <ScrollView style={{ padding: 20, maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.subModalDesc}>{selectedDep?.candidate} • {selectedDep?.role} at {selectedDep?.business}</Text>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Last Working Date</Text>
                <TextInput style={styles.input} placeholder="e.g. 15 May 2026" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Exit Reason</Text>
                <TextInput style={styles.input} placeholder="e.g. Resigned, Personal Emergency..." value={exitReason} onChangeText={setExitReason} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Replacement Required?</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity style={[styles.radioBtn, replacementReq === 'Yes' && styles.radioBtnActive]} onPress={() => setReplacementReq('Yes')}>
                    <Text style={[styles.radioText, replacementReq === 'Yes' && styles.radioTextActive]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.radioBtn, replacementReq === 'No' && styles.radioBtnActive]} onPress={() => setReplacementReq('No')}>
                    <Text style={[styles.radioText, replacementReq === 'No' && styles.radioTextActive]}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Exit Note (Optional)</Text>
                <TextInput style={styles.inputArea} placeholder="Details about the exit..." multiline={true} numberOfLines={3} />
              </View>
              <View style={[styles.subModalActions, { marginTop: 10 }]}>
                <TouchableOpacity style={styles.subSecondaryBtn} onPress={() => setLeftJobModalVisible(false)}><Text style={styles.subSecondaryBtnText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.subPrimaryBtn, { backgroundColor: '#EF4444' }]} onPress={reportLeftJob}><Text style={styles.subPrimaryBtnText}>Confirm Staff Exit</Text></TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </TouchableOpacity>
      </Modal>

      {/* Update Assignment Modal */}
      <Modal visible={updateModalVisible} animationType="fade" transparent={true} onRequestClose={() => setUpdateModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setUpdateModalVisible(false)}>
          <Pressable style={[styles.subModalCard, { width: '90%', maxWidth: 400, alignSelf: 'center' }]}>
            <View style={styles.subModalHeader}>
              <Text style={styles.subModalTitle}>Update Assignment</Text>
            </View>
            <View style={{ padding: 20 }}>
              <Text style={styles.subModalDesc}>Modify employment details for {selectedDep?.candidate}.</Text>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Agreed Salary</Text>
                <TextInput style={styles.input} defaultValue={selectedDep?.salary} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Working Hours</Text>
                <TextInput style={styles.input} defaultValue={selectedDep?.hours} />
              </View>
              <View style={styles.subModalActions}>
                <TouchableOpacity style={styles.subSecondaryBtn} onPress={() => setUpdateModalVisible(false)}><Text style={styles.subSecondaryBtnText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={styles.subPrimaryBtn} onPress={saveAssignmentUpdate}><Text style={styles.subPrimaryBtnText}>Save Changes</Text></TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </TouchableOpacity>
      </Modal>

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, padding: 16, paddingTop: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B', lineHeight: 20 },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, paddingBottom: 0, gap: 12 },
  overviewCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, minHeight: 110, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, justifyContent: 'space-between' },
  overviewTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  overviewIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  overviewCount: { fontSize: 28, fontWeight: '800', color: NAVY, marginTop: 12 },
  overviewLabel: { fontSize: 14, fontWeight: '700', color: '#64748B', flex: 1, marginRight: 8 },

  searchSection: { padding: 16, paddingBottom: 0 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B' },
  filterIconBtn: { padding: 4, marginLeft: 8 },

  tabSection: { padding: 16 },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { paddingBottom: 110 },

  recordCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recordAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  recordAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
  recordHeaderInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: 12 },
  recordName: { fontSize: 16, fontWeight: 'bold', color: NAVY, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexShrink: 0 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  recordBody: { marginBottom: 16, gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 8, flex: 1 },

  recordFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  viewDetailsAction: { flexDirection: 'row', alignItems: 'center' },
  viewDetailsText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },

  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 32, marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 16 },

  // Premium Staff Record Details Modal Styles
  popupCardMain: { backgroundColor: '#F8FAFC', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  popupHeaderMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingHorizontal: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  popupTitleMain: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalCloseBtnMain: { padding: 4 },

  identitySection: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  recordAvatarLg: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  recordAvatarTextLg: { fontSize: 24, fontWeight: 'bold', color: '#3B82F6' },
  identityInfo: { marginLeft: 16, flex: 1 },
  identityName: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  identityRole: { fontSize: 14, color: '#64748B', marginTop: 2, marginBottom: 6 },
  identityMetaRow: { flexDirection: 'row', alignItems: 'center' },
  identityId: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  dotDivider: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },

  premiumCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardHeaderTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginLeft: 8 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridCol: { flex: 1, minWidth: 140, gap: 16 },
  gridItem: { gap: 4 },
  gridLabel: { fontSize: 12, color: '#64748B' },
  gridValue: { fontSize: 14, color: '#1E293B', fontWeight: '500' },

  listContainer: { gap: 12 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12 },
  listLabel: { fontSize: 13, color: '#64748B' },
  listValue: { fontSize: 13, color: '#1E293B', fontWeight: '600' },

  statusBanner: { padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  statusBannerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusBannerTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 6 },
  statusBannerDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },

  timeline: { paddingLeft: 8 },
  timelineItem: { position: 'relative', paddingLeft: 24, paddingBottom: 24, borderLeftWidth: 1, borderLeftColor: '#E2E8F0' },
  timelineItemLast: { borderLeftColor: 'transparent', paddingBottom: 0 },
  timelineDot: { position: 'absolute', left: -5, top: 4, width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#94A3B8', borderWidth: 2, borderColor: '#fff' },
  timelineContent: { top: -2 },
  timelineTitle: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  timelineDate: { fontSize: 11, color: '#64748B', marginTop: 2 },

  verificationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#ECFDF5', borderRadius: 8, marginBottom: 16 },
  verificationText: { fontSize: 12, fontWeight: '600', color: '#10B981', marginLeft: 6 },

  viewProfileBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  viewProfileText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 4 },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', zIndex: 10 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  primaryBtnLarge: { flex: 1, flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  moreActionBtn: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  moreDropdown: { position: 'absolute', bottom: 56, right: 0, backgroundColor: '#fff', borderRadius: 12, padding: 8, width: 180, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, borderWidth: 1, borderColor: '#E2E8F0' },
  moreDropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  moreDropdownText: { fontSize: 13, fontWeight: '600', color: '#475569' },

  // Sub-Modals
  subModalCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  subModalHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  subModalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },
  subModalDesc: { fontSize: 14, color: '#475569', marginBottom: 20, textAlign: 'center' },
  formGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, backgroundColor: '#F8FAFC' },
  inputArea: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingTop: 12, fontSize: 14, backgroundColor: '#F8FAFC', minHeight: 80, textAlignVertical: 'top' },
  radioBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  radioBtnActive: { borderColor: NAVY, backgroundColor: NAVY },
  radioText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  radioTextActive: { color: '#fff' },
  subModalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  subSecondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center' },
  subSecondaryBtnText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  subPrimaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center' },
  subPrimaryBtnText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
