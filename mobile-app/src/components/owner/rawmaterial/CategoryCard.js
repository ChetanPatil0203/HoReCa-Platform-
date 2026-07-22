import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: category.bg, borderColor: category.color + '30' }]}
      onPress={() => onPress && onPress(category)}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <View style={[styles.emojiBox, { backgroundColor: category.color + '18' }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={[styles.label, { color: category.color }]} numberOfLines={2}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
    ...Platform.select({ web: { cursor: 'pointer', transition: 'transform 0.15s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' } }),
  },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
  },
});
