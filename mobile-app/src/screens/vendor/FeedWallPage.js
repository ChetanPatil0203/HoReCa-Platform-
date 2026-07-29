import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { Bell, Zap, MapPin, Calendar, Building2, Send, Eye, EyeOff, Tag, CircleCheck as CheckCircle, CircleX as XCircle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { fetchPublicRequirements, updateRequirementStatusApi } from '../../services/api.service';

const CAT_META = {
  manpower: { color: "#1E40AF", bg: "#EFF6FF", border: "#BFDBFE", label: "Manpower", routeLabel: "Broadcast → Manpower Vendors" },
  service: { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", label: "Service Provider", routeLabel: "Broadcast → Service Providers" },
  marketing: { color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE", label: "Marketing", routeLabel: "Broadcast → Marketing Agencies" },
};

const STATUS_STYLES = {
  "New": { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
  "Pending": { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  "Proposal Sent": { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
  "Accepted": { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  "Rejected": { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
};

export default function FeedWallPage() {
  const { vendorType } = useContext(AuthContext);
  const type = vendorType || 'manpower';

  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [proposalBid, setProposalBid] = useState('');
  const [proposalMsg, setProposalMsg] = useState('');
  const [biddingId, setBiddingId] = useState(null);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const reqType = type === 'service' ? 'serviceProvider' : type;
      const res = await fetchPublicRequirements(reqType);
      if (res.success) {
        const mapped = (res.data || []).map(r => ({
          id: r.id,
          orderId: `#REQ-${r.id.slice(0, 6).toUpperCase()}`,
          title: r.title,
          description: r.description || '',
          postedAt: new Date(r.createdAt).toLocaleDateString('en-IN'),
          client: r.owner?.bizName || 'HRC Partner',
          location: r.location || r.owner?.city || 'India',
          budget: r.budget || 'Negotiable',
          urgency: r.extraData?.urgency || (r.extraData?.urgentRequirement ? 'Urgent' : 'Normal'),
          status: r.status === 'pending' ? 'New' : r.status,
          category: type,
          details: type === 'manpower' ? [
            { label: 'Staff Count', value: String(r.extraData?.numberOfStaff || '1') },
            { label: 'Experience', value: String(r.extraData?.experience || 'Any') },
            { label: 'Shift', value: String(r.extraData?.shift || 'Day Shift') },
          ] : type === 'service' ? [
            { label: 'Service Type', value: String(r.extraData?.serviceType || 'General') },
            { label: 'Scheduled Date', value: String(r.extraData?.date || 'As scheduled') },
          ] : [
            { label: 'Objective', value: String(r.extraData?.objective || 'Branding') },
            { label: 'Duration', value: String(r.extraData?.duration || '1 Month') },
          ]
        }));
        setFeedItems(mapped);
      }
    } catch (err) {
      console.error('Failed to load feed items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [type]);

  const handleSendProposal = async (itemId) => {
    if (!proposalBid) {
      Alert.alert('Required', 'Please enter your bid amount.');
      return;
    }
    try {
      await updateRequirementStatusApi(itemId, 'Proposal Sent');
      setFeedItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return { ...item, status: 'Proposal Sent', budget: '₹' + parseInt(proposalBid).toLocaleString('en-IN') };
        }
        return item;
      }));
      setBiddingId(null);
      setProposalBid('');
      setProposalMsg('');
      Alert.alert('Success', 'Your proposal bid has been sent to the client!');
    } catch (err) {
      console.error('Failed to send proposal:', err);
    }
  };

  const handleDecline = async (itemId) => {
    try {
      await updateRequirementStatusApi(itemId, 'Rejected');
      setFeedItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return { ...item, status: 'Rejected' };
        }
        return item;
      }));
    } catch (err) {
      console.error('Failed to decline requirement:', err);
    }
  };

  const activeMeta = CAT_META[type] || CAT_META.manpower;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconBox, { backgroundColor: activeMeta.bg, borderColor: activeMeta.border }]}>
              <Bell size={20} color={activeMeta.color} />
            </View>
            <View>
              <Text style={styles.pageTitle}>{activeMeta.label} Feed Wall</Text>
              <Text style={styles.pageSubtitle}>Broadcast requests routed to verified {activeMeta.label}s</Text>
            </View>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Live Wall</Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={[styles.infoCard, { backgroundColor: activeMeta.bg, borderColor: activeMeta.border }]}>
          <Zap size={16} color={activeMeta.color} />
          <Text style={[styles.infoCardText, { color: activeMeta.color }]}>
            {activeMeta.routeLabel} (All bids are subject to client confirmation)
          </Text>
        </View>

        {/* Requirement cards list */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={activeMeta.color} />
          </View>
        ) : feedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={40} color={colors.muted} />
            <Text style={styles.emptyText}>No requirements posted on your feed today</Text>
          </View>
        ) : (
          feedItems.map(item => {
            const isExpanded = expanded === item.id;
            const isBidding = biddingId === item.id;
            const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.New;
            const isOpen = item.status === 'New' || item.status === 'Pending';

            return (
              <View key={item.id} style={[styles.card, item.urgency === 'Urgent' && styles.cardUrgent]}>

                {/* Urgent Strip */}
                {item.urgency === 'Urgent' && (
                  <View style={styles.urgentStrip}>
                    <Zap size={11} color="#D97706" />
                    <Text style={styles.urgentStripText}>URGENT REQUIREMENT</Text>
                  </View>
                )}

                <View style={styles.cardContent}>

                  {/* Card Title Header */}
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <View style={styles.categoryRow}>
                        <Text style={[styles.categoryLabel, { color: activeMeta.color }]}>
                          {activeMeta.label} REQUEST
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                          <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>{item.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.headerRight}>
                      <Text style={styles.postedTime}>{item.postedAt}</Text>
                      <Text style={[styles.orderId, { color: activeMeta.color }]}>{item.orderId}</Text>
                    </View>
                  </View>

                  {/* Description quote */}
                  <Text style={styles.cardDescription}>"{item.description}"</Text>

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.gridItem}>
                      <Building2 size={13} color={colors.muted} style={styles.gridIcon} />
                      <View>
                        <Text style={styles.gridLabel}>Client</Text>
                        <Text style={styles.gridVal} numberOfLines={1}>{item.businessName} ({item.businessType})</Text>
                      </View>
                    </View>
                    <View style={styles.gridItem}>
                      <MapPin size={13} color={colors.muted} style={styles.gridIcon} />
                      <View>
                        <Text style={styles.gridLabel}>Location</Text>
                        <Text style={styles.gridVal} numberOfLines={1}>{item.location}</Text>
                      </View>
                    </View>
                    <View style={styles.gridItem}>
                      <Calendar size={13} color={colors.muted} style={styles.gridIcon} />
                      <View>
                        <Text style={styles.gridLabel}>Required By</Text>
                        <Text style={styles.gridVal} numberOfLines={1}>{item.date}</Text>
                      </View>
                    </View>
                    <View style={styles.gridItem}>
                      <Tag size={13} color={colors.muted} style={styles.gridIcon} />
                      <View>
                        <Text style={styles.gridLabel}>Quantity</Text>
                        <Text style={styles.gridVal} numberOfLines={1}>{item.qty}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Budget & Tags row */}
                  <View style={styles.metaRow}>
                    <View style={[styles.budgetBox, { backgroundColor: activeMeta.bg }]}>
                      <Text style={styles.budgetLabel}>Budget</Text>
                      <Text style={[styles.budgetVal, { color: activeMeta.color }]}>{item.budget}</Text>
                    </View>
                    <View style={styles.tagsContainer}>
                      {item.tags.map(tag => (
                        <View key={tag} style={[styles.tagBadge, { borderColor: activeMeta.border }]}>
                          <Text style={[styles.tagText, { color: activeMeta.color }]}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Expandable details panel */}
                  {isExpanded && (
                    <View style={[styles.expandPanel, { backgroundColor: activeMeta.bg + '12', borderColor: activeMeta.border }]}>
                      <Text style={[styles.expandTitle, { color: activeMeta.color }]}>FULL REQUIREMENTS BRIEF</Text>
                      <View style={styles.expandDetailsGrid}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Requirement ID:</Text>
                          <Text style={styles.detailValue}>{item.orderId}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Client Est.:</Text>
                          <Text style={styles.detailValue}>{item.businessName}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Category:</Text>
                          <Text style={styles.detailValue}>{activeMeta.label}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Budget Cap:</Text>
                          <Text style={styles.detailValue}>{item.budget}</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Proposal bidding input drawer */}
                  {isBidding && (
                    <View style={styles.biddingDrawer}>
                      <Text style={styles.bidTitle}>Send Proposal Bid</Text>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Your Bid Amount (₹)</Text>
                        <TextInput
                          style={styles.bidInput}
                          placeholder="e.g. 18500"
                          keyboardType="numeric"
                          value={proposalBid}
                          onChangeText={setProposalBid}
                          placeholderTextColor={colors.muted}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Cover Message / Timeline</Text>
                        <TextInput
                          style={[styles.bidInput, { height: 60, textAlignVertical: 'top' }]}
                          placeholder="Provide details about availability, tools, experience..."
                          multiline
                          numberOfLines={3}
                          value={proposalMsg}
                          onChangeText={setProposalMsg}
                          placeholderTextColor={colors.muted}
                        />
                      </View>
                      <View style={styles.biddingActionRow}>
                        <TouchableOpacity style={[styles.submitBidBtn, { backgroundColor: activeMeta.color }]} onPress={() => handleSendProposal(item.id)}>
                          <Send size={14} color="#fff" />
                          <Text style={styles.submitBidText}>Submit Proposal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBidBtn} onPress={() => setBiddingId(null)}>
                          <Text style={styles.cancelBidText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Bidding/CTAs row */}
                  {isOpen ? (
                    !isBidding && (
                      <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.detailsBtn} onPress={() => setExpanded(isExpanded ? null : item.id)}>
                          {isExpanded ? <EyeOff size={14} color={colors.sub} /> : <Eye size={14} color={colors.sub} />}
                          <Text style={styles.detailsBtnText}>{isExpanded ? 'Hide Details' : 'Details'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.proposalBtn, { backgroundColor: activeMeta.color }]} onPress={() => setBiddingId(item.id)}>
                          <Send size={14} color="#fff" />
                          <Text style={styles.proposalText}>Send Proposal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(item.id)}>
                          <XCircle size={14} color="#EF4444" />
                          <Text style={styles.declineText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  ) : (
                    <View style={styles.proposalStatusBanner}>
                      {item.status === 'Proposal Sent' && (
                        <View style={styles.proposalBannerInner}>
                          <CheckCircle size={14} color="#7C3AED" />
                          <Text style={[styles.proposalStatusText, { color: '#7C3AED' }]}>
                            Proposal submitted — awaiting client review ({item.budget})
                          </Text>
                        </View>
                      )}
                      {item.status === 'Accepted' && (
                        <View style={styles.proposalBannerInner}>
                          <CheckCircle size={14} color="#10B981" />
                          <Text style={[styles.proposalStatusText, { color: '#10B981' }]}>
                            Accepted — client has been notified
                          </Text>
                        </View>
                      )}
                      {item.status === 'Rejected' && (
                        <View style={styles.proposalBannerInner}>
                          <XCircle size={14} color="#EF4444" />
                          <Text style={[styles.proposalStatusText, { color: '#EF4444' }]}>
                            Declined by you
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                </View>
              </View>
            );
          })
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    minHeight: 90, paddingTop: 40, paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.dark,
  },
  pageSubtitle: {
    fontSize: 11,
    color: colors.muted,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#059669',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 8,
  },
  infoCardText: {
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' } }),
  },
  cardUrgent: {
    borderColor: '#FEF3C7',
    borderWidth: 1.5,
  },
  urgentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
    gap: 6,
  },
  urgentStripText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#D97706',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
  },
  headerRight: {
    alignItems: 'end',
  },
  postedTime: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 2,
  },
  orderId: {
    fontSize: 10,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.sub,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  gridItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  gridIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  gridLabel: {
    fontSize: 9,
    color: colors.muted,
  },
  gridVal: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.dark,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  budgetBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  budgetVal: {
    fontSize: 13,
    fontWeight: '900',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tagBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '500',
  },
  expandPanel: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  expandTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  expandDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailRow: {
    width: '45%',
  },
  detailLabel: {
    fontSize: 9,
    color: colors.muted,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.dark,
  },
  biddingDrawer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  bidTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 4,
  },
  bidInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 12,
    color: colors.dark,
  },
  biddingActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  submitBidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 36,
    gap: 6,
  },
  submitBidText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelBidBtn: {
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cancelBidText: {
    color: colors.sub,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    height: 36,
    gap: 6,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.sub,
  },
  proposalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 36,
    gap: 6,
  },
  proposalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    height: 36,
    gap: 6,
  },
  declineText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  proposalStatusBanner: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  proposalBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proposalStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
