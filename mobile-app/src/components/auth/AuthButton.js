import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function AuthButton({
  title,
  onPress,
  icon: Icon,
  disabled,
  loading,
  style,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 130,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.container, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.button,
          (disabled || loading) ? styles.buttonDisabled : (pressed ? styles.buttonPressed : styles.buttonNormal),
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Text style={styles.buttonText}>{title}</Text>
            {Icon && <Icon size={20} color="#FFFFFF" style={styles.icon} />}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonNormal: {
    backgroundColor: AUTH_COLORS.primary,
  },
  buttonPressed: {
    backgroundColor: AUTH_COLORS.primaryPressed,
  },
  buttonDisabled: {
    backgroundColor: '#A0B3C6', // muted gray-blue as requested: "Disabled: Use muted blue-gray."
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  icon: {
    marginLeft: 8,
  },
});
