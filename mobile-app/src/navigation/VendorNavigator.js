import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorDashboardScreen from '../screens/vendor/VendorDashboardScreen';

const Stack = createNativeStackNavigator();

export default function VendorNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="VendorDashboard" 
        component={VendorDashboardScreen} 
        options={{ title: 'Vendor Dashboard' }} 
      />
    </Stack.Navigator>
  );
}
