import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManpowerDashboard from '../screens/vendor/manpowerAgent/ManpowerDashboard';

const Stack = createNativeStackNavigator();

export default function ManpowerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ManpowerDashboard" 
        component={ManpowerDashboard} 
      />
    </Stack.Navigator>
  );
}
