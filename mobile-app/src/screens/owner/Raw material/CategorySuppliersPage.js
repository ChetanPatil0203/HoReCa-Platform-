import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions, Platform } from 'react-native';
import { ArrowLeft, Search, Star, Clock, MapPin, BadgeCheck, ChevronRight, Store } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { SUPPLIERS } from '../../../constants/rawMaterialData';

const GOLD = '#D97706';
const PURPLE = '#D97706';
const NAVY = '#0F172A';
const GREEN = '#10B981';

const FILTERS = ['All Suppliers', 'Fast Delivery', 'Top Rated', 'Low Minimum Order'];

export default function CategorySuppliersPage({ category, onBack, onSupplierPress }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Suppliers');

  const filteredSuppliers = useMemo(() => {
    let list = SUPPLIERS.filter(s => 
      s.categories.includes(category.id) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    );

    if (activeFilter === 'Fast Delivery') {
      list = list.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));
    } else if (activeFilter === 'Top Rated') {
      list = list.sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === 'Low Minimum Order') {
      list = list.sort((a, b) => a.minOrder - b.minOrder);
    }

    return list;
  }, [search, category, activeFilter]);

  const getTagsForSupplier = (id) => {
    switch (id) {
      case 'sup1': return ['Fresh Stock', 'Same Day Delivery'];
      case 'sup2': return ['Bulk Orders', 'Best Price'];
      case 'sup3': return ['Fresh Stock', 'Trusted Supplier'];
      default: return ['Trusted Supplier'];
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <View>
            <Text style={styles.pageTitle}>{category.label}</Text>
            <Text style={styles.pageSubtitle}>Choose from trusted suppliers</Text>
          </View>
          <View style={[styles.categoryIconBg, { backgroundColor: category.bg || '#F0FDF4' }]}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          </View>
        </View>
      </View>

      {/* SEARCH & FILTER */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search suppliers..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {FILTERS.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* SUPPLIER LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.listContent, !isMobile && styles.listContentWeb]}>
        {filteredSuppliers.length === 0 ? (
          <View style={styles.emptyState}>
            <Store size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No suppliers found</Text>
            <Text style={styles.emptySub}>Try adjusting your search or filters.</Text>
          </View>
        ) : (
          filteredSuppliers.map(supplier => {
            const tags = getTagsForSupplier(supplier.id);
            return (
              <TouchableOpacity 
                key={supplier.id} 
                style={styles.supplierCard}
                activeOpacity={0.7}
                onPress={() => onSupplierPress(supplier)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.supplierInfo}>
                    <View style={[styles.avatar, { backgroundColor: supplier.bg }]}>
                      <Text style={[styles.avatarText, { color: supplier.color }]}>{supplier.initials}</Text>
                    </View>
                    <View style={styles.supplierTextCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.supplierName} numberOfLines={1}>{supplier.name}</Text>
                        {supplier.verified && <BadgeCheck size={16} color="#0EA5E9" style={{ marginLeft: 4 }} />}
                      </View>
                      <View style={styles.ratingRow}>
                        <Star size={14} color={GOLD} fill={GOLD} />
                        <Text style={styles.ratingText}><Text style={styles.ratingBold}>{supplier.rating}</Text> ({supplier.reviews} reviews)</Text>
                      </View>
                    </View>
                  </View>
                  {supplier.wholesale && (
                    <View style={styles.wholesaleBadge}>
                      <Text style={styles.wholesaleText}>Wholesale Prices</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.detailText}>{supplier.location}</Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#64748B" />
                    <Text style={styles.detailText}>{supplier.deliveryTime}</Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.minOrderText}>Min. Order ₹{supplier.minOrder}</Text>
                  </View>
                </View>

                <View style={styles.tagsRow}>
                  {tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.ctaBtn} onPress={() => onSupplierPress(supplier)}>
                    <Text style={styles.ctaText}>View Supplier</Text>
                    <ChevronRight size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 16,
  },
  headerMobile: { paddingHorizontal: 16, paddingTop: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  pageSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  categoryIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  categoryEmoji: { fontSize: 20 },

  searchSection: { backgroundColor: '#fff', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: NAVY,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  
  filterScroll: { marginTop: 12 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: '#F5F3FF', borderColor: PURPLE },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: PURPLE, fontWeight: '700' },
  
  listContent: { padding: 16, paddingBottom: 40, gap: 16 },
  listContentWeb: { maxWidth: 800, alignSelf: 'center', width: '100%', paddingTop: 24 },
  
  supplierCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({ web: { boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)' } }),
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  supplierInfo: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1, paddingRight: 12 },
  avatar: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '900' },
  supplierTextCol: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  supplierName: { fontSize: 17, fontWeight: '800', color: NAVY, flexShrink: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, color: '#64748B' },
  ratingBold: { fontWeight: '700', color: NAVY },
  
  wholesaleBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#BBF7D0' },
  wholesaleText: { fontSize: 11, fontWeight: '800', color: GREEN },
  
  detailsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  detailDivider: { width: 1, height: 12, backgroundColor: '#CBD5E1', marginHorizontal: 12 },
  minOrderText: { fontSize: 13, fontWeight: '700', color: NAVY },
  
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '600', color: '#475569' },
  
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: PURPLE, height: 44, borderRadius: 10 },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#64748B' }
});
