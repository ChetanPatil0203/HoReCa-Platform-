import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions, Platform } from 'react-native';
import { ArrowLeft, ShoppingCart, ShieldCheck, Heart, Minus, Plus, Info } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

export default function ProductDetailsPage({ product, cartItems = [], onCartUpdate, onBack, onViewCart }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [isFav, setIsFav] = useState(false);

  const existingCartItem = cartItems.find(item => item.id === product.id);
  const initialQty = existingCartItem ? existingCartItem.qty : product.moq;
  const [qty, setQty] = useState(initialQty);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleDecrease = () => {
    if (qty > product.moq) setQty(qty - 1);
  };
  
  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleAddToCart = () => {
    onCartUpdate(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty } : item);
      } else {
        return [...prev, { ...product, qty }];
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setIsFav(!isFav)}>
            <Heart size={20} color={isFav ? '#EF4444' : '#0F172A'} fill={isFav ? '#EF4444' : 'transparent'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn} onPress={onViewCart} activeOpacity={0.8}>
            <ShoppingCart size={18} color="#0F172A" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        <View style={styles.content}>
          <View style={styles.supplierBadge}>
            <ShieldCheck size={14} color="#0EA5E9" />
            <Text style={styles.supplierText}>Sold by {product.supplierName}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.priceText}>₹{product.price}<Text style={styles.unitText}> / {product.unit}</Text></Text>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Minimum Order</Text>
              <Text style={styles.detailValue}>{product.moq} {product.unit}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quality Grade</Text>
              <Text style={styles.detailValue}>{product.quality}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Origin</Text>
              <Text style={styles.detailValue}>{product.origin}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shelf Life</Text>
              <Text style={styles.detailValue}>{product.shelfLife}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.detailLabel}>Available Stock</Text>
              <Text style={[styles.detailValue, { color: '#059669' }]}>{product.stock} {product.unit} In Stock</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.qtySelector}>
          <TouchableOpacity 
            style={[styles.qtyBtn, qty <= product.moq && styles.qtyBtnDisabled]} 
            onPress={handleDecrease}
            disabled={qty <= product.moq}
          >
            <Minus size={18} color={qty <= product.moq ? '#94A3B8' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={handleIncrease}>
            <Plus size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>{existingCartItem ? 'Update Cart' : 'Add to Cart'}</Text>
          <Text style={styles.totalPriceText}>₹{product.price * qty}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerMobile: { paddingHorizontal: 16, paddingTop: 12 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff' },

  imageContainer: { width: '100%', height: 280, backgroundColor: '#E2E8F0' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  content: { padding: 20 },
  supplierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  supplierText: { fontSize: 12, fontWeight: '600', color: '#0369A1' },
  
  productName: { fontSize: 24, fontWeight: '900', color: '#0F172A', marginBottom: 8 },
  priceText: { fontSize: 22, fontWeight: '800', color: '#D97706', marginBottom: 24 },
  unitText: { fontSize: 14, fontWeight: '500', color: '#64748B' },

  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#0F172A', fontWeight: '600' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  descriptionText: { fontSize: 14, color: '#475569', lineHeight: 22 },

  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...Platform.select({ web: { boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' } }),
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
  },
  qtyBtn: { width: 44, height: 48, alignItems: 'center', justifyContent: 'center' },
  qtyBtnDisabled: { opacity: 0.5 },
  qtyText: { fontSize: 16, fontWeight: '700', color: '#0F172A', minWidth: 32, textAlign: 'center' },
  
  addToCartBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#D97706',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  addToCartText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  totalPriceText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
