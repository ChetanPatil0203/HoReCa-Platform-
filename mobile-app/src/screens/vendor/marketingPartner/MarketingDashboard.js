import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import {
  Menu, Bell, Search, LayoutDashboard, ClipboardList, Megaphone, FolderOpen, Users, DollarSign, HelpCircle, Settings, LogOut,
  Home, Inbox, User, Plus, ImagePlus, UserPlus, FileText, Building2
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

import RoleBasedMobileDrawer from '../../../components/navigation/RoleBasedMobileDrawer';
import MarketingDashboardHome from './MarketingDashboardHome';
import MarketingRequestsScreen from './MarketingRequestsScreen';
import MarketingProposalsScreen from './MarketingProposalsScreen';
import MarketingProposalForm from './MarketingProposalForm';
import MarketingCampaignsScreen from './MarketingCampaignsScreen';
import MarketingCreativeApprovalScreen from './MarketingCreativeApprovalScreen';
import MarketingTeamScreen from './MarketingTeamScreen';
import MarketingProfileScreen from './MarketingProfileScreen';
import MarketingRevenueScreen from './MarketingRevenueScreen';
import MarketingNotificationsScreen from './MarketingNotificationsScreen';
import MarketingSettingsScreen from './MarketingSettingsScreen';
import MarketingSupportScreen from './MarketingSupportScreen';
import MarketingFeedWallScreen from './MarketingFeedWallScreen';
import MarketingClientsScreen from './MarketingClientsScreen';

const NAVY = '#071B3A';
const PURPLE = '#071B3A';

export default function MarketingDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { user, logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [plusMenuOpen, setPlusMenuOpen] = useState(false);

  const handleSendProposal = (req) => {
    setSelectedRequirement(req);
    setActivePage('send_proposal');
  };

  const handleUploadCreative = (camp) => {
    setSelectedCampaign(camp);
    setActivePage('upload_creative');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard": return <MarketingDashboardHome setActivePage={setActivePage} handleSendProposal={handleSendProposal} />;
      case "requests": return <MarketingRequestsScreen setActivePage={setActivePage} handleSendProposal={handleSendProposal} />;
      case "proposals": return <MarketingProposalsScreen setActivePage={setActivePage} />;
      case "send_proposal": return <MarketingProposalForm setActivePage={setActivePage} requirement={selectedRequirement} />;
      case "campaigns": return <MarketingCampaignsScreen setActivePage={setActivePage} handleUploadCreative={handleUploadCreative} />;
      case "upload_creative": return <MarketingCreativeApprovalScreen setActivePage={setActivePage} campaign={selectedCampaign} />;
      case "team": return <MarketingTeamScreen setActivePage={setActivePage} />;
      case "revenue": return <MarketingRevenueScreen setActivePage={setActivePage} />;
      case "notifications": return <MarketingNotificationsScreen setActivePage={setActivePage} />;
      case "settings": return <MarketingSettingsScreen setActivePage={setActivePage} />;
      case "support": return <MarketingSupportScreen setActivePage={setActivePage} />;
      case "profile": return <MarketingProfileScreen setActivePage={setActivePage} />;
      case "feed": return <MarketingFeedWallScreen setActivePage={setActivePage} />;
      case "clients": return <MarketingClientsScreen setActivePage={setActivePage} />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Requests", icon: ClipboardList },
    { key: "proposals", label: "Proposals", icon: FileText },
    { key: "clients", label: "Clients", icon: Building2 },
    { key: "campaigns", label: "Campaigns", icon: Megaphone },
    { key: "team", label: "Team", icon: Users },
    { key: "revenue", label: "Revenue", icon: DollarSign },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { key: "support", label: "Help & Support", icon: HelpCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const profileData = {
    initials: user?.name ? user.name.slice(0, 2).toUpperCase() : "MA",
    name: user?.name || "Marketing Partner",
    role: "Marketing Agency",
    badge: "AGENCY"
  };

  const closeMenu = () => {
    if (plusMenuOpen) setPlusMenuOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.container}>
        <RoleBasedMobileDrawer
          activePage={activePage}
          onNavigate={setActivePage}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={logout}
          navItems={navItems}
          bottomNavItems={bottomNavItems}
          profile={profileData}
          panelTitle="AGENCY OPERATIONS"
        />

        <View style={styles.mainContent}>
          {/* Top Navbar */}
          {isMobile ? (
            <View style={styles.mobileBar}>
              <TouchableOpacity style={styles.mobileMenuBtn} onPress={() => setMobileMenuOpen(true)}>
                <Menu size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.mobileLogoContainer}>
                <View style={styles.mobileLogoIconBox}>
                  <Image source={require('../../../assets/HoReCa_Logo.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                </View>
                <Text style={styles.mobileLogoText}>HRC<Text style={{ color: '#D4AF37' }}>HUB</Text></Text>
              </View>

              <View style={styles.mobileRight}>
                <TouchableOpacity style={styles.mobileIconBtn} onPress={() => setActivePage('notifications')}>
                  <Bell size={18} color="#fff" />
                  <View style={styles.mobileNotificationDot} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mobileAvatarBtn} onPress={() => setActivePage('profile')}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: NAVY }}>BC</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.topNav}>
              <View style={styles.searchBox}>
                <Search size={16} color={colors.muted} />
                <Text style={styles.searchText}>Search opportunities...</Text>
              </View>
              <View style={styles.navRight}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setActivePage('notifications')}>
                  <Bell size={20} color={colors.sub} />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Page Content */}
          <View style={styles.pageArea}>
            {renderActivePage()}
          </View>

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <View style={styles.bottomNavWrapper}>
              {plusMenuOpen && (
                <View style={styles.floatingMenu}>
                  <TouchableOpacity style={styles.floatingMenuItem} onPress={() => { setPlusMenuOpen(false); setActivePage('team'); }}>
                    <View style={styles.floatingMenuIconBox}><UserPlus size={16} color={PURPLE} /></View>
                    <Text style={styles.floatingMenuText}>Add Team Member</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => { closeMenu(); setActivePage('dashboard'); }}>
                  <Home size={24} color={activePage === 'dashboard' ? PURPLE : '#94A3B8'} />
                  <Text style={[styles.navItemText, activePage === 'dashboard' && styles.navItemTextActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => { closeMenu(); setActivePage('requests'); }}>
                  <View style={{ position: 'relative' }}>
                    <Inbox size={24} color={activePage === 'requests' ? PURPLE : '#94A3B8'} />
                    <View style={styles.navBadge}><Text style={styles.navBadgeText}>2</Text></View>
                  </View>
                  <Text style={[styles.navItemText, activePage === 'requests' && styles.navItemTextActive]}>Requests</Text>
                </TouchableOpacity>

                <View style={styles.centerBtnWrapper}>
                  <TouchableOpacity style={styles.centerPlusBtn} onPress={() => setPlusMenuOpen(!plusMenuOpen)}>
                    <Plus size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navItem} onPress={() => { closeMenu(); setActivePage('campaigns'); }}>
                  <Megaphone size={24} color={activePage === 'campaigns' ? PURPLE : '#94A3B8'} />
                  <Text style={[styles.navItemText, activePage === 'campaigns' && styles.navItemTextActive]}>Campaigns</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => { closeMenu(); setActivePage('profile'); }}>
                  <User size={24} color={activePage === 'profile' ? PURPLE : '#94A3B8'} />
                  <Text style={[styles.navItemText, activePage === 'profile' && styles.navItemTextActive]}>Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1, flexDirection: 'column' },

  topNav: { height: 70, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, width: 300 },
  searchText: { color: '#94A3B8', marginLeft: 8, fontSize: 14 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 8, position: 'relative' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#fff' },

  mobileBar: { height: 60, backgroundColor: NAVY, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  mobileMenuBtn: { padding: 8, marginLeft: -8 },
  mobileLogoContainer: { flexDirection: 'row', alignItems: 'center' },
  mobileLogoIconBox: { backgroundColor: 'transparent', borderRadius: 8, padding: 4, marginRight: 8 },
  mobileLogoText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  mobileRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mobileIconBtn: { padding: 4, position: 'relative' },
  mobileNotificationDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: NAVY },
  mobileAvatarBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' },

  pageArea: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 18, color: '#94A3B8' },

  // Bottom Navigation
  bottomNavWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 },
  bottomNav: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 20, paddingTop: 10, paddingHorizontal: 10, justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemText: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '600' },
  navItemTextActive: { color: PURPLE, fontWeight: 'bold' },
  navBadge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#EF4444', borderRadius: 10, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1, borderColor: '#FFF' },
  navBadgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

  centerBtnWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerPlusBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },

  floatingMenu: { position: 'absolute', bottom: 100, left: 16, right: 16, flexDirection: 'row', justifyContent: 'center', gap: 12, zIndex: 100 },
  floatingMenuItem: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  floatingMenuIconBox: { backgroundColor: '#E0F2FE', width: 28, height: 28, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  floatingMenuText: { fontSize: 13, fontWeight: 'bold', color: NAVY },
});
