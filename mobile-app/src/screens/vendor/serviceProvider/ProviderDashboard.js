import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { Menu, Bell, Search, User, LayoutDashboard, Activity, Wrench, Briefcase, Users, DollarSign, HelpCircle, Settings } from 'lucide-react-native';
import RoleBasedMobileDrawer from '../../../components/navigation/RoleBasedMobileDrawer';
import { AuthContext } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

import ProviderDashboardHome from './ProviderDashboardHome';
import ProviderRequestsPage from './ProviderRequestsPage';
import ProviderServicesPage from './ProviderServicesPage';
import ProviderJobsPage from './ProviderJobsPage';
import ProviderTeamPage from './ProviderTeamPage';
import ProviderRevenuePage from './ProviderRevenuePage';

// Supporting Pages
import ProviderNotificationsPage from './ProviderNotificationsPage';
import ProviderSupportPage from './ProviderSupportPage';
import ProviderSettingsPage from './ProviderSettingsPage';

export default function ProviderDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <ProviderDashboardHome />;
      case "requests":
        return <ProviderRequestsPage />;
      case "services":
        return <ProviderServicesPage />;
      case "jobs":
        return <ProviderJobsPage />;
      case "team":
        return <ProviderTeamPage />;
      case "revenue":
        return <ProviderRevenuePage />;
      case "notifications":
        return <ProviderNotificationsPage />;
      case "support":
        return <ProviderSupportPage />;
      case "settings":
        return <ProviderSettingsPage />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Requests", icon: Activity, badge: 2 },
    { key: "services", label: "Services", icon: Wrench },
    { key: "jobs", label: "Jobs", icon: Briefcase },
    { key: "team", label: "Team", icon: Users },
    { key: "revenue", label: "Revenue", icon: DollarSign },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { key: "support", label: "Support", icon: HelpCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const profileData = {
    initials: "PC",
    name: "ProClean Services",
    role: "Service Provider",
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
              <Text style={styles.searchText}>Search requests, jobs...</Text>
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
    backgroundColor: '#F3F4F6',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  topNav: {
    height: 70,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    width: 300,
  },
  searchText: {
    marginLeft: 8,
    color: colors.muted,
    fontSize: 14,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 16,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: colors.danger,
    borderRadius: 4,
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
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  mobileLogoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mobileRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileIconBtn: {
    padding: 8,
    position: 'relative',
  },
  mobileNotificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#081A3A',
  },
  mobileAvatarBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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
    color: colors.sub,
  },
});
