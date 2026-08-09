import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TouchableWithoutFeedback, ActivityIndicator
} from 'react-native';
import { ChevronRight, EllipsisVertical as MoreVertical, FileText } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorProposalsBySupplierApi } from '../../../services/api.service';

const PROPOSAL_FILTERS = ["All", "Draft", "Sent", "submitted", "Under Review", "Accepted", "accepted", "Rejected", "Closed"];
const DISPLAY_FILTERS = ["All", "Draft", "Sent", "Under Review", "Accepted", "Rejected", "Closed"];

const mapStatus = (s) => {
  if (!s) return 'Sent';
  if (s === 'submitted') return 'Sent';
  if (s === 'accepted') return 'Accepted';
  if (s === 'rejected') return 'Rejected';
  if (s === 'draft') return 'Draft';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function MarketingProposalsScreen({ setActivePage }) {
  const { user } = useContext(AuthContext);
  const supplierId = user?.registration?.id || user?.id;

  const [proposalFilter, setProposalFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProposals = async () => {
    if (!supplierId) { setLoading(false); return; }
    try {
      const res = await fetchVendorProposalsBySupplierApi(supplierId);
      const list = res?.data || res || [];
      if (Array.isArray(list)) {
        const mapped = list.map(p => ({
          id: `PROP-${p.id ? p.id.substring(0, 6).toUpperCase() : '001'}`,
          rawId: p.id,
          campaign: p.campaign || 'Marketing Campaign',
          client: p.client || 'HoReCa Client',
          status: mapStatus(p.status),
          proposedAmount: p.amount ? `₹${Number(p.amount).toLocaleString('en-IN')}` : 'Custom Quote',
          duration: p.duration || '—',
          submittedDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          validUntil: p.completionDate ? new Date(p.completionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        }));
        setProposals(mapped);
      }
    } catch (err) {
      console.warn('Error loading marketing proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
    const interval = setInterval(loadProposals, 5000);
    return () => clearInterval(interval);
  }, [supplierId]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Proposal Sent': 
      case 'Under Review':
      case 'Sent':
        return { bg: '#E0F2FE', text: '#0369A1' }; // Soft blue
      case 'Accepted': return { bg: '#DCFCE7', text: '#15803D' }; // Soft green
      case 'Declined': 
      case 'Rejected':
        return { bg: '#FEE2E2', text: '#B91C1C' }; // Soft red
      case 'Closed': return { bg: '#F3F4F6', text: '#4B5563' }; // Soft gray
      case 'Draft': return { bg: '#F3F4F6', text: '#4B5563' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const renderProposalCard = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    const isMenuOpen = activeMenuId === item.id;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.idText}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.campaign}</Text>
        <Text style={styles.clientName}>{item.client}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>{item.proposedAmount}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{item.duration}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Submitted</Text>
            <Text style={styles.detailValue}>{item.submittedDate}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Valid Until</Text>
            <Text style={styles.detailValue}>{item.validUntil}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.textAction} onPress={() => {}}>
            <Text style={styles.textActionLabel}>View Proposal</Text>
            <ChevronRight size={16} color="#0B2246" />
          </TouchableOpacity>
          <View style={styles.rightActions}>
            {item.status === 'Draft' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => {}}>
                <Text style={styles.btnPrimaryText}>Continue Editing</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Accepted' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => {}}>
                <Text style={styles.btnPrimaryText}>Open Campaign</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Rejected' && (
              <TouchableOpacity style={styles.btnOutline} onPress={() => {}}>
                <Text style={styles.btnOutlineText}>View Feedback</Text>
              </TouchableOpacity>
            )}
            {(item.status === 'Sent' || item.status === 'Under Review') && (
              <TouchableOpacity 
                style={styles.moreBtn} 
                onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}
              >
                <MoreVertical size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {isMenuOpen && (
          <View style={styles.moreMenu}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemDanger}>Withdraw Proposal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const getFilteredProposals = () => {
    return proposalFilter === 'All' ? proposals : proposals.filter(r => r.status === proposalFilter);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
      <View style={styles.container}>
        <View style={styles.headerArea}>
          <Text style={styles.pageTitle}>Proposals</Text>
          <Text style={styles.pageSubtitle}>Draft and submitted proposals</Text>
        </View>

        <View style={styles.filterWrapper}>
          <FlatList 
            horizontal 
            showsHorizontalScrollIndicator={false}
            data={DISPLAY_FILTERS}
            keyExtractor={item => item}
            contentContainerStyle={styles.filterScroll}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={[styles.filterChip, proposalFilter === item && styles.filterChipActive]}
                onPress={() => setProposalFilter(item)}
              >
                <Text style={[styles.filterChipText, proposalFilter === item && styles.filterChipTextActive]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0B2246" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={getFilteredProposals()}
            keyExtractor={(item) => item.id}
            renderItem={renderProposalCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <FileText size={32} color="#CBD5E1" style={{marginBottom: 12}} />
                <Text style={styles.emptyStateTitle}>No proposals found</Text>
                <Text style={styles.emptyStateSub}>Create a proposal from a direct request or open opportunity.</Text>
              </View>
            }
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  headerArea: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, backgroundColor: '#fff'
  },
  pageTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 14, color: '#64748B', marginTop: 4,
  },
  filterWrapper: {
    paddingLeft: 16, paddingVertical: 12, backgroundColor: '#F8FAFC',
  },
  filterScroll: {
    paddingRight: 16, gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0B2246', borderColor: '#0B2246',
  },
  filterChipText: {
    fontSize: 13, color: '#64748B', fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16, paddingBottom: 115, gap: 12,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, position: 'relative'
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10,
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
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4,
  },
  clientName: {
    fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12,
  },
  detailCol: {
    width: '46%',
  },
  detailLabel: {
    fontSize: 11, color: '#94A3B8', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13, color: '#1E293B', fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12,
  },
  textAction: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
  },
  textActionLabel: {
    fontSize: 14, fontWeight: '600', color: '#0B2246', marginRight: 4,
  },
  rightActions: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  btnPrimary: {
    backgroundColor: '#0B2246', paddingHorizontal: 16, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
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
    position: 'absolute', right: 16, bottom: 56, width: 190, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, zIndex: 10,
  },
  menuItem: {
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  menuItemDanger: {
    fontSize: 14, color: '#EF4444', fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginTop: 16,
  },
  emptyStateSub: {
    fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center', paddingHorizontal: 20
  }
});
