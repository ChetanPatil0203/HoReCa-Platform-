import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { 
  LayoutDashboard, Activity, Truck, Users,
  DollarSign, Settings, LogOut,
  HelpCircle, X
} from 'lucide-react-native';

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "requests", label: "Requests", icon: Activity, badge: 1 },
  { key: "inventory", label: "Candidates", icon: Users },
  { key: "deliveries", label: "Deployments", icon: Truck },
  { key: "revenue", label: "Revenue", icon: DollarSign },
];

const NAV_BOTTOM = [
  { key: "support", label: "Support", icon: HelpCircle },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function ManpowerSidebar({ activePage, setActivePage, isMobile, mobileMenuOpen, setMobileMenuOpen, onLogout }) {
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
      <View style={styles.topSection}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image source={require('../../../assets/HoReCa_Logo.png')} style={styles.logo} resizeMode="cover" />
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}><Text style={{color: '#D4AF37'}}>HRC</Text> HUB</Text>
            <Text style={styles.brandSubtitle}>VENDOR OPERATIONS</Text>
            <View style={styles.separator}>
              <View style={styles.sepLine} />
              <Text style={styles.sepDiamond}>◆</Text>
              <View style={styles.sepLine} />
            </View>
          </View>
          {isMobile && (
            <TouchableOpacity onPress={() => setMobileMenuOpen(false)} style={styles.closeBtn}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Luxury Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarInitials}>EM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileThe}>The</Text>
            <Text style={styles.profileName} numberOfLines={1}>Elite Manpower</Text>
            <Text style={styles.profileRole} numberOfLines={1}>Manpower Agency</Text>
          </View>
          <View style={styles.vendorBadge}>
            <Text style={styles.vendorBadgeText}>VENDOR</Text>
          </View>
        </View>

        {/* Nav List */}
        <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {NAV.map((item) => <NavBtn key={item.key} item={item} />)}
        </ScrollView>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomSection}>
        {NAV_BOTTOM.map((item) => <NavBtn key={item.key} item={item} />)}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <LogOut size={20} color="#B8C6E3" strokeWidth={1.5} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isMobile) {
    if (!mobileMenuOpen) return null;
    return (
      <View style={styles.mobileOverlay}>
        <TouchableOpacity style={styles.mobileBackdrop} onPress={() => setMobileMenuOpen(false)} />
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
    width: 280,
    backgroundColor: '#081A3A',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'column',
    display: Platform.OS === 'web' ? 'flex' : 'none',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  mobileOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 100, flexDirection: 'row',
  },
  mobileBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mobileSidebar: {
    width: 280, backgroundColor: '#081A3A', height: '100%',
  },
  sidebarInner: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  topSection: {
    flex: 1,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  logo: {
    width: 50, height: 50, borderRadius: 8,
  },
  brandTextCol: {
    flex: 1, flexDirection: 'column',
  },
  brandTitle: {
    color: '#fff', fontSize: 18, fontWeight: '500', letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  brandSubtitle: {
    color: '#D4AF37', fontSize: 9.5, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 4,
  },
  separator: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6,
  },
  sepLine: {
    flex: 1, height: 1, backgroundColor: 'rgba(212,175,55,0.4)',
  },
  sepDiamond: {
    color: '#D4AF37', fontSize: 7, transform: [{ rotate: '45deg' }],
  },
  closeBtn: { padding: 4 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: 'rgba(16, 42, 86, 0.45)',
    borderWidth: 1, borderColor: '#D4AF37', borderRadius: 18,
    marginTop: 16, marginBottom: 16,
  },
  avatarBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FDFBF7',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: {
    color: '#081A3A', fontSize: 12, fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1, justifyContent: 'center',
  },
  profileThe: {
    color: '#D4AF37', fontSize: 15, fontStyle: 'italic', marginBottom: -2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  profileName: {
    color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 2,
  },
  profileRole: {
    color: '#B8C6E3', fontSize: 9, letterSpacing: 0.5,
  },
  vendorBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: '#081A3A',
    borderWidth: 1, borderColor: '#D4AF37',
  },
  vendorBadgeText: {
    color: '#D4AF37', fontSize: 8, fontWeight: 'bold', letterSpacing: 0.8,
  },
  scrollArea: {
    flex: 1, marginTop: 8,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 16, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: 'transparent',
  },
  navBtnActive: {
    backgroundColor: 'rgba(16, 42, 86, 0.6)', borderLeftColor: '#D4AF37',
  },
  navIconBox: {
    width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  navIconBoxActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  navText: {
    flex: 1, color: '#B8C6E3', fontSize: 13, fontWeight: '500', letterSpacing: 0.5,
  },
  navTextActive: {
    color: '#fff',
  },
  alertBadge: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
  },
  alertBadgeText: {
    color: '#fff', fontSize: 10, fontWeight: 'bold',
  },
  bottomSection: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 16, gap: 6,
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
  },
  logoutText: {
    color: '#B8C6E3', fontSize: 13, fontWeight: '500', marginLeft: 16, letterSpacing: 0.5,
  }
});
