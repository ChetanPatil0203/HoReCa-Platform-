import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { ArrowLeft, Star, MapPin, Truck, Box, ShieldCheck, Check, Zap } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';

const MOCK_VENDORS = [
  {
    id: 'v1',
    name: 'Metro Fresh Supplies',
    price: 38,
    rating: 4.8,
    reviews: 124,
    deliveryTime: 'Tomorrow, by 10 AM',
    moq: '20',
    stock: '250',
    gst: '5%',
    deliveryCharge: 'Free',
    returnPolicy: 'Not Returnable',
    location: 'Mumbai, MH',
    badges: ['⭐ Best Rated']
  },
  {
    id: 'v2',
    name: 'Quality Foods',
    price: 35,
    rating: 4.3,
    reviews: 89,
    deliveryTime: '2 Days',
    moq: '50',
    stock: '500',
    gst: '5%',
    deliveryCharge: '₹100',
    returnPolicy: '7 Days Return',
    location: 'Pune, MH',
    badges: ['💸 Best Price']
  },
  {
    id: 'v3',
    name: 'Shree Traders',
    price: 40,
    rating: 4.6,
    reviews: 210,
    deliveryTime: 'Today, by 6 PM',
    moq: '10',
    stock: '120',
    gst: '5%',
    deliveryCharge: '₹50',
    returnPolicy: 'Replacement Only',
    location: 'Navi Mumbai, MH',
    badges: ['⚡ Fastest Delivery']
  }
];

export default function RawMaterialComparePage({ product, qty = 1, onBack, onAddToCart, onQuote }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleContinueToCart = () => {
    if (selectedVendor && onAddToCart) {
      onAddToCart(product, selectedVendor);
    }
  };

  const handleRequestQuote = () => {
    if (selectedVendor && onQuote) {
      onQuote(product, selectedVendor);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Compare Vendors</Text>
          <Text style={styles.headerSub}>{product?.name || 'Product'} • Qty: {qty}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={isMobile ? { paddingBottom: 100 } : { paddingBottom: 40 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <View style={isMobile ? styles.cardsContainerMobile : styles.cardsContainerWeb}>
            {MOCK_VENDORS.map((vendor) => {
              const isSelected = selectedVendor?.id === vendor.id;
              
              return (
                <TouchableOpacity 
                  key={vendor.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedVendor(vendor)}
                  style={[
                    styles.vendorCard, 
                    isSelected && styles.vendorCardSelected,
                    !isMobile && { flex: 1, minWidth: 280 }
                  ]}
                >
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Check size={14} color="#fff" />
                    </View>
                  )}

                  <View style={styles.cardHeader}>
                    <Text style={styles.vendorName}>{vendor.name}</Text>
                    {vendor.badges.map(badge => (
                      <View key={badge} style={styles.highlightBadge}>
                        <Text style={styles.highlightText}>{badge}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>₹{vendor.price} <Text style={styles.priceUnit}>/ {product?.unit?.replace('per ', '') || 'kg'}</Text></Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}><Star size={14} color="#64748B" /><Text style={styles.detailLabel}>Rating</Text></View>
                      <Text style={styles.detailValue}>{vendor.rating} ({vendor.reviews})</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}><Truck size={14} color="#64748B" /><Text style={styles.detailLabel}>Delivery</Text></View>
                      <Text style={styles.detailValue}>{vendor.deliveryTime}</Text>
                      <Text style={styles.detailSubValue}>{vendor.deliveryCharge}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}><Box size={14} color="#64748B" /><Text style={styles.detailLabel}>Stock & MOQ</Text></View>
                      <Text style={styles.detailValue}>Avail: {vendor.stock}</Text>
                      <Text style={styles.detailSubValue}>Min: {vendor.moq}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}><ShieldCheck size={14} color="#64748B" /><Text style={styles.detailLabel}>Policies</Text></View>
                      <Text style={styles.detailValue}>GST: {vendor.gst}</Text>
                      <Text style={styles.detailSubValue}>{vendor.returnPolicy}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}><MapPin size={14} color="#64748B" /><Text style={styles.detailLabel}>Location</Text></View>
                      <Text style={styles.detailValue}>{vendor.location}</Text>
                    </View>
                  </View>

                  <View style={[styles.selectBtn, isSelected && styles.selectBtnActive]}>
                    <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>
                      {isSelected ? 'Selected' : 'Select Vendor'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, !isMobile && styles.bottomBarWeb]}>
        {!selectedVendor ? (
          <Text style={styles.bottomInstruction}>Select a vendor to continue</Text>
        ) : (
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.quoteBtn} onPress={handleRequestQuote}>
              <Text style={styles.quoteText}>Request Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartBtn} onPress={handleContinueToCart}>
              <Text style={styles.cartBtnText}>Continue to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  
  cardsContainerMobile: { gap: 16 },
  cardsContainerWeb: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },

  vendorCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: colors.border, padding: 20, position: 'relative' },
  vendorCardSelected: { borderColor: GOLD, backgroundColor: '#FFFBEB' },
  
  selectedBadge: { position: 'absolute', top: -10, right: -10, backgroundColor: GOLD, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff', zIndex: 10 },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  vendorName: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1, marginRight: 8 },
  highlightBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#FDE68A' },
  highlightText: { fontSize: 11, fontWeight: '800', color: GOLD },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  priceLabel: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  priceValue: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  priceUnit: { fontSize: 14, fontWeight: '600', color: '#64748B' },

  divider: { height: 1, backgroundColor: colors.border, marginBottom: 16 },

  detailGrid: { gap: 16, marginBottom: 24 },
  detailItem: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' },
  detailLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 120 },
  detailLabel: { fontSize: 13, color: '#475569', fontWeight: '500' },
  detailValue: { fontSize: 13, fontWeight: '700', color: '#0F172A', textAlign: 'right', flex: 1 },
  detailSubValue: { fontSize: 12, color: '#64748B', textAlign: 'right', width: '100%', marginTop: 2 },

  selectBtn: { width: '100%', paddingVertical: 12, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  selectBtnActive: { backgroundColor: GOLD, borderColor: GOLD },
  selectBtnText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  selectBtnTextActive: { color: '#fff' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  bottomBarWeb: { paddingBottom: 16 },
  bottomInstruction: { fontSize: 14, fontWeight: '600', color: '#64748B', paddingVertical: 12 },
  
  actionBtns: { flexDirection: 'row', gap: 12, width: '100%', maxWidth: 500 },
  quoteBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: GOLD, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFBEB' },
  quoteText: { fontSize: 15, fontWeight: '700', color: GOLD },
  cartBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center' },
  cartBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' }
});
