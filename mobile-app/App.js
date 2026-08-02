import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { checkBackendHealth } from './src/services/api.service';
import { View, Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/auth/SplashScreen';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(`
    input::-ms-reveal,
    input::-ms-clear {
      display: none !important;
    }
  `));
  document.head.appendChild(style);
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

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
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        )}
      </AuthProvider>
    </SafeAreaProvider>
  );
}
