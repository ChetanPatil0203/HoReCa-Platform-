import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import {
  LayoutDashboard, Mail, Megaphone, Briefcase,
  DollarSign, Bell, Settings, LogOut,
  HelpCircle, X, FolderOpen
} from 'lucide-react-native';

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "requests", label: "Requests", icon: Mail },
  { key: "campaigns", label: "Campaigns", icon: Megaphone },
  { key: "portfolio", label: "Portfolio", icon: FolderOpen },
  { key: "team", label: "Team", icon: Briefcase },
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const NAV_BOTTOM = [
  { key: "support", label: "Support", icon: HelpCircle },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function MarketingSidebar({ activePage, setActivePage, isMobile, mobileMenuOpen, setMobileMenuOpen, onLogout }) {
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
            <Text style={styles.brandTitle}><Text style={{ color: '#D4AF37' }}>HRC</Text> HUB</Text>
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
            <Text style={styles.avatarInitials}>BC</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileThe}>The</Text>
            <Text style={styles.profileName} numberOfLines={1}>BrandCraft</Text>
            <Text style={styles.profileRole} numberOfLines={1}>Marketing Agency</Text>
          </View>
          <View style={styles.vendorBadge}>
            <Text style={styles.vendorBadgeText}>AGENCY</Text>
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
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
  },
  mobileSidebar: {
    width: 280, backgroundColor: '#081A3A',
  },
  sidebarInner: {
    flex: 1, justifyContent: 'space-between',
  },
  topSection: {
    flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  brandHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
  },
  logo: {
    width: 44, height: 44, marginRight: 12,
  },
  brandTextCol: {
    flex: 1,
  },
  brandTitle: {
    color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1,
  },
  brandSubtitle: {
    color: '#8A99B5', fontSize: 9, fontWeight: '600', letterSpacing: 1.5, marginTop: 2,
  },
  separator: {
    flexDirection: 'row', alignItems: 'center', marginTop: 6, opacity: 0.5,
  },
  sepLine: {
    flex: 1, height: 1, backgroundColor: '#D4AF37',
  },
  sepDiamond: {
    color: '#D4AF37', fontSize: 8, marginHorizontal: 4,
  },
  closeBtn: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarBox: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarInitials: {
    color: '#D4AF37', fontSize: 16, fontWeight: '800',
  },
  profileThe: {
    color: '#8A99B5', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1,
  },
  profileName: {
    color: '#fff', fontSize: 18, fontWeight: '700', marginVertical: 2,
  },
  profileRole: {
    color: '#D4AF37', fontSize: 12, fontWeight: '500',
  },
  vendorBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4,
  },
  vendorBadgeText: {
    color: '#fff', fontSize: 8, fontWeight: 'bold', letterSpacing: 1,
  },
  scrollArea: {
    flex: 1,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 10, marginBottom: 4,
  },
  navBtnActive: {
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  navIconBox: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  navIconBoxActive: {
    backgroundColor: 'rgba(212,175,55,0.2)',
  },
  navText: {
    color: '#B8C6E3', fontSize: 14, fontWeight: '500', flex: 1,
  },
  navTextActive: {
    color: '#D4AF37', fontWeight: '700',
  },
  bottomSection: {
    padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, marginTop: 4,
  },
  logoutText: {
    color: '#EF4444', fontSize: 14, fontWeight: '500', marginLeft: 12,
  },
});
