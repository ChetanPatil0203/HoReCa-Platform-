import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Star, MapPin, Package } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

export default function VendorCard({ vendor, onViewProducts }) {
  return (
    <View style={styles.card}>
      {/* Avatar + Badge */}
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: vendor.bg }]}>
          <Text style={[styles.initials, { color: vendor.color }]}>{vendor.initials}</Text>
        </View>
        {vendor.badge && (
          <View style={[styles.badge, { backgroundColor: vendor.badgeColor + '18', borderColor: vendor.badgeColor + '40' }]}>
            <Text style={[styles.badgeText, { color: vendor.badgeColor }]}>{vendor.badge}</Text>
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>{vendor.name}</Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <Star size={12} color="#F59E0B" fill="#F59E0B" />
        <Text style={styles.ratingText}>{vendor.rating}</Text>
      </View>

      {/* Meta */}
      <View style={styles.metaRow}>
        <MapPin size={10} color={colors.muted} />
        <Text style={styles.metaText} numberOfLines={1}>{vendor.location}</Text>
      </View>
      <View style={styles.metaRow}>
        <Package size={10} color={colors.muted} />
        <Text style={styles.metaText}>{vendor.products} products</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.viewBtn, { borderColor: vendor.color, backgroundColor: vendor.bg }]}
        onPress={() => onViewProducts && onViewProducts(vendor)}
        activeOpacity={0.8}
      >
        <Text style={[styles.viewBtnText, { color: vendor.color }]}>View Products</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginRight: 14,
    ...Platform.select({ web: { boxShadow: '0 2px 12px rgba(0,0,0,0.05)' } }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 16,
    fontWeight: '900',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  metaText: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
  },
  viewBtn: {
    marginTop: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
