import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { Menu, Bell, Search, User, LayoutDashboard, Mail, Megaphone, Briefcase, DollarSign, FolderOpen, HelpCircle, Settings } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

import RoleBasedMobileDrawer from '../../../components/navigation/RoleBasedMobileDrawer';
import MarketingDashboardHome from './MarketingDashboardHome';
import MarketingRequestsScreen from './MarketingRequestsScreen';
import MarketingProposalForm from './MarketingProposalForm';
import MarketingCampaignsScreen from './MarketingCampaignsScreen';
import MarketingCreativeApprovalScreen from './MarketingCreativeApprovalScreen';
import MarketingTeamScreen from './MarketingTeamScreen';
import MarketingPortfolioScreen from './MarketingPortfolioScreen';
import MarketingRevenueScreen from './MarketingRevenueScreen';
import MarketingNotificationsScreen from './MarketingNotificationsScreen';
import MarketingSettingsScreen from './MarketingSettingsScreen';
import MarketingSupportScreen from './MarketingSupportScreen';

export default function MarketingDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

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
      case "dashboard":
        return <MarketingDashboardHome setActivePage={setActivePage} handleSendProposal={handleSendProposal} />;
      case "requests":
        return <MarketingRequestsScreen setActivePage={setActivePage} handleSendProposal={handleSendProposal} />;
      case "send_proposal":
        return <MarketingProposalForm setActivePage={setActivePage} requirement={selectedRequirement} />;
      case "campaigns":
        return <MarketingCampaignsScreen setActivePage={setActivePage} handleUploadCreative={handleUploadCreative} />;
      case "upload_creative":
        return <MarketingCreativeApprovalScreen setActivePage={setActivePage} campaign={selectedCampaign} />;
      case "team":
        return <MarketingTeamScreen setActivePage={setActivePage} />;
      case "portfolio":
        return <MarketingPortfolioScreen setActivePage={setActivePage} />;
      case "revenue":
        return <MarketingRevenueScreen setActivePage={setActivePage} />;
      case "notifications":
        return <MarketingNotificationsScreen setActivePage={setActivePage} />;
      case "settings":
        return <MarketingSettingsScreen setActivePage={setActivePage} />;
      case "support":
        return <MarketingSupportScreen setActivePage={setActivePage} />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Requests", icon: Mail },
    { key: "campaigns", label: "Campaigns", icon: Megaphone },
    { key: "portfolio", label: "Portfolio", icon: FolderOpen },
    { key: "team", label: "Team", icon: Briefcase },
    { key: "revenue", label: "Revenue", icon: DollarSign },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { key: "support", label: "Support", icon: HelpCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const profileData = {
    initials: "BC",
    name: "BrandCraft",
    role: "Marketing Agency",
    badge: "AGENCY"
  };

  return (
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
        panelTitle="VENDOR OPERATIONS"
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
              <Text style={styles.mobileLogoText}>
                HRC<Text style={{ color: '#D4AF37' }}>HUB</Text>
              </Text>
            </View>

            <View style={styles.mobileRight}>
              <TouchableOpacity style={styles.mobileIconBtn}>
                <Bell size={18} color="#fff" />
                <View style={styles.mobileNotificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileAvatarBtn}>
                <User size={16} color="#081A3A" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.topNav}>
            <View style={styles.searchBox}>
              <Search size={16} color={colors.muted} />
              <Text style={styles.searchText}>Search marketing tools...</Text>
            </View>

            <View style={styles.navRight}>
              <TouchableOpacity style={styles.iconBtn}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  topNav: {
    height: 70,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    width: 300,
  },
  searchText: {
    color: '#94A3B8',
    marginLeft: 8,
    fontSize: 14,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 8,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mobileBar: {
    height: 60,
    backgroundColor: '#081A3A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  mobileMenuBtn: {
    padding: 8,
    marginLeft: -8,
  },
  mobileLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileLogoIconBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    marginRight: 8,
  },
  mobileLogoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  mobileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mobileIconBtn: {
    padding: 4,
    position: 'relative',
  },
  mobileNotificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#081A3A',
  },
  mobileAvatarBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageArea: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#94A3B8',
  }
});
