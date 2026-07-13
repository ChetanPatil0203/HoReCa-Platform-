import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function SecondaryButton({ title, icon: Icon, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
      {Icon && <View style={styles.iconContainer}><Icon size={15} color={colors.dark} /></View>}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    color: colors.dark,
    fontWeight: '600',
    fontSize: 16,
  }
});
