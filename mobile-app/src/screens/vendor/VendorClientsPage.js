import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Building2, Star } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const CLIENTS = [
  { id: "C-1", name: "The Meridian Grand", type: "Luxury Hotel", lifetime: "₹12.4L", rating: 4.9 },
  { id: "C-2", name: "Spice Route Restaurant", type: "Fine Dining", lifetime: "₹4.2L", rating: 4.7 },
  { id: "C-3", name: "Azure Palace Hotel", type: "Resort", lifetime: "₹8.9L", rating: 4.8 },
  { id: "C-4", name: "Café Zephyr Group", type: "Café Chain", lifetime: "₹1.1L", rating: 4.5 },
];

export default function VendorClientsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Building2 size={24} color="#10B981" />
          </View>
          <View>
            <Text style={styles.title}>Client Base</Text>
            <Text style={styles.subtitle}>B2B hospitality clients</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {CLIENTS.map(client => (
          <View key={client.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{client.name}</Text>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{client.rating}</Text>
              </View>
            </View>
            <Text style={styles.type}>{client.type}</Text>

            <View style={styles.metrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Lifetime Value</Text>
                <Text style={styles.metricVal}>{client.lifetime}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  list: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.03)' } }) },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#F59E0B' },
  type: { fontSize: 13, color: colors.muted, marginBottom: 16 },
  metrics: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  metricLabel: { fontSize: 11, color: colors.muted, marginBottom: 4 },
  metricVal: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
});
