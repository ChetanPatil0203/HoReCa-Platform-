import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RawMaterialDashboard from '../screens/vendor/rawMaterialVendor/RawMaterialDashboard';

const Stack = createNativeStackNavigator();

export default function VendorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="VendorDashboard"
        component={RawMaterialDashboard}
      />
    </Stack.Navigator>
  );
}
