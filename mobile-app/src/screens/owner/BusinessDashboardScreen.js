import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BusinessDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Dashboard</Text>
      <Text>Welcome, Business Owner!</Text>
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

export default BusinessDashboardScreen;
