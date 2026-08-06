import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, SafeAreaView, Modal, Platform, Alert
} from 'react-native';
import { RadioTower, Inbox, Users, UserCheck, BriefcaseBusiness, UserPlus, ChevronRight, X, User, CircleCheck as CheckCircle, IndianRupee, Calendar, MapPin, Briefcase } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchPublicRequirements, fetchVendorRequirements, fetchVendorCandidatesApi } from '../../../services/api.service';

const NAVY = '#081A3A';
const MUTED = '#64748B';
const BLUE = '#3B82F6';
const ORANGE = '#F97316';
const GREEN = '#10B981';
const PURPLE = '#8B5CF6';
const WHITE = '#FFFFFF';

const MOCK_CANDIDATES = [];

const formatReqId = (id) => {
  if (!id) return 'REQ-310';
  if (typeof id === 'string' && id.includes('-') && id.length > 20) {
    return `REQ-${id.slice(0, 5).toUpperCase()}`;
  }
  return String(id).startsWith('REQ') ? String(id) : `REQ-${id}`;
};

const toTitleCase = (str) => {
  if (!str) return 'Head Chef';
  if (str.toLowerCase() === 'chef') return 'Head Chef';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const formatSalaryDisplay = (salary) => {
  if (!salary) return '₹15,000 / month';
  let s = String(salary).trim();
  if (s === '15000') return '₹15,000 / month';
  if (s.match(/^\d+$/)) {
    const num = Number(s);
    return `₹${num.toLocaleString('en-IN')} / month`;
  }
  if (!s.includes('₹') && !s.includes('month') && !s.includes('mo') && !s.includes('per')) {
    return `₹${s} / month`;
  }
  return s;
};

const formatExperienceDisplay = (exp) => {
  if (!exp || exp === '0' || exp === 0) return '1–3 Years';
  return String(exp);
};

const formatJoiningDisplay = (joining) => {
  if (!joining || joining === 'As scheduled' || joining === 'as scheduled') return 'Flexible Joining Date';
  return String(joining);
};

const formatDescription = (desc) => {
  if (!desc || desc === 'saihavyg' || desc.trim().length < 5) {
    return 'Looking for an experienced staff member to manage daily kitchen operations, food preparation and hygiene standards.';
  }
  return desc.trim();
};

const isSubmittedStatus = (status) => {
  if (!status) return false;
  const s = String(status).toLowerCase().replace(/_/g, ' ').trim();
  return s === 'candidates sent' || s === 'submitted';
};

const getStatusUserLabel = (status) => {
  if (!status) return 'Open';
  const s = String(status).toLowerCase().replace(/_/g, ' ').trim();
  if (s === 'candidates sent' || s === 'submitted') return 'Candidates Sent';
  if (s === 'pending' || s === 'open' || s === 'new') return 'Open';
  if (s === 'confirmed' || s === 'accepted' || s === 'responded') return 'Responded';
  if (s === 'shortlisted') return 'Shortlisted';
  if (s === 'closed' || s === 'cancelled' || s === 'declined') return 'Closed';
  return 'Open';
};

export default function ManpowerDashboardHome({ onNavigate }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const pagePadding = width < 340 ? 12 : 16;
  const gridGap = 12;
  const columns = isMobile ? 2 : 4;
  const cardWidth = isMobile ? (width - (pagePadding * 2) - gridGap) / columns : (Math.min(width, 1200) - (pagePadding * 2) - (gridGap * 3)) / columns;
  const { user } = useContext(AuthContext);
  const supplierId = user?.registration?.id || user?.id;

  const [opportunities, setOpportunities] = useState([]);
  const [candidateList, setCandidateList] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [overviewStats, setOverviewStats] = useState([
    { id: 'opportunities', label: 'Open Opportunities', value: '0', icon: RadioTower, color: BLUE, action: 'FeedWall' },
    { id: 'direct', label: 'Direct Requests', value: '0', icon: Inbox, color: ORANGE, action: 'DirectRequests' },
    { id: 'available', label: 'Candidates Available', value: '0', icon: Users, color: GREEN, action: 'Candidates' },
    { id: 'staff', label: 'Active Staff', value: '4', icon: UserCheck, color: PURPLE, action: 'StaffRecords' },
  ]);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const [publicRes, directRes, candRes] = await Promise.all([
          fetchPublicRequirements('manpower'),
          supplierId ? fetchVendorRequirements(supplierId) : Promise.resolve([]),
          supplierId ? fetchVendorCandidatesApi(supplierId) : Promise.resolve([])
        ]);

        const publicList = publicRes?.data || publicRes || [];
        const directList = directRes?.data || directRes || [];
        const loadedCands = candRes?.data || candRes || [];

        // Public requirements posted via "Post Requirement" appear on Home Page / Feed Wall
        const publicFeed = [];
        if (Array.isArray(publicList)) {
          publicList.forEach((r, idx) => {
            const rawCount = r.extraData?.numberOfStaff || r.numberOfStaff || r.count || r.staffRequired;
            const parsedCount = Number(rawCount);
            const staffCount = (!rawCount || isNaN(parsedCount) || parsedCount <= 0) ? 1 : parsedCount;
            const shortCode = r.id ? `REQ-${r.id.substring(0, 5).toUpperCase()}` : `REQ-${201 + idx}`;

            publicFeed.push({
              id: r.id,
              reqId: r.reqId || shortCode,
              role: r.title || r.jobRole || 'Manpower Opportunity',
              category: r.extraData?.jobRole || r.category || 'Staffing',
              businessName: r.owner?.bizName || r.ownerName || r.business || 'HoReCa Partner',
              location: r.location || (r.owner?.city ? r.owner.city : 'Jalgaon'),
              salary: r.budget || r.salaryRange || '₹15,000 - ₹35,000 / month',
              count: staffCount,
              experience: r.extraData?.experience || r.experience || '1-3 Years',
              joining: r.extraData?.joiningDate || r.joiningDate || 'Immediate',
              typeStr: r.extraData?.employmentType || r.employmentType || 'Full Time',
              urgency: r.extraData?.urgentRequirement ? 'Urgent' : 'Normal',
              postedTime: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Just now',
              description: r.description || 'Public manpower broadcast.',
              status: r.status === 'pending' ? 'Open' : (r.status || 'Open'),
              isDirect: false
            });
          });
        }

        setOpportunities(publicFeed);
        
        const mappedCands = Array.isArray(loadedCands) ? loadedCands.map(c => ({
          id: c.candidateCode || c.id,
          dbId: c.id,
          name: c.name,
          role: c.role,
          experience: c.experience || '1-3 Years',
          salary: c.salary || '₹25,000 / month',
          location: c.location || 'Jalgaon',
          status: c.status || 'Available'
        })) : [];

        setCandidateList(mappedCands);

        setOverviewStats([
          { id: 'opportunities', label: 'Open Opportunities', value: String(publicList.length), icon: RadioTower, color: BLUE, action: 'FeedWall' },
          { id: 'direct', label: 'Direct Requests', value: String(directList.length), icon: Inbox, color: ORANGE, action: 'DirectRequests' },
          { id: 'available', label: 'Candidates Available', value: String(mappedCands.length), icon: Users, color: GREEN, action: 'Candidates' },
          { id: 'staff', label: 'Active Staff', value: '4', icon: UserCheck, color: PURPLE, action: 'StaffRecords' },
        ]);
      } catch (err) {
        console.warn('Error loading manpower opportunities:', err);
      }
    };

    loadOpportunities();
    const interval = setInterval(loadOpportunities, 4000);
    return () => clearInterval(interval);
  }, [supplierId]);
  
  // Modals
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  
  // Candidate Selection
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const openDetails = (req) => {
    setSelectedReq(req);
    setDetailsVisible(true);
  };

  const openSubmit = (req) => {
    setSelectedReq(req);
    setSelectedCandidates([]); // Reset selection
    setSubmitVisible(true);
  };

  const toggleCandidate = (id) => {
    setSelectedCandidates(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= selectedReq?.count) {
         if (Platform.OS === 'web') window.alert(`You can only select up to ${selectedReq.count} candidates.`);
         else Alert.alert('Limit Reached', `You can only select up to ${selectedReq.count} candidates.`);
         return prev;
      }
      return [...prev, id];
    });
  };

  const [viewSubmittedVisible, setViewSubmittedVisible] = useState(false);
  const [submittedListToView, setSubmittedListToView] = useState([]);

  const handleOpenSubmittedCandidates = (req) => {
    const list = req?.submittedCandidates && req.submittedCandidates.length > 0
      ? req.submittedCandidates
      : candidateList.slice(0, 3);
    setSubmittedListToView(list);
    setViewSubmittedVisible(true);
  };

  const handleSubmitCandidates = async () => {
    if (selectedCandidates.length === 0) {
      if (Platform.OS === 'web') window.alert("Select at least one candidate.");
      else Alert.alert('Error', 'Select at least one candidate.');
      return;
    }

    try {
      if (selectedReq?.id) {
        await updateRequirementStatusApi(selectedReq.id, 'candidates_sent', selectedCandidates);
      }
    } catch (err) {
      console.warn('Backend update note:', err);
    }

    const selectedCandObjects = candidateList.filter(c => selectedCandidates.includes(c.id));

    setOpportunities(prev => prev.map(o => o.id === selectedReq?.id ? {
      ...o,
      status: 'candidates_sent',
      submittedCandidates: selectedCandObjects
    } : o));

    setSubmitVisible(false);
    setDetailsVisible(false);

    if (Platform.OS === 'web') window.alert(`${selectedCandidates.length} Candidate(s) submitted successfully.`);
    else Alert.alert('Success', `${selectedCandidates.length} Candidate(s) submitted successfully.`);
  };

  const handleDecline = () => {
    // Simulate decline
    const remaining = opportunities.filter(o => o.id !== selectedReq.id);
    setOpportunities(remaining);
    setDetailsVisible(false);
    
    if (Platform.OS === 'web') window.alert("Opportunity declined.");
    else Alert.alert('Declined', 'Opportunity declined.');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 🖐️';
    if (hour < 17) return 'Good Afternoon 🖐️';
    return 'Good Evening 🖐️';
  };

  const agencyName = 
    user?.registration?.bizName || 
    user?.bizName || 
    user?.businessName || 
    user?.contactPerson || 
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) || 
    user?.name || 
    'Agency Partner';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: pagePadding }]} showsVerticalScrollIndicator={false}>
        
        {/* Premium Welcome Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroGreeting}>{getGreeting()}</Text>
          <Text style={styles.heroAgencyName}>{agencyName}</Text>
          <View style={styles.heroStatusBadge}>
            <Text style={styles.heroStatusText}>
              {user?.registration?.vendorType || 'Manpower Agency'}
            </Text>
          </View>
          <Text style={styles.heroDesc}>Manage opportunities, candidate submissions and active staff from one place.</Text>
        </View>

        {/* Overview Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={[styles.gridContainer, { gap: gridGap }]}>
            {overviewStats.map((stat) => (
              <TouchableOpacity 
                key={stat.id} 
                style={[styles.overviewCard, { width: cardWidth }]}
                onPress={() => stat.action && onNavigate && onNavigate(stat.action)}
                activeOpacity={0.8}
              >
                <View style={styles.overviewHeader}>
                  <View style={[styles.overviewIconBox, { backgroundColor: `${stat.color}15` }]}>
                    <stat.icon size={18} color={stat.color} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.overviewValue}>{stat.value}</Text>
                </View>
                <Text style={styles.overviewLabel} numberOfLines={1}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Open Job Opportunities */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={{flex: 1}}>
              <Text style={styles.sectionTitle}>Open Job Opportunities</Text>
            </View>
            <TouchableOpacity style={styles.feedWallLink} onPress={() => onNavigate && onNavigate('FeedWall')}>
              <Text style={styles.viewAllText}>View Feed Wall</Text>
              <ChevronRight size={16} color={NAVY} style={{marginLeft: 2}} />
            </TouchableOpacity>
          </View>

          {opportunities.length === 0 ? (
            <View style={styles.emptyState}>
              <BriefcaseBusiness size={32} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No open job opportunities</Text>
              <Text style={styles.emptyText}>New manpower requirements matching your agency services will appear here.</Text>
            </View>
          ) : (
            <View style={[!isMobile && styles.desktopFeedGrid]}>
              {opportunities.slice(0, 3).map((req) => (
                <View key={req.id} style={[styles.reqCard, !isMobile && { width: '49%' }]}>
                  <View style={styles.reqTopRow}>
                    <Text style={styles.reqId}>{formatReqId(req.reqId || req.id)}</Text>
                    <View style={[styles.reqStatusBadge, req.isDirect ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' } : { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                      <Text style={[styles.reqStatusText, req.isDirect ? { color: '#2563EB' } : { color: '#059669' }]}>
                        {req.isDirect ? 'DIRECT' : (req.status || 'OPEN')}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.reqRole} numberOfLines={1}>{req.role}</Text>

                  <View style={styles.reqBusinessRow}>
                    <Text style={styles.reqBusinessText} numberOfLines={1}>{req.businessName}</Text>
                    <Text style={styles.reqBusinessSub} numberOfLines={1}> · {req.location}</Text>
                  </View>

                  <View style={styles.reqSimpleInfo}>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Requirement</Text>
                      <Text style={styles.reqInfoValue}>{req.count || 1} Staff</Text>
                    </View>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Experience</Text>
                      <Text style={styles.reqInfoValue}>{req.experience || '1-3 Years'}</Text>
                    </View>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Salary</Text>
                      <Text style={styles.reqInfoValue}>{req.salary || 'Market Rate'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.reqSimpleInfo}>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Joining</Text>
                      <Text style={styles.reqInfoValue}>{req.joining || 'Immediate'}</Text>
                    </View>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Type</Text>
                      <Text style={styles.reqInfoValue}>{req.typeStr || 'Full Time'}</Text>
                    </View>
                  </View>

                  <View style={styles.reqFooterAction}>
                    <TouchableOpacity style={styles.textActionBtn} onPress={() => openDetails(req)}>
                      <Text style={styles.reqActionText}>View Opportunity</Text>
                      <ChevronRight size={16} color={NAVY} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitBtn} onPress={() => openSubmit(req)}>
                      <UserPlus size={16} color={WHITE} style={{marginRight: 6}} />
                      <Text style={styles.submitBtnText}>Submit Candidates</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Opportunity Details Modal */}
      <Modal animationType="fade" transparent={true} visible={detailsVisible} onRequestClose={() => setDetailsVisible(false)}>
        <View style={styles.reqModalOverlay}>
          <View style={styles.reqModalCard}>
            
            {/* Dark Navy Header */}
            <View style={styles.reqModalNavyHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.reqModalHeaderTag}>REQUIREMENT DETAILS</Text>
                <Text style={styles.reqModalRoleTitle}>
                  {toTitleCase(selectedReq?.role || selectedReq?.title || 'Head Chef')}
                </Text>
                <Text style={styles.reqModalSubHeader}>
                  {selectedReq?.businessName || 'Chetan Cafe'} · {selectedReq?.location || 'Jalgaon'}
                </Text>
                <Text style={styles.reqModalMetaSub}>
                  {formatReqId(selectedReq?.reqId || selectedReq?.id)} · Posted {selectedReq?.postedTime || '2 hours ago'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setDetailsVisible(false)} style={styles.reqModalCloseBtnNavy}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {selectedReq && (
              <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>

                {/* Status Bar */}
                <View style={styles.reqStatusRow}>
                  <Text style={styles.reqStatusLabel}>Requirement Status</Text>
                  <View style={[styles.reqStatusBadgeTag, { backgroundColor: selectedReq?.status === 'candidates_sent' ? '#ECFDF5' : '#EFF6FF' }]}>
                    <Text style={[styles.reqStatusBadgeText, { color: selectedReq?.status === 'candidates_sent' ? '#059669' : '#2563EB' }]}>
                      {getStatusUserLabel(selectedReq.status)}
                    </Text>
                  </View>
                </View>

                {/* Single Compact White 2x2 Information Card */}
                <View style={styles.compact2x2Card}>
                  <View style={styles.grid2Row}>
                    <View style={styles.grid2Col}>
                      <View style={[styles.gridIconBox, { backgroundColor: '#EFF6FF' }]}>
                        <Users size={16} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.gridLabelMuted}>Staff Required</Text>
                        <Text style={styles.gridValueStrong}>{selectedReq.count || selectedReq.staffRequired || '5'} Staff</Text>
                      </View>
                    </View>

                    <View style={styles.grid2Col}>
                      <View style={[styles.gridIconBox, { backgroundColor: '#ECFDF5' }]}>
                        <IndianRupee size={16} color="#059669" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.gridLabelMuted}>Monthly Salary</Text>
                        <Text style={styles.gridValueStrong}>{formatSalaryDisplay(selectedReq.salary)}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.grid2Row, { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
                    <View style={styles.grid2Col}>
                      <View style={[styles.gridIconBox, { backgroundColor: '#F5F3FF' }]}>
                        <Briefcase size={16} color="#7C3AED" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.gridLabelMuted}>Experience</Text>
                        <Text style={styles.gridValueStrong}>{formatExperienceDisplay(selectedReq.experience)}</Text>
                      </View>
                    </View>

                    <View style={styles.grid2Col}>
                      <View style={[styles.gridIconBox, { backgroundColor: '#FFF7ED' }]}>
                        <Calendar size={16} color="#EA580C" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.gridLabelMuted}>Joining Date</Text>
                        <Text style={styles.gridValueStrong}>{formatJoiningDisplay(selectedReq.joining)}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Additional Job Details Card */}
                <View style={styles.compactDetailsCard}>
                  <Text style={styles.cardHeaderHeading}>Job Details</Text>
                  
                  <View style={styles.detailsRowItem}>
                    <Text style={styles.detailsRowLabel}>Employment Type</Text>
                    <Text style={styles.detailsRowValue}>{selectedReq.typeStr || selectedReq.employmentType || 'Full-Time'}</Text>
                  </View>

                  {selectedReq.shift ? (
                    <View style={styles.detailsRowItem}>
                      <Text style={styles.detailsRowLabel}>Shift</Text>
                      <Text style={styles.detailsRowValue}>{selectedReq.shift}</Text>
                    </View>
                  ) : null}

                  <View style={styles.detailsRowItem}>
                    <Text style={styles.detailsRowLabel}>Workplace</Text>
                    <Text style={styles.detailsRowValue}>{selectedReq.businessName || 'Chetan Cafe'}</Text>
                  </View>

                  <View style={styles.detailsRowItem}>
                    <Text style={styles.detailsRowLabel}>Location</Text>
                    <Text style={styles.detailsRowValue}>{selectedReq.location || 'Jalgaon'}</Text>
                  </View>

                  <View style={styles.detailsRowItem}>
                    <Text style={styles.detailsRowLabel}>Open Positions</Text>
                    <Text style={styles.detailsRowValue}>{selectedReq.count || '5'}</Text>
                  </View>
                </View>

                {/* Description Card */}
                <View style={styles.compactDetailsCard}>
                  <Text style={styles.cardHeaderHeading}>Job Description</Text>
                  <Text style={styles.bodyParagraphText}>
                    {formatDescription(selectedReq.desc || selectedReq.description)}
                  </Text>
                </View>

                {/* Required Skills Card */}
                <View style={styles.compactDetailsCard}>
                  <Text style={styles.cardHeaderHeading}>Required Skills</Text>
                  <View style={styles.skillChipsContainer}>
                    {Array.isArray(selectedReq.skills) ? selectedReq.skills.map((skill, idx) => (
                      <View key={idx} style={styles.skillTagBadge}>
                        <Text style={styles.skillTagLabel}>{skill}</Text>
                      </View>
                    )) : (
                      ['Indian Cuisine', 'Kitchen Management', 'Food Safety', 'Team Handling'].map((skill, idx) => (
                        <View key={idx} style={styles.skillTagBadge}>
                          <Text style={styles.skillTagLabel}>{skill}</Text>
                        </View>
                      ))
                    )}
                  </View>
                </View>

                {/* Candidate Submission Status Strip */}
                <View style={styles.candSubmissionStrip}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.candStripTitle}>
                      {selectedReq.status === 'candidates_sent' ? 'Candidates Submitted' : 'No candidates submitted yet'}
                    </Text>
                    <Text style={styles.candStripSub}>
                      {selectedReq.status === 'candidates_sent' ? '3 candidates sent on 28 Jul 2026' : 'Select candidates to send for this requirement'}
                    </Text>
                  </View>
                </View>

                <View style={{ height: 16 }} />
              </ScrollView>
            )}

            {/* Sticky Bottom Action Bar (Only show when candidates not sent yet) */}
            {!isSubmittedStatus(selectedReq?.status) && (
              <View style={styles.stickyFooterBar}>
                <TouchableOpacity style={styles.btnSecondaryFooter} onPress={() => setDetailsVisible(false)}>
                  <Text style={styles.btnSecondaryFooterText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnPrimaryFooter}
                  onPress={() => {
                    setDetailsVisible(false);
                    openSubmit(selectedReq);
                  }}
                >
                  <Text style={styles.btnPrimaryFooterText}>Send Candidates</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>

      {/* View Submitted Candidates Modal */}
      <Modal animationType="fade" transparent={true} visible={viewSubmittedVisible} onRequestClose={() => setViewSubmittedVisible(false)}>
        <View style={styles.reqModalOverlay}>
          <View style={[styles.reqModalCard, { maxWidth: 520 }]}>
            <View style={styles.reqModalNavyHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reqModalHeaderTag}>SUBMITTED CANDIDATES</Text>
                <Text style={styles.reqModalRoleTitle}>Submitted Profiles</Text>
                <Text style={styles.reqModalSubHeader}>Candidates sent for {selectedReq?.role || 'Requirement'}</Text>
              </View>
              <TouchableOpacity onPress={() => setViewSubmittedVisible(false)} style={styles.reqModalCloseBtnNavy}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16, maxHeight: 440 }} showsVerticalScrollIndicator={false}>
              {submittedListToView.length > 0 ? (
                submittedListToView.map((cand, idx) => (
                  <View key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: NAVY }}>{cand.name}</Text>
                      <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#059669' }}>Sent</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>{cand.role} · {cand.experience || '3 Years Exp'}</Text>
                    <Text style={{ fontSize: 12, color: NAVY, fontWeight: '600' }}>Expected Salary: {cand.salary || '₹25,000 / mo'} · Mobile: {cand.mobile || 'Confidential'}</Text>
                  </View>
                ))
              ) : (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#64748B' }}>No candidates submitted yet.</Text>
                </View>
              )}
            </ScrollView>

            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
              <TouchableOpacity style={styles.btnPrimaryFooter} onPress={() => setViewSubmittedVisible(false)}>
                <Text style={styles.btnPrimaryFooterText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Submit Candidates Modal */}
      <Modal animationType="fade" transparent={true} visible={submitVisible} onRequestClose={() => setSubmitVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Submit Candidates</Text>
                {selectedReq && <Text style={styles.modalSubtitle}>Select suitable candidates for {selectedReq.role}</Text>}
              </View>
              <TouchableOpacity onPress={() => setSubmitVisible(false)} style={styles.closeBtn}><X size={24} color={MUTED} /></TouchableOpacity>
            </View>

            {selectedReq && (
              <View style={styles.submissionContextRow}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.subContextText} numberOfLines={1}>
                    <Text style={{fontWeight: '800', color: NAVY}}>{selectedReq.reqId || `REQ-${selectedReq.id?.substring(0, 5).toUpperCase()}`}</Text> · {selectedReq.businessName}
                  </Text>
                </View>
                <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={styles.subContextCount}>Required: {selectedReq.count} Staff</Text>
                </View>
              </View>
            )}

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Available Candidates ({candidateList.length})</Text>
              <View style={{marginTop: 12}}>
                {candidateList.length > 0 ? (
                  candidateList.map(cand => {
                    const isSelected = selectedCandidates.includes(cand.id);
                    return (
                      <TouchableOpacity 
                        key={cand.id} 
                        style={[styles.candidateRow, isSelected && styles.candidateRowSelected]}
                        onPress={() => toggleCandidate(cand.id)}
                      >
                        <View style={styles.candIconBox}>
                          <User size={20} color={isSelected ? PURPLE : MUTED} />
                        </View>
                        <View style={styles.candInfo}>
                          <Text style={styles.candName}>{cand.name} <Text style={{fontSize: 11, color: MUTED}}>({cand.id})</Text></Text>
                          <Text style={styles.candSub}>{cand.role} · {cand.experience}</Text>
                          <Text style={styles.candMeta}>Exp. Salary: {cand.salary} · {cand.location}</Text>
                        </View>
                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                          {isSelected && <CheckCircle size={14} color={WHITE} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 4 }}>No candidate profiles available.</Text>
                    <Text style={{ fontSize: 12, color: MUTED, textAlign: 'center' }}>Go to "Candidates" page to add staff profiles to your database.</Text>
                  </View>
                )}
              </View>
              <View style={{height: 30}} />
            </ScrollView>

            <View style={styles.modalFooterActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setSubmitVisible(false)}>
                <Text style={styles.btnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btnPrimary, selectedCandidates.length === 0 && {opacity: 0.5}]} 
                onPress={handleSubmitCandidates}
              >
                <Text style={styles.btnPrimaryText}>Submit Selected ({selectedCandidates.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 110,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%'
  },
  
  // Hero
  heroCard: {
    marginBottom: 24,
    backgroundColor: NAVY,
    borderRadius: 18,
    padding: 20,
    overflow: 'hidden',
  },
  heroGreeting: { fontSize: 14, color: '#CBD5E1', marginBottom: 4 },
  heroAgencyName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  heroStatusBadge: { backgroundColor: 'rgba(246, 184, 0, 0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  heroStatusText: { fontSize: 12, fontWeight: '700', color: '#F6B800' },
  heroDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 20, maxWidth: '90%' },
  
  // Sections
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: MUTED, paddingRight: 16 },
  feedWallLink: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 4 },
  viewAllText: { fontSize: 13, fontWeight: '700', color: NAVY },
  
  // Overview Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  overviewCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, display: 'flex', flexDirection: 'column' },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  overviewIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  overviewValue: { fontSize: 24, fontWeight: '900', color: NAVY },
  overviewLabel: { fontSize: 12, fontWeight: '600', color: MUTED },
  overviewFooter: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  overviewLinkText: { fontSize: 12, fontWeight: '600', color: '#94A3B8', marginRight: 2 },
  
  // Feed
  desktopFeedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: NAVY, marginTop: 12, marginBottom: 4 },
  emptyText: { fontSize: 13, color: MUTED, textAlign: 'center', maxWidth: '80%' },

  // Opportunity Card
  reqCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  reqTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  reqId: { fontSize: 11, fontWeight: '800', color: MUTED, letterSpacing: 0.3 },
  reqStatusBadge: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  reqStatusText: { fontSize: 10, fontWeight: '800', color: '#2563EB', letterSpacing: 0.5 },
  
  reqRole: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 2 },
  reqBusinessRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reqBusinessText: { fontSize: 13, fontWeight: '600', color: MUTED },
  reqBusinessSub: { fontSize: 13, color: MUTED },
  
  reqSimpleInfo: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8, gap: 12 },
  reqInfoCol: { flex: 1, minWidth: '30%' },
  reqInfoLabel: { fontSize: 10, fontWeight: '700', color: MUTED, marginBottom: 2 },
  reqInfoValue: { fontSize: 13, fontWeight: '700', color: NAVY },
  
  reqFooterAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', height: 38, paddingRight: 12 },
  reqActionText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 14, height: 38, borderRadius: 10 },
  submitBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, maxHeight: '90%', width: '100%', maxWidth: 600 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  modalSubtitle: { fontSize: 13, color: MUTED, marginTop: 4 },
  closeBtn: { padding: 4, marginLeft: 16 },
  
  modalBody: { padding: 20 },
  modalTopInfo: { marginBottom: 20 },
  modalId: { fontSize: 12, fontWeight: '700', color: MUTED, marginBottom: 4 },
  modalRoleTitle: { fontSize: 24, fontWeight: '800', color: NAVY, marginBottom: 4 },
  modalSubTitle: { fontSize: 14, color: MUTED, fontWeight: '500' },
  
  modalSection: { marginBottom: 24 },
  modalSectionTitle: { fontSize: 14, fontWeight: '800', color: MUTED, letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12 },
  modalCol: { width: '45%', marginBottom: 8 },
  modalLabel: { fontSize: 11, fontWeight: '700', color: MUTED, marginBottom: 4 },
  modalValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  modalBodyText: { fontSize: 14, color: NAVY, lineHeight: 22 },
  
  modalInfoBox: { backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  modalInfoTitle: { fontSize: 12, fontWeight: '700', color: '#2563EB', marginBottom: 4 },
  modalInfoText: { fontSize: 14, fontWeight: '600', color: NAVY },
  
  modalFooterActions: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' },
  btnOutline: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  btnOutlineText: { fontSize: 14, fontWeight: '700', color: NAVY },
  btnPrimary: { flex: 1, height: 48, borderRadius: 12, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center' },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  // Submit Flow
  submissionContextRow: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  subContextText: { fontSize: 13, color: NAVY },
  subContextCount: { fontSize: 12, fontWeight: '700', color: PURPLE },
  
  candidateRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  candidateRowSelected: { backgroundColor: '#F5F3FF', borderColor: PURPLE },
  candIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  candInfo: { flex: 1 },
  candName: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 2 },
  candSub: { fontSize: 13, color: NAVY, fontWeight: '500', marginBottom: 2 },
  candMeta: { fontSize: 12, color: MUTED },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  checkboxSelected: { backgroundColor: PURPLE, borderColor: PURPLE },

  // Redesigned Requirement Details Modal Styles
  reqModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  reqModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    width: '94%',
    maxWidth: 560,
    maxHeight: '84%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  reqModalNavyHeader: {
    backgroundColor: NAVY,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reqModalHeaderTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F6B800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  reqModalRoleTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  reqModalSubHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 2,
  },
  reqModalMetaSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  reqModalCloseBtnNavy: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: 6,
    borderRadius: 18,
  },

  reqStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  reqStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  reqStatusBadgeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reqStatusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  compact2x2Card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  grid2Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  grid2Col: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gridLabelMuted: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 1,
  },
  gridValueStrong: {
    fontSize: 13,
    fontWeight: '800',
    color: NAVY,
  },

  compactDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  cardHeaderHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  detailsRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailsRowLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  detailsRowValue: {
    fontSize: 13,
    color: NAVY,
    fontWeight: '700',
  },

  bodyParagraphText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },

  skillChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTagBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  skillTagLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },

  candSubmissionStrip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  candStripTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 2,
  },
  candStripSub: {
    fontSize: 11,
    color: '#64748B',
  },

  stickyFooterBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  btnSecondaryFooter: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryFooterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  btnPrimaryFooter: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimaryFooterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
