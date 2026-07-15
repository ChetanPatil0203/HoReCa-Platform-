import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderDashboard from '../screens/vendor/serviceProvider/ProviderDashboard';

const Stack = createNativeStackNavigator();

export default function ServiceProviderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ProviderDashboard" 
        component={ProviderDashboard} 
      />
    </Stack.Navigator>
  );
}
