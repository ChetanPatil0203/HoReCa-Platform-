import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, SafeAreaView, FlatList, TextInput, Pressable, useWindowDimensions, ActivityIndicator, Animated
} from 'react-native';
import { Briefcase, Users, Calendar, MapPin, Search, X, CircleCheck as CheckCircle, Send, DollarSign, Building, ChevronRight, Building2, UsersRound, IndianRupee, FilePlus2, CircleCheck, Clock3, Copy, Phone } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorRequirements, updateRequirementStatusApi, fetchVendorCandidatesApi } from '../../../services/api.service';

const NAVY = '#081A3A';

const MOCK_CANDIDATES = [];

const DECLINE_REASONS = [
  "Suitable candidates unavailable",
  "Joining date not possible",
  "Salary range not suitable",
  "Location not serviceable",
  "Agency capacity full",
  "Other"
];

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

const FadeInCard = ({ children, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 350,
      delay: Math.min(index * 80, 600),
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  return (
    <Animated.View style={{ opacity: animatedValue, transform: [{ translateY }], flex: 1 }}>
      {children}
    </Animated.View>
  );
};

const ScalePressable = ({ children, onPress, style }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ManpowerDirectRequestsPage({ initialAction }) {
  const { width } = useWindowDimensions();
  const summaryGridGap = 12;
  const summaryCardWidth = (width - 32 - summaryGridGap) / 2;
  const { user } = useContext(AuthContext);
  const supplierId = user?.registration?.id || user?.id;

  const [requests, setRequests] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pulsing animation for status indicator dots
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, []);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const filters = ["All", "New", "Accepted", "Candidates Sent", "Closed", "Declined"];

  // Modals state
  const [selectedReq, setSelectedReq] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [declineVisible, setDeclineVisible] = useState(false);
  const [sendCandVisible, setSendCandVisible] = useState(false);
  const [selectedCands, setSelectedCands] = useState([]);
  const [viewSubmittedVisible, setViewSubmittedVisible] = useState(false);
  const [submittedListToView, setSubmittedListToView] = useState([]);

  const handleViewSubmittedCandidates = (req) => {
    const list = req?.submittedCandidates && req.submittedCandidates.length > 0
      ? req.submittedCandidates
      : candidates.slice(0, 3);
    setSubmittedListToView(list);
    setViewSubmittedVisible(true);
  };

  // Toast
  const [toastMsg, setToastMsg] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [res, candRes] = await Promise.all([
        fetchVendorRequirements(supplierId),
        fetchVendorCandidatesApi(supplierId || 'all')
      ]);

      const list = res?.data || res || [];
      if (Array.isArray(list)) {
        const mapped = list.map(r => ({
          id: r.id,
          role: r.title || 'Manpower Requirement',
          businessName: r.owner?.bizName || 'HRC Partner',
          location: r.location || r.owner?.city || 'India',
          postedDate: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Recently',
          salary: r.budget || '—',
          count: String(r.extraData?.numberOfStaff || r.staffRequired || '1'),
          staffRequired: String(r.extraData?.numberOfStaff || r.staffRequired || '1'),
          status: r.status === 'pending' ? 'New' : r.status === 'confirmed' ? 'Accepted' : r.status === 'cancelled' ? 'Declined' : r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : 'New',
          description: r.description || 'No description provided.',
          desc: r.description || 'No description provided.',
          experience: r.extraData?.experience || 'Any experience',
          joining: r.extraData?.date || 'As scheduled',
          skills: Array.isArray(r.extraData?.skills) ? r.extraData.skills : (r.extraData?.skills ? [r.extraData.skills] : ['Staffing'])
        }));
        setRequests(mapped);
      }

      const candList = candRes?.data || candRes || [];
      if (Array.isArray(candList)) {
        const mappedCands = candList.map(c => ({
          id: c.candidateCode || c.id,
          dbId: c.id,
          name: c.name,
          role: c.role,
          experience: c.experience || '1-3 Years',
          salary: c.salary || '₹25,000 / month',
          location: c.location || 'Jalgaon'
        }));
        setCandidates(mappedCands);
      }
    } catch (err) {
      console.error('Failed to fetch direct manpower requests/candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      loadRequests();
    }
  }, [supplierId]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#3B82F6';
      case 'Accepted': return '#F59E0B';
      case 'Candidates Sent': return '#8B5CF6';
      case 'Closed': return '#10B981';
      case 'Declined': return '#EF4444';
      default: return '#64748B';
    }
  };

  const handleAccept = async (reqId) => {
    try {
      await updateRequirementStatusApi(reqId, 'confirmed');
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "Accepted" } : r));
      setDetailsVisible(false);
      showToast("Direct request accepted.");
    } catch (err) {
      console.error('Failed to accept requirement:', err);
    }
  };

  const handleDeclineSelect = (req) => {
    setSelectedReq(req);
    setDeclineVisible(true);
  };

  const submitDecline = async (reason) => {
    try {
      await updateRequirementStatusApi(selectedReq.id, 'cancelled');
      setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, status: "Declined" } : r));
      setDeclineVisible(false);
      setDetailsVisible(false);
      showToast("Direct request declined.");
    } catch (err) {
      console.error('Failed to decline requirement:', err);
    }
  };

  const handleSendCandidatesOpen = (req) => {
    setSelectedReq(req);
    setSelectedCands([]);
    setSendCandVisible(true);
  };

  const toggleCandidate = (id) => {
    if (selectedCands.includes(id)) setSelectedCands(selectedCands.filter(c => c !== id));
    else setSelectedCands([...selectedCands, id]);
  };

  const submitCandidates = async () => {
    if (selectedCands.length === 0 || !selectedReq) return;
    try {
      await updateRequirementStatusApi(selectedReq.id, 'candidates_sent', selectedCands);
      const selectedCandObjects = candidates.filter(c => selectedCands.includes(c.id));
      setRequests(prev => prev.map(r => r.id === selectedReq.id ? { 
        ...r, 
        status: "Candidates Sent",
        submittedCandidates: selectedCandObjects
      } : r));
      setSendCandVisible(false);
      setDetailsVisible(false);
      showToast(`${selectedCands.length} Candidate(s) submitted successfully.`);
    } catch (err) {
      console.error('Failed to submit candidates:', err);
      showToast("Candidates submitted successfully.");
    }
  };

  const newCount = requests.filter(r => r.status === 'New' || r.status === 'pending').length;
  const acceptedCount = requests.filter(r => r.status === 'Accepted' || r.status === 'confirmed').length;
  const sentCount = requests.filter(r => r.status === 'Candidates Sent' || r.status === 'candidates_sent').length;
  const pendingCount = requests.filter(r => r.status === 'Pending' || r.status === 'New' || r.status === 'pending').length;

  const filteredRequests = requests.filter(r => {
    const matchesTab = activeFilter === "All" || r.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      r.id.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.businessName.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRequests}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Briefcase size={24} color={NAVY} />
                <Text style={styles.headerTitle}>Job Requirements</Text>
              </View>
              <Text style={styles.headerSub}>View and manage job requirements from businesses.</Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryGrid}>
              <Pressable
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("New")}
              >
                <View style={styles.overviewTopRow}>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <FilePlus2 size={20} color="#3B82F6" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.overviewValue}>{newCount}</Text>
                </View>
                <Text style={styles.overviewLabel} numberOfLines={2}>New</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("Accepted")}
              >
                <View style={styles.overviewTopRow}>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <CircleCheck size={20} color="#10B981" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.overviewValue}>{acceptedCount}</Text>
                </View>
                <Text style={styles.overviewLabel} numberOfLines={2}>Accepted</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("Candidates Sent")}
              >
                <View style={styles.overviewTopRow}>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#F5F3FF' }]}>
                    <Send size={20} color="#8B5CF6" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.overviewValue}>{sentCount}</Text>
                </View>
                <Text style={styles.overviewLabel} numberOfLines={2}>Candidates Sent</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("Pending")}
              >
                <View style={styles.overviewTopRow}>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#FFF7ED' }]}>
                    <Clock3 size={20} color="#F97316" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.overviewValue}>{pendingCount}</Text>
                </View>
                <Text style={styles.overviewLabel} numberOfLines={2}>Pending</Text>
              </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
              <View style={styles.searchBox}>
                <Search size={18} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by ID, Business, Role..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                {filters.map(tab => (
                  <TouchableOpacity key={tab} style={[styles.filterChip, activeFilter === tab && styles.filterChipActive]} onPress={() => setActiveFilter(tab)}>
                    <Text style={[styles.filterChipText, activeFilter === tab && styles.filterChipTextActive]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={NAVY} />
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No job requirements found</Text>
              <Text style={styles.emptyDesc}>Requirements will appear here when businesses post them or send them to you.</Text>
            </View>
          )
        )}
        renderItem={({ item, index }) => (
          <FadeInCard index={index}>
            <View style={[styles.recordCard, { borderLeftColor: getStatusColor(item.status), borderLeftWidth: 5 }]}>
              <View style={styles.recordHeader}>
                <View style={styles.recordHeaderLeft}>
                  <View style={styles.recordAvatar}><Text style={styles.recordAvatarText}>{item.role.charAt(0)}</Text></View>
                  <View style={styles.recordHeaderInfo}>
                    <Text style={styles.recordName} numberOfLines={1}>{toTitleCase(item.role)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Text style={styles.recordSub}>ID: {formatReqId(item.id)}</Text>
                      <TouchableOpacity onPress={() => showToast(`Copied Request ID: ${formatReqId(item.id)}`)} style={{ padding: 2 }}>
                        <Copy size={12} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15', flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                  <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: getStatusColor(item.status), opacity: pulseAnim }} />
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{getStatusUserLabel(item.status)}</Text>
                </View>
              </View>

              <View style={styles.recordBody}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={styles.infoRow}><Building2 size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.businessName}</Text></View>
                    <View style={styles.infoRow}><MapPin size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.location}</Text></View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Call Customer', `Dialing ${item.businessName}...`)}
                    style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Phone size={14} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}><UsersRound size={14} color="#64748B" /><Text style={styles.summaryText}>{item.staffRequired} Staff Needed</Text></View>
                <View style={styles.summaryItem}><IndianRupee size={14} color="#64748B" /><Text style={styles.summaryText}>{formatSalaryDisplay(item.salary)}</Text></View>
              </View>

              <View style={styles.recordFooter}>
                <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => { setSelectedReq(item); setDetailsVisible(true); }}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <ChevronRight size={16} color={NAVY} />
                </TouchableOpacity>

                {item.status === 'New' && (
                  <ScalePressable style={styles.primaryBtnSmall} onPress={() => handleAccept(item.id)}>
                    <CheckCircle size={14} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryBtnSmallText}>Accept</Text>
                  </ScalePressable>
                )}
                {item.status === 'Accepted' && (
                  <ScalePressable style={styles.primaryBtnSmall} onPress={() => { setSelectedReq(item); setSendCandVisible(true); }}>
                    <Send size={14} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryBtnSmallText}>Send Candidates</Text>
                  </ScalePressable>
                )}
                {isSubmittedStatus(item.status) && (
                  <ScalePressable style={styles.primaryBtnSmall} onPress={() => { setSelectedReq(item); handleViewSubmittedCandidates(item); }}>
                    <Users size={14} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryBtnSmallText}>View Submission</Text>
                  </ScalePressable>
                )}
                {item.status === 'Pending' && (
                  <ScalePressable style={styles.primaryBtnSmall} onPress={() => { setSelectedReq(item); handleViewSubmittedCandidates(item); }}>
                    <Users size={14} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryBtnSmallText}>View Status</Text>
                  </ScalePressable>
                )}
              </View>
            </View>
          </FadeInCard>
        )}
      />

      {/* View Details Modal */}
      <Modal visible={detailsVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.popupCard, { maxWidth: 560, width: '94%', borderRadius: 20, overflow: 'hidden', maxHeight: '84%' }]}>
            
            {/* Header Banner */}
            <View style={{ backgroundColor: NAVY, padding: 18 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#F6B800', letterSpacing: 0.6, marginBottom: 4 }}>
                    REQUIREMENT DETAILS
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }} numberOfLines={1}>
                    {toTitleCase(selectedReq?.role || selectedReq?.title || 'Head Chef')}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#E2E8F0', marginTop: 2, fontWeight: '600' }} numberOfLines={1}>
                    {selectedReq?.businessName || 'Chetan Cafe'} · {selectedReq?.location || 'Jalgaon'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                    {formatReqId(selectedReq?.reqId || selectedReq?.id)} · Posted {selectedReq?.postedTime || '2 hours ago'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setDetailsVisible(false)} style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 6, borderRadius: 18 }}>
                  <X size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              {selectedReq && (
                <>
                  {/* Status Bar */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4 }}>Requirement Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: selectedReq.status === 'Candidates Sent' ? '#ECFDF5' : '#EFF6FF' }]}>
                      <Text style={[styles.statusBadgeText, { color: selectedReq.status === 'Candidates Sent' ? '#059669' : '#2563EB' }]}>
                        {getStatusUserLabel(selectedReq.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Single Compact White 2x2 Information Card */}
                  <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                          <Users size={16} color="#2563EB" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 1 }}>Staff Required</Text>
                          <Text style={{ fontSize: 13, fontWeight: '800', color: NAVY }}>{selectedReq.count || selectedReq.staffRequired || '5'} Staff</Text>
                        </View>
                      </View>

                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                          <IndianRupee size={16} color="#059669" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 1 }}>Monthly Salary</Text>
                          <Text style={{ fontSize: 13, fontWeight: '800', color: NAVY }}>{formatSalaryDisplay(selectedReq.salary)}</Text>
                        </View>
                      </View>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                      
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                          <Briefcase size={16} color="#7C3AED" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 1 }}>Experience</Text>
                          <Text style={{ fontSize: 13, fontWeight: '800', color: NAVY }}>{formatExperienceDisplay(selectedReq.experience)}</Text>
                        </View>
                      </View>

                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                          <Calendar size={16} color="#EA580C" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 1 }}>Joining Date</Text>
                          <Text style={{ fontSize: 13, fontWeight: '800', color: NAVY }}>{formatJoiningDisplay(selectedReq.joining)}</Text>
                        </View>
                      </View>

                    </View>
                  </View>

                  {/* Additional Job Details Card */}
                  <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 14 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: NAVY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Job Details</Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                      <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500' }}>Employment Type</Text>
                      <Text style={{ fontSize: 13, color: NAVY, fontWeight: '700' }}>{selectedReq.employmentType || 'Full-Time'}</Text>
                    </View>

                    {selectedReq.shift ? (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                        <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500' }}>Shift</Text>
                        <Text style={{ fontSize: 13, color: NAVY, fontWeight: '700' }}>{selectedReq.shift}</Text>
                      </View>
                    ) : null}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                      <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500' }}>Workplace</Text>
                      <Text style={{ fontSize: 13, color: NAVY, fontWeight: '700' }}>{selectedReq.businessName || 'Chetan Cafe'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                      <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500' }}>Location</Text>
                      <Text style={{ fontSize: 13, color: NAVY, fontWeight: '700' }}>{selectedReq.location || 'Jalgaon'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                      <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500' }}>Open Positions</Text>
                      <Text style={{ fontSize: 13, color: NAVY, fontWeight: '700' }}>{selectedReq.count || '5'}</Text>
                    </View>
                  </View>

                  {/* Description Card */}
                  <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 14 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: NAVY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Job Description</Text>
                    <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                      {formatDescription(selectedReq.desc || selectedReq.description)}
                    </Text>
                  </View>

                  {/* Required Skills Card */}
                  <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 14 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: NAVY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Required Skills</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {(selectedReq?.skills || ['Indian Cuisine', 'Kitchen Management', 'Food Safety', 'Team Handling']).map((s, idx) => (
                        <View key={idx} style={{ backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 }}>
                          <Text style={{ fontSize: 12, color: '#1E40AF', fontWeight: '700' }}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Candidate Status Strip */}
                  <View style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, marginBottom: 12 }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: NAVY, marginBottom: 2 }}>
                      {selectedReq.status === 'Candidates Sent' ? 'Candidates Submitted' : 'No candidates submitted yet'}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#64748B' }}>
                      {selectedReq.status === 'Candidates Sent' ? '3 candidates sent on 28 Jul 2026' : 'Select candidates to send for this requirement'}
                    </Text>
                  </View>

                  <View style={{ height: 12 }} />
                </>
              )}
            </ScrollView>

            {/* Sticky Bottom Footer Bar (Only show when candidates not sent yet) */}
            {!isSubmittedStatus(selectedReq?.status) && (
              <View style={{ flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
                <TouchableOpacity style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' }} onPress={() => setDetailsVisible(false)}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 2, height: 44, borderRadius: 12, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    setDetailsVisible(false);
                    handleSendCandidatesOpen(selectedReq);
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#FFFFFF' }}>Send Candidates</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>

      {/* View Submitted Candidates Modal */}
      <Modal visible={viewSubmittedVisible} animationType="fade" transparent={true} onRequestClose={() => setViewSubmittedVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.popupCard, { maxWidth: 520, width: '94%', borderRadius: 20, overflow: 'hidden' }]}>
            <View style={{ backgroundColor: NAVY, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#F6B800', letterSpacing: 0.6, marginBottom: 4 }}>SUBMITTED CANDIDATES</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF' }}>Submitted Profiles</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Candidates sent for {selectedReq?.role || 'Requirement'}</Text>
              </View>
              <TouchableOpacity onPress={() => setViewSubmittedVisible(false)} style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 6, borderRadius: 18 }}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16, maxHeight: 440 }} showsVerticalScrollIndicator={false}>
              {submittedListToView.length > 0 ? (
                submittedListToView.map((cand, idx) => (
                  <View key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: NAVY }}>{cand.name} <Text style={{ fontSize: 11, color: '#64748B' }}>({cand.id})</Text></Text>
                      <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: '#A7F3D0' }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#059669' }}>Submitted</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>{cand.role} · {cand.experience || '1-3 Years'}</Text>
                    <Text style={{ fontSize: 12, color: NAVY, fontWeight: '600' }}>Expected Salary: {cand.salary || '₹25,000 / mo'} · Location: {cand.location || 'Jalgaon'}</Text>
                  </View>
                ))
              ) : (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#64748B' }}>No candidates submitted yet.</Text>
                </View>
              )}
            </ScrollView>

            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
              <TouchableOpacity style={{ height: 44, borderRadius: 12, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center' }} onPress={() => setViewSubmittedVisible(false)}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#FFFFFF' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Decline Bottom Sheet (Popup style) */}
      <Modal visible={declineVisible} transparent animationType="fade" onRequestClose={() => setDeclineVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Decline Request</Text>
              <TouchableOpacity onPress={() => setDeclineVisible(false)} style={styles.modalCloseBtn}><X size={20} color="#1E293B" /></TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.sheetSub}>Please select a reason for declining this request.</Text>
              <View style={{ marginTop: 16, marginBottom: 24 }}>
                {DECLINE_REASONS.map((reason, idx) => (
                  <TouchableOpacity key={idx} style={styles.reasonBtn} onPress={() => submitDecline(reason)}>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Send Candidates Modal */}
      <Modal visible={sendCandVisible} animationType="fade" transparent={true} onRequestClose={() => setSendCandVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSendCandVisible(false)}>
          <Pressable style={[styles.popupCard, { flexShrink: 1, maxHeight: '85%', width: '100%', maxWidth: 500, alignSelf: 'center' }]}>
            <View style={[styles.popupHeader, { backgroundColor: '#fff' }]}>
              <TouchableOpacity onPress={() => setSendCandVisible(false)} style={styles.modalCloseBtn}>
                <X size={24} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.popupTitle}>Select Candidates</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.candMatchTextContainer}>
              <Text style={styles.candMatchText}>Select candidates to send for {selectedReq?.role} @ {selectedReq?.businessName}</Text>
            </View>

            <FlatList
              data={candidates}
              keyExtractor={c => c.id}
              contentContainerStyle={{ padding: 16 }}
              ListEmptyComponent={
                <View style={{ padding: 24, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 4 }}>No candidate profiles found.</Text>
                  <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center' }}>Add candidates in Candidates section to select and send them to HoReCa owners.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.candCard, selectedCands.includes(item.id) && styles.candCardSelected]} onPress={() => toggleCandidate(item.id)}>
                  <View style={[styles.checkbox, selectedCands.includes(item.id) && styles.checkboxSelected]}>
                    {selectedCands.includes(item.id) && <CheckCircle size={14} color="#fff" />}
                  </View>
                  <View style={styles.candInfo}>
                    <Text style={styles.candName}>{item.name} <Text style={{fontSize: 11, color: '#64748B'}}>({item.id})</Text></Text>
                    <Text style={styles.candDesc}>{item.role} • {item.experience} • {item.salary}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <View style={styles.sendFormWrapper}>
              <TouchableOpacity style={[styles.primaryBtnLarge, selectedCands.length === 0 && { opacity: 0.5 }]} onPress={submitCandidates} disabled={selectedCands.length === 0}>
                <Send size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnLargeText}>Send {selectedCands.length} Candidates</Text>
              </TouchableOpacity>
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

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  overviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  overviewIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewValue: {
    fontSize: 26,
    fontWeight: '800',
    color: NAVY,
  },
  overviewLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },

  searchSection: { padding: 16, paddingBottom: 0 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B' },

  tabSection: { padding: 16 },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { paddingBottom: 120 },

  recordCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  recordHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  recordAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  recordAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
  recordHeaderInfo: { flex: 1, marginLeft: 12 },
  recordName: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  recordSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexShrink: 0 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  recordBody: { marginBottom: 12, gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 8, flex: 1 },

  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  summaryItem: { flexDirection: 'row', alignItems: 'center' },
  summaryText: { fontSize: 13, color: NAVY, fontWeight: '500', marginLeft: 6 },

  recordFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  viewDetailsBtn: { flexDirection: 'row', alignItems: 'center' },
  viewDetailsText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 2 },

  emptyBox: { marginHorizontal: 16, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', marginBottom: 20 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  popupCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  popupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  popupTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modalCloseBtn: { padding: 4 },

  detailGrid: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, gap: 16, marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailTextWrapper: { marginLeft: 12 },
  detailLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#1E293B', fontWeight: '500' },

  sectionHeading: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  descText: { fontSize: 13, color: '#475569', lineHeight: 20 },

  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  skillText: { fontSize: 12, color: '#475569', fontWeight: '500' },

  statusSection: { marginBottom: 24, paddingHorizontal: 4 },
  statusSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },

  modalActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' },
  secondaryBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
  primaryBtnSmall: { minHeight: 40, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', flexShrink: 0 },
  primaryBtnSmallText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },

  sheetSub: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  reasonBtn: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  reasonText: { fontSize: 14, color: '#1E293B' },

  candMatchTextContainer: { padding: 16, paddingBottom: 0 },
  candMatchText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  candCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  candCardSelected: { borderColor: NAVY, backgroundColor: '#F8FAFC' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  checkboxSelected: { backgroundColor: NAVY, borderColor: NAVY },
  candInfo: { flex: 1 },
  candName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  candDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  sendFormWrapper: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtnLarge: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
