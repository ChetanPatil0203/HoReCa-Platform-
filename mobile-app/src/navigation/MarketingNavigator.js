import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketingDashboard from '../screens/vendor/marketingPartner/MarketingDashboard';

const Stack = createNativeStackNavigator();

export default function MarketingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MarketingDashboard"
        component={MarketingDashboard}
      />
    </Stack.Navigator>
  );
}
