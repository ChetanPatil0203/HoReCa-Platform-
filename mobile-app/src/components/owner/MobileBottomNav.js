import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LayoutDashboard, ShoppingCart, Truck, User } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const TABS = [
  { key: "dashboard", label: "Home", icon: LayoutDashboard },
  { key: "marketplace", label: "Marketplace", icon: ShoppingCart },
  { key: "order-tracking", label: "Tracking", icon: Truck },
  { key: "profile", label: "Profile", icon: User },
];

export default function MobileBottomNav({ activePage, onNavigate }) {
  const MARKET_SUBS = ["raw-material", "manpower", "service", "marketing"];

  return (
    <View style={styles.container}>
      {TABS.map((item) => {
        const Icon = item.icon;
        
        // Marketplace tab should remain active if any of its sub-categories are active
        const isActive = item.key === "marketplace"
          ? activePage === "marketplace" || MARKET_SUBS.includes(activePage)
          : activePage === item.key;

        return (
          <TouchableOpacity 
            key={item.key} 
            style={styles.tabItem} 
            onPress={() => onNavigate(item.key)}
          >
            <Icon 
              size={18} 
              color={isActive ? colors.primary : colors.muted} 
              strokeWidth={isActive ? 2.5 : 1.8} 
            />
            <Text style={[
              styles.tabLabel, 
              { color: isActive ? colors.primary : colors.muted }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  }
});
