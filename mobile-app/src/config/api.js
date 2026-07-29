import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the host IP for dev API calls.
 * Auto-detects Expo packager host URI, browser hostname, or script URL.
 */
export const getHostIp = () => {
  // 1. Web Environment: Use current browser hostname
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      return window.location.hostname;
    }
    return 'localhost';
  }

  // 2. Expo Packager Host URI (Auto-updated by Expo start every time!)
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.developer?.tool;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }

  // 3. React Native SourceCode Script URL
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
    if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
      return match[1];
    }
  }

  // 4. Android Emulator default host loopback
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  // 5. Fallback for iOS Simulator / Localhost
  return 'localhost';
};

const localIp = getHostIp();
const DEV_URL = `http://${localIp}:5000/api`;

// Live Server URL for production (Update this when your backend is hosted online)
const PROD_URL = 'https://api.hrchub.com/api';

// __DEV__ is true when running locally via Expo, and false when the app is published
export const API_BASE_URL = __DEV__ ? DEV_URL : PROD_URL;
