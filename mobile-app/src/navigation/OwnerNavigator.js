import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessDashboardScreen from '../screens/owner/BusinessDashboardScreen';

const Stack = createNativeStackNavigator();

export default function OwnerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BusinessDashboard" 
        component={BusinessDashboardScreen} 
        options={{ title: 'Owner Dashboard' }} 
      />
    </Stack.Navigator>
  );
}
