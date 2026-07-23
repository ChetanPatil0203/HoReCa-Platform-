import React, { createContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Dimensions } from 'react-native';
import { LogOut } from 'lucide-react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [vendorType, setVendorType] = useState('raw-material');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const login = (role, token, type = 'raw-material') => {
    setIsLoading(true);
    setUserToken(token);
    setUserRole(role);
    setVendorType(type);
    setIsLoading(false);
  };

  const logout = () => {
    // Open confirmation modal instead of immediately logging out
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsLoading(true);
    setUserToken(null);
    setUserRole(null);
    setVendorType('raw-material');
    setShowLogoutModal(false);
    setIsLoading(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, userRole, vendorType }}>
      {children}
      
      {/* Global Logout Confirmation Modal */}
      <Modal 
        visible={showLogoutModal} 
        transparent 
        animationType="fade" 
        onRequestClose={cancelLogout}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.iconContainer}>
              <View style={styles.iconBg}>
                <LogOut size={28} color="#EF4444" style={{ marginLeft: 4 }} />
              </View>
            </View>
            
            <Text style={styles.title}>Logout?</Text>
            <Text style={styles.subtitle}>
              Are you sure you want to logout of your account?
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={cancelLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={confirmLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
      </Modal>
    </AuthContext.Provider>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center'
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#071B3A',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 10
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  cancelText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#071B3A'
  },
  logoutButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF'
  }
});
