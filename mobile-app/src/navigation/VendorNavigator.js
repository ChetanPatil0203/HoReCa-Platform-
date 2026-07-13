import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorDashboard from '../screens/vendor/VendorDashboard';

const Stack = createNativeStackNavigator();

export default function VendorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="VendorDashboard"
        component={VendorDashboard}
      />
    </Stack.Navigator>
  );
}
