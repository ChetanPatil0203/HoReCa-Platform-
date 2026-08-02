import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions, ScrollView, TouchableOpacity, Text, Platform, Image, Modal, TouchableWithoutFeedback, Alert, FlatList, Animated } from 'react-native';
import { Menu, ArrowLeft, Bell, ChefHat, LayoutDashboard, Package, Users, Wrench, Megaphone, BarChart2, Clock, Truck, Settings, CircleHelp as HelpCircle, ChevronDown, LogOut, User, ShieldCheck, X, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { fetchOwnerRequirements, fetchRawMaterialOrders } from '../../services/api.service';

import RoleBasedMobileDrawer from '../../components/navigation/RoleBasedMobileDrawer';
import Topbar from '../../components/owner/Topbar';
import MobileBottomNav from '../../components/owner/MobileBottomNav';

// Pages
import DashboardHome from './DashboardHome';
import RawMaterialPage from './Raw material/RawMaterialPage';
import ManpowerPage from './manpower/ManpowerPage';
import ServicePage from './ServicePage';
import MarketingPage from './marketing/MarketingPage';
import OrderTrackingPage from './Raw material/OrderTrackingPage';
import HistoryPage from './HistoryPage';
import AnalyticsPage from './AnalyticsPage';
import SupplierMarketplace from './Raw material/SupplierMarketplace';
import MarketplacePillarsPage from './Raw material/MarketplacePillarsPage';
import ProfileSettingsPage from './ProfileSettingsPage';
import CompliancePage from './compliance/CompliancePage';
import HelpAndSupportScreen from '../../components/common/HelpAndSupportScreen';
import DocumentsKycScreen from '../common/DocumentsKycScreen';
import HRCSupportBot from '../../components/owner/chatbot/HRCSupportBot';

// Placeholder for missing pages
const PlaceholderPage = ({ title }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 18, color: colors.muted }}>{title} - Under Construction</Text>
  </View>
);

const PAGE_TITLES = {
  "dashboard": "Dashboard Overview",
  "marketplace": "Marketplace Pillars",
  "raw-material": "Raw Material Procurement",
  "manpower": "Manpower Dispatch",
  "service": "Facilities & Services",
  "marketing": "Growth & Marketing",
  "compliance": "Compliance & Licensing",
  "order-tracking": "Active Logs Tracking",
  "history": "Procurement History",
  "analytics": "Business Intelligence Analytics",
  "profile": "Executive Profile",
  "settings": "Account Control Panel",
  "support": "Help & Support Desk",
};

export default function OwnerDashboard() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { user: ctxUser, logout } = useContext(AuthContext);
  const user = ctxUser || { name: "", businessName: "", businessType: "" };

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setImageError(false);
  }, [user?.profilePhoto]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  useEffect(() => {
    const loadLiveNotifications = async () => {
      const ownerId = user?.id || user?.registration?.id || 'OWNER-DEMO-001';
      try {
        const [reqRes, ordRes] = await Promise.all([
          fetchOwnerRequirements(ownerId).catch(() => []),
          fetchRawMaterialOrders(ownerId).catch(() => [])
        ]);

        const list = [];
        const reqList = reqRes?.data || reqRes || [];
        const ordList = ordRes?.data || ordRes || [];

        if (Array.isArray(reqList)) {
          reqList.forEach((req, idx) => {
            const hasResponses = req.supplierId || (req.extraData && req.extraData.responseCount > 0);
            list.push({
              id: `req-${req.id || idx}`,
              type: req.type ? req.type.toUpperCase() : 'REQUIREMENT',
              title: `${hasResponses ? 'Response Received' : 'Requirement Active'}: ${req.title || 'Requirement'}`,
              message: `Requirement "${req.title}" is in ${req.status || 'active'} state. Location: ${req.location || 'N/A'}.`,
              time: req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              isRead: !hasResponses,
              color: req.type === 'manpower' ? '#9333EA' : req.type === 'marketing' ? '#8B5CF6' : '#2563EB'
            });
          });
        }

        if (Array.isArray(ordList)) {
          ordList.forEach((ord, idx) => {
            const statusText = ord.status === 'confirmed' ? 'Order Confirmed' : ord.status === 'shipped' ? 'Out for Delivery' : ord.status === 'delivered' ? 'Order Delivered' : `Order ${ord.status}`;
            list.push({
              id: `ord-${ord.id || idx}`,
              type: 'RAW MATERIAL',
              title: `Order Status: ${statusText}`,
              message: `Order #${(ord.id || '').toString().slice(-4).toUpperCase()} from ${ord.supplier?.bizName || 'Supplier'} is ${ord.status}. Total: ₹${parseFloat(ord.totalAmount || 0).toLocaleString('en-IN')}.`,
              time: ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              isRead: ord.status === 'delivered',
              color: '#D97706'
            });
          });
        }

        setNotifications(list);
      } catch (err) {
        console.warn('Error loading live owner notifications:', err);
      }
    };

    loadLiveNotifications();
    const interval = setInterval(loadLiveNotifications, 4000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome user={user} onNavigate={setActivePage} />;
      case "marketplace":
        return <MarketplacePillarsPage onNavigate={setActivePage} setMobileMenuOpen={setMobileMenuOpen} />;
      case "raw-material":
        return <RawMaterialPage onNavigate={setActivePage} />;
      case "manpower":
        return <ManpowerPage />;
      case "service":
        return <ServicePage />;
      case "marketing":
        return <MarketingPage />;
      case "compliance":
        return <CompliancePage />;
      case "documentsKyc":
      case "documents-kyc":
        return <DocumentsKycScreen onBack={() => setActivePage('settings')} />;
      case "order-tracking":
        return <OrderTrackingPage />;
      case "history":
        return <HistoryPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "profile":
      case "settings":
        return <ProfileSettingsPage user={user} onNavigate={setActivePage} />;
      case "support":
        return <HelpAndSupportScreen />;
      default:
        return <PlaceholderPage title={PAGE_TITLES[activePage] || activePage} />;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "raw-material", label: "Raw Material", icon: Package },
    { key: "manpower", label: "Manpower", icon: Users },
    { key: "service", label: "Service Providers", icon: Wrench },
    { key: "marketing", label: "Marketing", icon: Megaphone },
    { key: "compliance", label: "Compliance", icon: ShieldCheck },
    { key: "history", label: "History", icon: Clock },
    { key: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  const bottomNavItems = [
    { key: "support", label: "Support", icon: HelpCircle },
    { key: "settings", label: "Profile & Settings", icon: Settings },
  ];

  const profileData = {
    initials: user?.name ? user.name.substring(0, 2).toUpperCase() : (user?.email ? user.email.substring(0, 2).toUpperCase() : "U"),
    name: user?.name || user?.email || "User",
    role: user?.businessType || "Business Owner",
    badge: "OWNER"
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <RoleBasedMobileDrawer
          activePage={activePage}
          onNavigate={setActivePage}
          isMobile={!isLargeScreen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={logout}
          navItems={navItems}
          bottomNavItems={bottomNavItems}
          profile={profileData}
          panelTitle="ADMIN OPERATIONS"
        />

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Desktop/Tablet Topbar */}
          {isLargeScreen && (
            <Topbar
              activePage={activePage}
              title={PAGE_TITLES[activePage]}
              user={user}
            />
          )}

          {/* Mobile Bar */}
          {!isLargeScreen && (
            <View style={styles.mobileBar}>
              {/* LEFT */}
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  style={styles.mobileMenuBtn}
                  onPress={() => setMobileMenuOpen(true)}
                >
                  <Menu size={22} color="#fff" />
                </TouchableOpacity>
                <Image
                  source={require('../../../assets/HRCHUB_Logo.png')}
                  style={{ width: 24, height: 24, resizeMode: 'contain', marginRight: 8 }}
                />
                <View style={styles.headerLogoBox}>
                  <Text style={styles.headerLogoText}>HRC<Text style={{ color: '#F6B800' }}>HUB</Text></Text>
                  <Text style={styles.headerLogoSub}>HoReCa Business Partner</Text>
                </View>
              </View>

              {/* RIGHT */}
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIconBtn} onPress={() => setNotificationsModalOpen(true)} accessibilityRole="button" accessibilityLabel="Notifications">
                  <Bell size={20} color="#fff" />
                  {unreadCount > 0 && <View style={styles.headerBadge} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerAvatarBtn}
                  onPress={() => setProfileDropdownOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Profile menu"
                >
                  {user?.profilePhoto && !imageError ? (
                    <Image
                      source={{ uri: user.profilePhoto }}
                      style={{ width: '100%', height: '100%', borderRadius: 16 }}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Text style={styles.headerAvatarText}>
                      {(user?.businessName || user?.name || user?.registration?.bizName || 'C').charAt(0).toUpperCase()}
                    </Text>
                  )}
                  <View style={styles.onlineDot} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Live Notifications Modal */}
          <Modal
            visible={notificationsModalOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setNotificationsModalOpen(false)}
          >
            <View style={styles.notifModalOverlay}>
              <View style={styles.notifModalCard}>
                <View style={styles.notifModalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Bell size={20} color="#071B3A" />
                    <Text style={styles.notifModalTitle}>Live Notifications</Text>
                    {unreadCount > 0 && (
                      <View style={styles.notifBadgeCount}>
                        <Text style={styles.notifBadgeCountText}>{unreadCount} New</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => setNotificationsModalOpen(false)}>
                    <X size={22} color="#071B3A" />
                  </TouchableOpacity>
                </View>

                {notifications.length === 0 ? (
                  <View style={styles.notifEmptyBox}>
                    <Bell size={40} color="#CBD5E1" style={{ marginBottom: 12 }} />
                    <Text style={styles.notifEmptyTitle}>No Live Notifications</Text>
                    <Text style={styles.notifEmptySub}>Updates on orders and requirements will appear here in real-time.</Text>
                  </View>
                ) : (
                  <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16, gap: 10 }}
                    renderItem={({ item }) => (
                      <View style={[styles.notifCardItem, !item.isRead && styles.notifCardItemUnread]}>
                        <View style={[styles.notifTag, { backgroundColor: item.color + '15' }]}>
                          <Text style={[styles.notifTagText, { color: item.color }]}>{item.type}</Text>
                        </View>
                        <Text style={styles.notifItemTitle}>{item.title}</Text>
                        <Text style={styles.notifItemMsg}>{item.message}</Text>
                        <Text style={styles.notifItemTime}>{item.time}</Text>
                      </View>
                    )}
                  />
                )}
              </View>
            </View>
          </Modal>

          {/* Profile Dropdown Modal */}
          <Modal
            visible={profileDropdownOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setProfileDropdownOpen(false)}
          >
            <TouchableWithoutFeedback onPress={() => setProfileDropdownOpen(false)}>
              <View style={styles.dropdownOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProfileDropdownOpen(false);
                        setActivePage("profile");
                      }}
                    >
                      <View style={[styles.dropdownIconBox, { backgroundColor: '#EFF6FF' }]}>
                        <User size={18} color="#2563EB" />
                      </View>
                      <View style={styles.dropdownTextWrapper}>
                        <Text style={styles.dropdownItemTitle}>Profile View</Text>
                        <Text style={styles.dropdownItemSub}>View and manage your profile</Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProfileDropdownOpen(false);
                        setLogoutModalOpen(true);
                      }}
                    >
                      <View style={[styles.dropdownIconBox, { backgroundColor: '#FEF2F2' }]}>
                        <LogOut size={18} color="#DC2626" />
                      </View>
                      <View style={styles.dropdownTextWrapper}>
                        <Text style={[styles.dropdownItemTitle, { color: '#DC2626' }]}>Logout</Text>
                        <Text style={styles.dropdownItemSub}>Sign out from account</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Custom Logout Confirmation Modal */}
          <Modal
            visible={logoutModalOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setLogoutModalOpen(false)}
          >
            <View style={styles.logoutModalOverlay}>
              <View style={styles.logoutModalCard}>
                <View style={styles.logoutIconWrapper}>
                  <LogOut size={26} color="#EF4444" />
                </View>
                <Text style={styles.logoutModalTitle}>Logout?</Text>
                <Text style={styles.logoutModalSubtitle}>Are you sure you want to logout of your account?</Text>
                
                <View style={styles.logoutModalActions}>
                  <TouchableOpacity 
                    style={styles.logoutCancelBtn} 
                    onPress={() => setLogoutModalOpen(false)}
                  >
                    <Text style={styles.logoutCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.logoutConfirmBtn} 
                    onPress={() => {
                      setLogoutModalOpen(false);
                      logout();
                    }}
                  >
                    <Text style={styles.logoutConfirmBtnText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Page Content Viewport */}
          <View style={styles.pageViewport}>
            {['marketplace', 'dashboard', 'raw-material', 'manpower', 'service', 'marketing', 'compliance', 'history', 'analytics'].includes(activePage) ? (
              renderActivePage()
            ) : (
              <ScrollView contentContainerStyle={[styles.scrollContent, !isLargeScreen && { padding: 0, paddingHorizontal: 0, paddingTop: 0, paddingBottom: 110 }]}>
                {renderActivePage()}
              </ScrollView>
            )}
          </View>

          {/* Mobile Bottom Navigation */}
          {!isLargeScreen && activePage !== 'marketplace' && (
            <MobileBottomNav
              activePage={activePage}
              onNavigate={setActivePage}
            />
          )}
 
          {/* Floating Chatbot FAB */}
          <Animated.View 
            style={[
              styles.chatbotFabContainer,
              { transform: [{ translateY: floatAnim }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.chatbotFab} 
              onPress={() => setChatbotOpen(true)}
              activeOpacity={0.85}
            >
              <Image 
                source={require('../../../assets/Chatbot.png')} 
                style={styles.chatbotFabImage} 
              />
            </TouchableOpacity>
          </Animated.View>
 
          {/* Chatbot Modal */}
          <HRCSupportBot 
            visible={chatbotOpen} 
            onClose={() => setChatbotOpen(false)}
            user={user}
            onNavigate={(page) => {
              setChatbotOpen(false);
              setActivePage(page);
            }}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E2042', // Match sidebar color behind safe area
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // Main body bg
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  pageViewport: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 100,
  },
  drawerSidebar: {
    width: 280,
    height: '100%',
    zIndex: 101,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.6)',
  },
  mobileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(7, 27, 58, 0.95)', // Premium dark navy glass
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    height: Platform.OS === 'ios' ? 90 : 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mobileMenuBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerLogoBox: {
    flexDirection: 'column',
  },
  headerLogoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerLogoSub: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  headerIconBtn: {
    padding: 4,
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#0A192F',
  },
  headerAvatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#081A3A',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0A192F',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70,
    right: 16,
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    minHeight: 44,
  },
  dropdownIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dropdownTextWrapper: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  dropdownItemSub: {
    fontSize: 10,
    color: '#64748B',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
    marginHorizontal: 8,
  },

  /* Live Notifications Modal */
  notifModalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.55)', justifyContent: 'flex-end', alignItems: 'center' },
  notifModalCard: { width: '100%', maxWidth: 500, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', flex: 1 },
  notifModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  notifModalTitle: { fontSize: 18, fontWeight: '800', color: '#071B3A' },
  notifBadgeCount: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  notifBadgeCountText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  notifEmptyBox: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  notifEmptyTitle: { fontSize: 16, fontWeight: '800', color: '#071B3A', marginBottom: 4 },
  notifEmptySub: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  notifCardItem: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  notifCardItemUnread: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  notifTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  notifTagText: { fontSize: 10, fontWeight: '800' },
  notifItemTitle: { fontSize: 14, fontWeight: '800', color: '#071B3A', marginBottom: 2 },
  notifItemMsg: { fontSize: 12, color: '#64748B', lineHeight: 16, marginBottom: 6 },
  notifItemTime: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
 
  /* Custom Logout Modal Styles */
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoutModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 10px 25px rgba(0,0,0,0.08)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 8 }
    })
  },
  logoutIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#071B3A',
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutModalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 240,
  },
  logoutModalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  logoutCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071B3A',
  },
  logoutConfirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutConfirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
 
  /* Floating Chatbot FAB Styles */
  chatbotFabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 95,
    zIndex: 99,
  },
  chatbotFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 6px 20px rgba(7, 27, 58, 0.2)' },
      ios: { shadowColor: '#071B3A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 },
      android: { elevation: 6 }
    })
  },
  chatbotFabImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    resizeMode: 'cover'
  }
});
