import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManpowerDashboardScreen from '../screens/manpowerAgent/ManpowerDashboardScreen';

const Stack = createNativeStackNavigator();

export default function ManpowerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ManpowerDashboard" 
        component={ManpowerDashboardScreen} 
        options={{ title: 'Manpower Dashboard' }} 
      />
    </Stack.Navigator>
  );
}
