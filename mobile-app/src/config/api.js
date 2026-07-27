import { Platform, NativeModules } from 'react-native';

// Fallback IP if we can't detect it dynamically (updated to your current IP)
const FALLBACK_IP = '192.168.0.110';

let localIp = FALLBACK_IP;

if (Platform.OS === 'web') {
  if (typeof window !== 'undefined') {
    localIp = window.location.hostname;
  }
} else {
  // Extract host IP dynamically from Expo packager load address
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const ipMatch = scriptURL.match(/^https?:\/\/([^:/]+)/);
    if (ipMatch && ipMatch[1]) {
      localIp = ipMatch[1];
    }
  }
}

const DEV_URL = `http://${localIp}:5000/api`;

// Live Server URL for production (Update this when your backend is hosted online)
const PROD_URL = 'https://api.hrchub.com/api'; // Example production URL

// __DEV__ is true when running locally via Expo, and false when the app is published
export const API_BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

