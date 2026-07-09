import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VendorNavigator from './VendorNavigator';
import ServiceProviderNavigator from './ServiceProviderNavigator';
import ManpowerNavigator from './ManpowerNavigator';
import MarketingNavigator from './MarketingNavigator';
import AdminDashboardScreen from '../screens/common/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken, userRole, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken === null ? (
        // Unauthenticated Flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // Authenticated Flows by Role
        <>
          {userRole === 'owner' && (
            <Stack.Screen name="OwnerFlow" component={OwnerNavigator} />
          )}
          {userRole === 'vendor' && (
            <Stack.Screen name="VendorFlow" component={VendorNavigator} />
          )}
          {userRole === 'serviceProvider' && (
            <Stack.Screen name="ServiceProviderFlow" component={ServiceProviderNavigator} />
          )}
          {userRole === 'manpower' && (
            <Stack.Screen name="ManpowerFlow" component={ManpowerNavigator} />
          )}
          {userRole === 'marketing' && (
            <Stack.Screen name="MarketingFlow" component={MarketingNavigator} />
          )}
          {userRole === 'admin' && (
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}
