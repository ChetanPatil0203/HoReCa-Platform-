import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderDashboardScreen from '../screens/serviceProvider/ProviderDashboardScreen';

const Stack = createNativeStackNavigator();

export default function ServiceProviderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProviderDashboard" 
        component={ProviderDashboardScreen} 
        options={{ title: 'Service Provider Dashboard' }} 
      />
    </Stack.Navigator>
  );
}
