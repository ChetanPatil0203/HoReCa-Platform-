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

const getAuthenticatedScreen = (userRole) => {
  switch (userRole) {
    case 'owner':
      return <Stack.Screen name="OwnerFlow" component={OwnerNavigator} />;
    case 'vendor':
      return <Stack.Screen name="VendorFlow" component={VendorNavigator} />;
    case 'serviceProvider':
      return <Stack.Screen name="ServiceProviderFlow" component={ServiceProviderNavigator} />;
    case 'manpower':
      return <Stack.Screen name="ManpowerFlow" component={ManpowerNavigator} />;
    case 'marketing':
      return <Stack.Screen name="MarketingFlow" component={MarketingNavigator} />;
    case 'admin':
    case 'superadmin':
      return <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />;
    default:
      return <Stack.Screen name="Auth" component={AuthNavigator} />;
  }
};

export default function RootNavigator() {
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
      {userToken === null
        ? <Stack.Screen name="Auth" component={AuthNavigator} />
        : getAuthenticatedScreen(userRole)
      }
    </Stack.Navigator>
  );
}
