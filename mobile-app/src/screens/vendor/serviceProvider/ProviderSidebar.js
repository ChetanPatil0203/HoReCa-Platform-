import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { 
  LayoutDashboard, Activity, Wrench, Briefcase,
  Users, DollarSign, Bell, HelpCircle, Settings, LogOut,
  X
} from 'lucide-react-native';

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "requests", label: "Requests", icon: Activity, badge: 2 },
  { key: "services", label: "Services", icon: Wrench },
  { key: "jobs", label: "Jobs", icon: Briefcase },
  { key: "team", label: "Team", icon: Users },
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const NAV_BOTTOM = [
  { key: "support", label: "Support", icon: HelpCircle },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function ProviderSidebar({ activePage, setActivePage, isMobile, mobileMenuOpen, setMobileMenuOpen, onLogout }) {
  const handleSelect = (id) => {
    setActivePage(id);
    if (isMobile) setMobileMenuOpen(false);
  };

  const NavBtn = ({ item }) => {
    const Icon = item.icon;
    const isActive = activePage === item.key;
    return (
      <TouchableOpacity
        style={[styles.navBtn, isActive && styles.navBtnActive]}
        onPress={() => handleSelect(item.key)}
      >
        <View style={[styles.navIconBox, isActive && styles.navIconBoxActive]}>
          <Icon size={20} color={isActive ? "#D4AF37" : "#B8C6E3"} strokeWidth={1.5} />
        </View>
        <Text style={[styles.navText, isActive && styles.navTextActive]} numberOfLines={1}>
          {item.label}
        </Text>
        
        {item.badge && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>{item.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const SidebarContent = () => (
    <View style={styles.sidebarInner}>
      {/* Header Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIconBox}>
          <Image source={require('../../../assets/HoReCa_Logo.png')} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
        </View>
        <Text style={styles.logoText}>
          HRC<Text style={{ color: '#D4AF37' }}>HUB</Text>
        </Text>
        {isMobile && (
          <TouchableOpacity style={styles.closeBtn} onPress={() => setMobileMenuOpen(false)}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.roleTag}>SERVICE PROVIDER</Text>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.navGroup}>
          <Text style={styles.groupTitle}>MENU</Text>
          {NAV.map(item => <NavBtn key={item.key} item={item} />)}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {NAV_BOTTOM.map(item => <NavBtn key={item.key} item={item} />)}
        <TouchableOpacity style={styles.navBtn} onPress={onLogout}>
          <View style={styles.navIconBox}>
            <LogOut size={20} color="#EF4444" strokeWidth={1.5} />
          </View>
          <Text style={[styles.navText, { color: '#EF4444' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isMobile) {
    if (!mobileMenuOpen) return null;
    return (
      <View style={styles.mobileOverlay}>
        <TouchableOpacity 
          style={styles.mobileOverlayBg} 
          activeOpacity={1} 
          onPress={() => setMobileMenuOpen(false)}
        />
        <View style={styles.mobileSidebar}>
          <SidebarContent />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.desktopSidebar}>
      <SidebarContent />
    </View>
  );
}

const styles = StyleSheet.create({
  desktopSidebar: {
    width: 260,
    backgroundColor: '#081A3A',
    height: '100%',
  },
  mobileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    flexDirection: 'row',
  },
  mobileOverlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mobileSidebar: {
    width: 280,
    backgroundColor: '#081A3A',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sidebarInner: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  logoIconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    flex: 1,
  },
  roleTag: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
  },
  navGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  navBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRightWidth: 3,
    borderRightColor: '#D4AF37',
  },
  navIconBox: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  navIconBoxActive: {
  },
  navText: {
    color: '#B8C6E3',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  navTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  alertBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  alertBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  }
});
