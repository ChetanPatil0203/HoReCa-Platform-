import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProviderDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provider Dashboard</Text>
      <Text>Welcome, Provider!</Text>
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

export default ProviderDashboardScreen;
