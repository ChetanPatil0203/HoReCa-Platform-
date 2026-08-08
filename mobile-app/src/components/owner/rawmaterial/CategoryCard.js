import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(category)}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <View style={styles.emojiBox}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginRight: 16,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 34,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A', // Solid professional black/dark text
    textAlign: 'center',
    lineHeight: 15,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
});
