import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterStepOneScreen from '../screens/auth/RegisterStepOneScreen';
import RegisterStepTwoScreen from '../screens/auth/RegisterStepTwoScreen';
import RegisterStepThreeScreen from '../screens/auth/RegisterStepThreeScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterStepOne" component={RegisterStepOneScreen} />
      <Stack.Screen name="RegisterStepTwo" component={RegisterStepTwoScreen} />
      <Stack.Screen name="RegisterStepThree" component={RegisterStepThreeScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
