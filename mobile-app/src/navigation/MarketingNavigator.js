import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketingDashboardScreen from '../screens/vendor/marketingPartner/MarketingDashboardScreen';

const Stack = createNativeStackNavigator();

export default function MarketingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MarketingDashboard" 
        component={MarketingDashboardScreen} 
        options={{ title: 'Marketing Dashboard' }} 
      />
    </Stack.Navigator>
  );
}
