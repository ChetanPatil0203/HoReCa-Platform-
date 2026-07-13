import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { checkBackendHealth } from './src/services/api.service';
import { View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkBackendHealth();
      } catch (error) {
        // Backend health check failed silently
      }
    };
    checkHealth();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
