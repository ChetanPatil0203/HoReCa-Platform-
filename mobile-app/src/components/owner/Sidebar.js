import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { LayoutDashboard, Package, Users, Wrench, Megaphone, BarChart2, Clock, User, Settings, LogOut, HelpCircle, ShoppingCart, Truck, ShieldCheck } from 'lucide-react-native';
import { typography } from '../../theme/typography';

const NAV_PRIMARY = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "raw-material", label: "Raw Material", icon: Package },
  { key: "manpower", label: "Manpower", icon: Users },
  { key: "service", label: "Service Providers", icon: Wrench },
  { key: "marketing", label: "Marketing", icon: Megaphone },
  { key: "compliance", label: "Compliance", icon: ShieldCheck },
  { key: "order-tracking", label: "Order Tracking", icon: Truck },
  { key: "history", label: "History", icon: Clock },
  { key: "analytics", label: "Analytics", icon: BarChart2 },
];

const NAV_BOTTOM = [
  { key: "support", label: "Support", icon: HelpCircle },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activePage, onNavigate, onLogout, user }) {
  const renderNavItem = (item) => {
    const isActive = activePage === item.key;
    const Icon = item.icon;
    
    return (
      <TouchableOpacity 
        key={item.key}
        style={[
          styles.navItem,
          isActive && styles.navItemActive
        ]}
        onPress={() => onNavigate(item.key)}
      >
        {isActive && <View style={styles.activeGlowLine} />}
        <Icon size={20} color={isActive ? '#D4AF37' : '#B8C6E3'} style={{ marginLeft: isActive ? 12 : 16 }} />
        <Text style={[
          styles.navLabel,
          isActive && styles.navLabelActive
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sidebarContainer}>
      
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandIconBox}>
          <Image source={require('../../assets/HoReCa_Logo.png')} style={{width: 32, height: 32, resizeMode: 'contain'}} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitle}>
            <Text style={{ color: '#D4AF37' }}>HRC</Text> HUB
          </Text>
          <Text style={styles.brandSubtitle}>OWNER OPERATIONS</Text>
          
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <View style={styles.diamond} />
            <View style={styles.separatorLine} />
          </View>
        </View>
      </View>

      {/* Hotel Card */}
      <View style={styles.hotelCard}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'O'}</Text>
        </View>
        <View style={styles.hotelInfo}>
          <Text style={styles.hotelPrefix}>The</Text>
          <Text style={styles.hotelName} numberOfLines={1}>{user?.businessName || 'Business'}</Text>
          <Text style={styles.hotelSub} numberOfLines={1}>Premium Hospitality Partner</Text>
        </View>
        <View style={styles.badgeBox}>
          <Text style={styles.badgeText}>{user?.businessType?.toUpperCase() || 'HOTEL'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollNav} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {NAV_PRIMARY.map(renderNavItem)}
      </ScrollView>

      {/* Bottom Nav Actions */}
      <View style={styles.bottomSection}>
        {NAV_BOTTOM.map(renderNavItem)}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <LogOut size={20} color="#B8C6E3" style={{ marginLeft: 16 }} />
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 280,
    backgroundColor: '#081A3A',
    height: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
    ...Platform.select({
      web: { boxShadow: '10px 0 30px rgba(0,0,0,0.25)' }
    }),
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  brandIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 4,
  },
  hotelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 42, 86, 0.45)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 18,
    padding: 12,
    marginBottom: 20,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDFBF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#081A3A',
  },
  hotelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hotelPrefix: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#D4AF37',
  },
  hotelName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  hotelSub: {
    fontSize: 9,
    color: '#B8C6E3',
  },
  badgeBox: {
    backgroundColor: '#081A3A',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  scrollNav: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 6,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: 'rgba(16, 42, 86, 0.6)',
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
  },
  activeGlowLine: {
    position: 'absolute',
    left: -3, // overlaps border
    top: '20%',
    height: '60%',
    width: 3,
    backgroundColor: '#D4AF37',
    ...Platform.select({
      web: { boxShadow: '0 0 8px #D4AF37' }
    }),
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B8C6E3',
    marginLeft: 16,
  },
  navLabelActive: {
    color: '#fff',
  },
  bottomSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  logoutLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B8C6E3',
    marginLeft: 16,
  }
});
