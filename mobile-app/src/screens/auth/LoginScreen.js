import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Button 
        title="Login as Hotel/Restaurant Owner" 
        onPress={() => login('owner', 'mock-jwt-token')} 
      />
      <View style={styles.spacing} />
      <Button 
        title="Login as Vendor" 
        onPress={() => login('vendor', 'mock-jwt-token')} 
      />
      <View style={styles.spacing} />
      <Button 
        title="Login as Service Provider" 
        onPress={() => login('serviceProvider', 'mock-jwt-token')} 
      />
      <View style={styles.spacing} />
      <Button 
        title="Login as Manpower Agent" 
        onPress={() => login('manpower', 'mock-jwt-token')} 
      />
      <View style={styles.spacing} />
      <Button 
        title="Login as Marketing Partner" 
        onPress={() => login('marketing', 'mock-jwt-token')} 
      />
      <View style={styles.spacing} />
      <Button 
        title="Login as Super Admin (Legacy Support)" 
        onPress={() => login('admin', 'mock-jwt-token')} 
      />
      <View style={styles.spacing} />
      <Button 
        title="Go to Register Screen" 
        onPress={() => navigation.navigate('Register')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  spacing: {
    height: 10,
  },
});

export default LoginScreen;
