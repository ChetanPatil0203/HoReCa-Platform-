import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { 
  Megaphone, Calendar, Users, DollarSign, Activity, 
  MapPin, CheckCircle, PauseCircle, PlayCircle, Eye, 
  Upload, UserPlus, Clock, Settings, FileText, CheckSquare, Image as ImageIcon, BarChart
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const TABS = ["Running", "Scheduled", "Awaiting Approval", "Paused", "Completed", "Cancelled"];

const CAMPAIGNS = [
  {
    id: "CMP-001",
    title: "Summer Season Social Media Launch",
    client: "Azure Palace Hotel",
    type: "Online",
    budget: "₹50,000",
    startDate: "01 Jul 2026",
    endDate: "30 Sep 2026",
    progress: 45,
    team: ["JS", "AM", "PT"],
    status: "Running",
    details: {
       overview: "Complete social media revamp for the summer season including weekly posts and reels.",
       deliverables: "12 Reels, 30 Posts, Daily Stories",
       tasks: 18,
       assets: 45,
       approvals: "2 Pending",
    }
  },
  {
    id: "CMP-002",
    title: "Weekend Brunch Influencer Push",
    client: "Café Zephyr Group",
    type: "Online & Offline",
    budget: "₹30,000",
    startDate: "20 Aug 2026",
    endDate: "20 Sep 2026",
    progress: 0,
    team: ["AM"],
    status: "Scheduled",
    details: {
       overview: "Influencer marketing campaign combined with offline hoarding banners.",
       deliverables: "10 Influencers, 2 Hoardings",
       tasks: 5,
       assets: 0,
       approvals: "None",
    }
  },
  {
    id: "CMP-003",
    title: "New Menu Launch PR",
    client: "Spice Route Restaurant",
    type: "Offline",
    budget: "₹25,000",
    startDate: "15 Jun 2026",
    endDate: "15 Jul 2026",
    progress: 95,
    team: ["JS", "RV"],
    status: "Awaiting Approval",
    details: {
       overview: "Final pamphlet prints and local newspaper ads pending client sign-off.",
       deliverables: "5000 Pamphlets, 1 Newspaper AD",
       tasks: 12,
       assets: 5,
       approvals: "1 Pending Sign-off",
    }
  }
];

const MODAL_TABS = ["Overview", "Deliverables", "Tasks", "Creative Assets", "Approvals", "Team", "Budget", "Performance", "Reports"];

export default function MarketingCampaignsScreen({ setActivePage, handleUploadCreative }) {
  const [activeTab, setActiveTab] = useState("Running");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("Overview");

  const filteredCampaigns = CAMPAIGNS.filter(c => c.status === activeTab);

  const openDetails = (camp) => {
    setSelectedCampaign(camp);
    setActiveModalTab("Overview");
    setDetailsVisible(true);
  };

  const renderTabs = () => (
    <View style={styles.tabWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Running': return '#10B981';
      case 'Scheduled': return '#3B82F6';
      case 'Awaiting Approval': return '#F59E0B';
      case 'Paused': return '#64748B';
      case 'Completed': return '#059669';
      case 'Cancelled': return '#EF4444';
      default: return '#3B82F6';
    }
  };

  const renderCampaignCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.idText}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.clientText}>{item.client}</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
             <Activity size={14} color="#64748B" />
             <Text style={styles.metricText}>{item.type}</Text>
          </View>
          <View style={styles.metricItem}>
             <DollarSign size={14} color="#64748B" />
             <Text style={styles.metricText}>{item.budget}</Text>
          </View>
          <View style={styles.metricItem}>
             <Calendar size={14} color="#64748B" />
             <Text style={styles.metricText}>{item.startDate} - {item.endDate}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
             <Text style={styles.progressLabel}>Campaign Progress</Text>
             <Text style={styles.progressValue}>{item.progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
             <View style={[styles.progressBarFill, { width: `${item.progress}%`, backgroundColor: statusColor }]} />
          </View>
        </View>

        <View style={styles.teamRow}>
          <Text style={styles.teamLabel}>Assigned Team:</Text>
          <View style={styles.avatarGroup}>
            {item.team.map((initials, idx) => (
               <View key={idx} style={[styles.avatarBox, { zIndex: 10 - idx }]}>
                 <Text style={styles.avatarText}>{initials}</Text>
               </View>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => openDetails(item)}>
            <Eye size={16} color="#fff" />
            <Text style={styles.btnPrimaryText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Activity size={16} color="#8B5CF6" />
            <Text style={styles.btnOutlineText}>Update Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => handleUploadCreative(item)}>
            <Upload size={16} color="#8B5CF6" />
            <Text style={styles.btnOutlineText}>Upload Creative</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <UserPlus size={16} color="#8B5CF6" />
            <Text style={styles.btnOutlineText}>Assign Team</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderModalContent = () => {
    if (!selectedCampaign) return null;
    const c = selectedCampaign;

    switch (activeModalTab) {
      case "Overview":
        return (
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Campaign Overview</Text>
            <Text style={styles.modalDataValue}>{c.details.overview}</Text>
            
            <View style={{flexDirection: 'row', marginTop: 16}}>
              <View style={{flex: 1}}>
                 <Text style={styles.modalDataLabel}>Client</Text>
                 <Text style={styles.modalDataValue}>{c.client}</Text>
              </View>
              <View style={{flex: 1}}>
                 <Text style={styles.modalDataLabel}>Type</Text>
                 <Text style={styles.modalDataValue}>{c.type}</Text>
              </View>
            </View>
          </View>
        );
      case "Deliverables":
        return (
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Agreed Deliverables</Text>
            <Text style={styles.modalDataValue}>{c.details.deliverables}</Text>
          </View>
        );
      case "Tasks":
        return (
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Tasks ({c.details.tasks})</Text>
            <View style={styles.placeholderBox}><CheckSquare size={24} color="#CBD5E1"/><Text style={styles.placeholderText}>Task Board Loading...</Text></View>
          </View>
        );
      case "Creative Assets":
        return (
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Creative Assets ({c.details.assets})</Text>
            <View style={styles.placeholderBox}><ImageIcon size={24} color="#CBD5E1"/><Text style={styles.placeholderText}>Asset Library Loading...</Text></View>
          </View>
        );
      case "Performance":
        return (
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Campaign Performance</Text>
            <View style={styles.placeholderBox}><BarChart size={24} color="#CBD5E1"/><Text style={styles.placeholderText}>Analytics Loading...</Text></View>
          </View>
        );
      default:
        return (
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>{activeModalTab}</Text>
            <Text style={styles.modalDataValue}>Data for {activeModalTab} will be populated here.</Text>
          </View>
        );
    }
  };

  const renderDetailsModal = () => (
    <Modal visible={detailsVisible} animationType="slide" onRequestClose={() => setDetailsVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setDetailsVisible(false)}><Text style={styles.closeBtnText}>Close</Text></TouchableOpacity>
          <Text style={styles.modalTitle} numberOfLines={1}>{selectedCampaign?.title}</Text>
          <View style={{width: 40}} />
        </View>
        
        <View style={styles.modalTabWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modalTabContainer}>
            {MODAL_TABS.map((tab) => (
              <TouchableOpacity key={tab} style={[styles.modalTab, activeModalTab === tab && styles.modalTabActive]} onPress={() => setActiveModalTab(tab)}>
                <Text style={[styles.modalTabText, activeModalTab === tab && styles.modalTabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.modalScroll} contentContainerStyle={{padding: 16}}>
           {renderModalContent()}
        </ScrollView>

        <View style={styles.modalFooter}>
           <TouchableOpacity style={styles.btnOutlineFull}>
             <Text style={styles.btnOutlineText}>Request Approval</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.btnOutlineFull, {backgroundColor: '#F1F5F9', borderColor: '#CBD5E1'}]}>
             <Text style={[styles.btnOutlineText, {color: '#475569'}]}>Pause</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.btnPrimaryFull}>
             <Text style={styles.btnPrimaryText}>Complete Campaign</Text>
           </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderTabs()}
      <FlatList
        data={filteredCampaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderCampaignCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
           <View style={styles.emptyBox}>
             <Text style={styles.emptyText}>No campaigns found for this status.</Text>
           </View>
        )}
      />
      {renderDetailsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  tabWrapper: {
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  tabContainer: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14, fontWeight: '600', color: '#64748B',
  },
  tabTextActive: {
    color: '#8B5CF6',
  },
  listContainer: {
    padding: 16, paddingBottom: 40,
  },
  emptyBox: {
    padding: 24, alignItems: 'center', justifyContent: 'center',
  },
  emptyText: {
    color: '#94A3B8', fontSize: 14,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E2E8F0', elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  idText: {
    fontSize: 12, fontWeight: 'bold', color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 6,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: 3,
  },
  statusText: {
    fontSize: 11, fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 4,
  },
  clientText: {
    fontSize: 14, color: '#475569', marginBottom: 16, fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6, width: '45%',
  },
  metricText: {
    fontSize: 12, color: '#475569',
  },
  progressContainer: {
    marginBottom: 16,
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
  progressBarBg: {
    height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', borderRadius: 4,
  },
  teamRow: {
    flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, marginBottom: 16,
  },
  teamLabel: {
    fontSize: 13, color: '#64748B', marginRight: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatarBox: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0', borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginLeft: -8,
  },
  avatarText: {
    fontSize: 10, fontWeight: 'bold', color: '#475569',
  },
  actionsScroll: {
    gap: 8,
  },
  btnPrimary: {
    flexDirection: 'row', backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnPrimaryText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  btnOutline: {
    flexDirection: 'row', backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnOutlineText: {
    color: '#8B5CF6', fontWeight: 'bold', fontSize: 13,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  closeBtnText: {
    fontSize: 16, color: '#8B5CF6', fontWeight: '600',
  },
  modalTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', flex: 1, textAlign: 'center', marginHorizontal: 16,
  },
  modalTabWrapper: {
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  modalTabContainer: {
    paddingHorizontal: 8,
  },
  modalTab: {
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  modalTabActive: {
    borderBottomColor: '#8B5CF6',
  },
  modalTabText: {
    fontSize: 13, fontWeight: '600', color: '#64748B',
  },
  modalTabTextActive: {
    color: '#8B5CF6',
  },
  modalScroll: {
    flex: 1,
  },
  modalSection: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
  },
  modalSectionTitle: {
    fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1,
  },
  modalDataLabel: {
    fontSize: 12, color: '#64748B', marginBottom: 4,
  },
  modalDataValue: {
    fontSize: 14, color: '#334155', fontWeight: '500', marginBottom: 12,
  },
  placeholderBox: {
    padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1',
  },
  placeholderText: {
    marginTop: 8, fontSize: 12, color: '#94A3B8', fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 8,
  },
  btnPrimaryFull: {
    flex: 1, backgroundColor: '#8B5CF6', paddingVertical: 12, borderRadius: 8, alignItems: 'center',
  },
  btnOutlineFull: {
    flex: 1, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingVertical: 12, borderRadius: 8, alignItems: 'center',
  },
});
