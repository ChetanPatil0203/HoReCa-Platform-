import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { Menu, Bell, Search, User, ChefHat, ArrowLeft } from 'lucide-react-native';
import VendorSidebar from '../../components/vendor/VendorSidebar';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

import VendorDashboardHome from './VendorDashboardHome';
import VendorRequestsPage from './VendorRequestsPage';
import VendorDeliveriesPage from './VendorDeliveriesPage';
import VendorClientsPage from './VendorClientsPage';
import VendorRevenuePage from './VendorRevenuePage';
import VendorInventoryPage from './VendorInventoryPage';
import FeedWallPage from './FeedWallPage';

export default function VendorDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { logout, vendorType } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard": return <VendorDashboardHome />;
      case "requests":
        return vendorType === 'raw-material' ? <VendorRequestsPage /> : <FeedWallPage />;
      case "deliveries": return <VendorDeliveriesPage />;
      case "clients": return <VendorClientsPage />;
      case "revenue": return <VendorRevenuePage />;
      case "inventory": return <VendorInventoryPage />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  return (
    <View style={styles.container}>
      <VendorSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={logout}
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
                <Image source={require('../../assets/HoReCa_Logo.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
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
              <Text style={styles.searchText}>Search orders, clients...</Text>
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
    backgroundColor: '#F3F4F6', // Light silver canvas for Vendor dashboard
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
  menuBtn: {
    padding: 8,
    marginLeft: -8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    width: 300,
  },
  searchText: {
    color: colors.muted,
    fontSize: 13,
    marginLeft: 8,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
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
    color: colors.muted,
    fontSize: 18,
    fontWeight: 'bold',
  },
  mobileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#081A3A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  mobileMenuBtn: {
    padding: 6,
  },
  mobileLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mobileLogoIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogoText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  mobileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mobileIconBtn: {
    padding: 6,
    position: 'relative',
  },
  mobileNotificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  mobileAvatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
