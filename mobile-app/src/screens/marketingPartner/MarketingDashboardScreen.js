import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MarketingDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketing Partner Dashboard</Text>
      <Text>Welcome, Marketing Partner!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MarketingDashboardScreen;
