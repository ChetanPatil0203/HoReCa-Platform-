import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, SafeAreaView, useWindowDimensions } from 'react-native';
import { X, LogOut } from 'lucide-react-native';

export default function RoleBasedMobileDrawer({
  activePage,
  onNavigate,
  isMobile,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
  navItems = [],
  bottomNavItems = [],
  profile = { initials: '', name: '', role: '', badge: '' },
  panelTitle = "VENDOR OPERATIONS"
}) {
  const { height } = useWindowDimensions();
  const isShortScreen = height < 700;

  const handleSelect = (id) => {
    if (onNavigate) {
      onNavigate(id);
    }
    if (isMobile && setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const NavBtn = ({ item }) => {
    const Icon = item.icon;
    const isActive = activePage === item.key;

    return (
      <TouchableOpacity
        style={[
          styles.navBtn,
          isActive && styles.navBtnActive,
          isShortScreen && { paddingVertical: 6, height: 44, marginBottom: 2 }
        ]}
        onPress={() => handleSelect(item.key)}
      >
        <View style={[styles.navIconBox, isActive && styles.navIconBoxActive]}>
          {Icon && <Icon size={20} color={isActive ? "#D4AF37" : "#B8C6E3"} strokeWidth={1.5} />}
        </View>
        <Text style={[styles.navText, isActive && styles.navTextActive]} numberOfLines={1}>
          {item.label}
        </Text>

        {item.exclusive && !isActive && (
          <View style={styles.rawBadge}>
            <Text style={styles.rawBadgeText}>RAW</Text>
          </View>
        )}
        {item.badge && !item.exclusive && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>{item.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const SidebarContent = () => (
    <SafeAreaView style={[styles.sidebarInner, isShortScreen && { padding: 12, paddingTop: Platform.OS === 'ios' ? 30 : 12 }]}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Brand Header */}
        <View style={[styles.brandHeader, isShortScreen && { paddingBottom: 8, gap: 8 }]}>
          <Image source={require('../../assets/HoReCa_Logo.png')} style={[styles.logo, isShortScreen && { width: 28, height: 28 }]} resizeMode="cover" />
          <View style={styles.brandTextCol}>
            <Text style={[styles.brandTitle, isShortScreen && { fontSize: 14 }]}><Text style={{ color: '#D4AF37' }}>HRC</Text> HUB</Text>
            <Text style={styles.brandSubtitle}>{panelTitle}</Text>
          </View>
          {isMobile && (
            <TouchableOpacity onPress={() => setMobileMenuOpen(false)} style={styles.closeBtn}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, isShortScreen && { padding: 8, marginTop: 8, marginBottom: 8 }]}>
          <View style={[styles.avatarBox, isShortScreen && { width: 28, height: 28, borderRadius: 14 }]}>
            <Text style={styles.avatarInitials}>
              {profile.initials}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {profile.name}
            </Text>
            {!isShortScreen && (
              <Text style={styles.profileRole} numberOfLines={1}>
                {profile.role}
              </Text>
            )}
          </View>
          <View style={styles.vendorBadge}>
            <Text style={styles.vendorBadgeText}>{profile.badge}</Text>
          </View>
        </View>

        {/* Nav List */}
        <View style={styles.scrollWrapper}>
          <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
            {navItems.map((item) => <NavBtn key={item.key} item={item} />)}
          </ScrollView>
        </View>
      </View>

      {/* Bottom Nav */}
      <View style={[styles.bottomSection, isShortScreen && { paddingTop: 6 }]}>
        {bottomNavItems.map((item) => <NavBtn key={item.key} item={item} />)}
        <TouchableOpacity style={[styles.logoutBtn, isShortScreen && { paddingVertical: 8, height: 44 }]} onPress={onLogout}>
          <LogOut size={20} color="#B8C6E3" strokeWidth={1.5} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (isMobile) {
    if (!mobileMenuOpen) return null;
    return (
      <View style={styles.mobileOverlay}>
        <TouchableOpacity style={styles.mobileBackdrop} onPress={() => setMobileMenuOpen(false)} activeOpacity={1} />
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
    width: '84%', maxWidth: 320, backgroundColor: '#081A3A', height: '100%',
  },
  sidebarInner: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
  },
  topSection: {
    flex: 1,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  logo: {
    width: 34, height: 34, borderRadius: 6,
  },
  brandTextCol: {
    flex: 1, flexDirection: 'column',
  },
  brandTitle: {
    color: '#fff', fontSize: 16, fontWeight: '500', letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  brandSubtitle: {
    color: '#D4AF37', fontSize: 8, fontWeight: 'bold', letterSpacing: 1, marginTop: 2, textTransform: 'uppercase'
  },
  closeBtn: { padding: 4 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10,
    backgroundColor: 'rgba(16, 42, 86, 0.45)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.5)', borderRadius: 12,
    marginTop: 12, marginBottom: 12,
    height: 68,
  },
  avatarBox: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#FDFBF7',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: {
    color: '#081A3A', fontSize: 11, fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1, justifyContent: 'center',
  },
  profileName: {
    color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 2,
  },
  profileRole: {
    color: '#B8C6E3', fontSize: 10, letterSpacing: 0.2,
  },
  vendorBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: '#081A3A',
    borderWidth: 1, borderColor: '#D4AF37',
  },
  vendorBadgeText: {
    color: '#D4AF37', fontSize: 7, fontWeight: 'bold', letterSpacing: 0.5, textTransform: 'uppercase'
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, marginBottom: 4, borderLeftWidth: 3, borderLeftColor: 'transparent',
    height: 48,
  },
  navBtnActive: {
    backgroundColor: 'rgba(16, 42, 86, 0.6)', borderLeftColor: '#D4AF37',
  },
  navIconBox: {
    width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  navIconBoxActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  navText: {
    flex: 1, color: '#B8C6E3', fontSize: 14, fontWeight: '500', letterSpacing: 0.2,
  },
  navTextActive: {
    color: '#fff',
  },
  rawBadge: {
    paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
  },
  rawBadgeText: {
    color: '#D4AF37', fontSize: 8, fontWeight: 'bold',
  },
  alertBadge: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
  },
  alertBadgeText: {
    color: '#fff', fontSize: 9, fontWeight: 'bold',
  },
  bottomSection: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 10, gap: 2,
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10,
    height: 48,
  },
  logoutText: {
    color: '#B8C6E3', fontSize: 14, fontWeight: '500', marginLeft: 12, letterSpacing: 0.2,
  }
});
