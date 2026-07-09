import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { checkBackendHealth } from './src/services/api.service';
import { Text, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  const [healthStatus, setHealthStatus] = useState('Checking backend health...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await checkBackendHealth();
        setHealthStatus(result.message || 'Backend is healthy');
      } catch (error) {
        setHealthStatus('Backend health check failed');
      }
    };
    
    checkHealth();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <View style={{ padding: 40, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
          <Text>Backend Status: {healthStatus}</Text>
        </View>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
