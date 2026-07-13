import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OwnerDashboard from '../screens/owner/OwnerDashboard';

const Stack = createNativeStackNavigator();

export default function OwnerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="OwnerDashboard" 
        component={OwnerDashboard} 
      />
    </Stack.Navigator>
  );
}
