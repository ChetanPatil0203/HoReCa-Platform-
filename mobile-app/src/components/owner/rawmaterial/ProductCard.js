import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Heart, ShoppingCart, Star } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

export default function ProductCard({ product, onAddToCart }) {
  const [isFav, setIsFav] = useState(false);

  return (
    <View style={styles.card}>
      {/* Image Area */}
      <View style={[styles.imageBox, { backgroundColor: product.bg }]}>
        <Text style={styles.emoji}>{product.emoji}</Text>

        {/* Badge */}
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: product.badgeColor }]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        {/* Favourite */}
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => setIsFav(!isFav)}
          activeOpacity={0.7}
        >
          <Heart
            size={14}
            color={isFav ? '#EF4444' : '#94A3B8'}
            fill={isFav ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.vendorName} numberOfLines={1}>{product.vendor}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Star size={11} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.moqText}>• MOQ: {product.moq}</Text>
        </View>

        {/* Price + Cart */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.unit}>{product.unit}</Text>
          </View>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => onAddToCart && onAddToCart(product)}
            activeOpacity={0.8}
          >
            <ShoppingCart size={13} color="#fff" />
            <Text style={styles.cartBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginRight: 14,
    ...Platform.select({ web: { boxShadow: '0 2px 12px rgba(0,0,0,0.05)' } }),
  },
  imageBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 52,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } }),
  },
  info: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  vendorName: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  moqText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  unit: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  cartBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});
