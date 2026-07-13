import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, Image as ImageIcon, CheckCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

export default function ServiceReviewPage({ onBack, onHome }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color="#16A34A" style={{ marginBottom: 24 }} />
          <Text style={styles.successTitle}>Review Submitted</Text>
          <Text style={styles.successDesc}>Thank you for your feedback! It helps maintain our service quality.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onHome}>
            <Text style={styles.primaryBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Write a Review</Text>
          <Text style={styles.pageSubtitle}>Rate Elite Fixers for BKG-84729</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          <View style={styles.formCard}>
            
            <Text style={styles.label}>Rate the Service</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star size={32} color={star <= rating ? GOLD : '#CBD5E1'} fill={star <= rating ? GOLD : 'transparent'} style={{ marginRight: 8 }} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Comment</Text>
              <View style={[styles.inputWrapper, { height: 120, alignItems: 'flex-start', paddingVertical: 12 }]}>
                <TextInput 
                  style={[styles.input, { height: '100%', textAlignVertical: 'top' }]} 
                  placeholder="Share your experience..." 
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={comment}
                  onChangeText={setComment}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload Images (Optional)</Text>
              <View style={styles.uploadBox}>
                <ImageIcon size={24} color="#64748B" style={{ marginBottom: 8 }} />
                <Text style={styles.uploadText}>Click to upload images</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={() => setIsSubmitted(true)}>
              <Text style={styles.submitBtnText}>Submit Review</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 600, alignSelf: 'center', width: '100%' },

  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  
  starsRow: { flexDirection: 'row', marginBottom: 24 },
  
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 8 },
  inputWrapper: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 12 },
  input: { flex: 1, fontSize: 15, color: '#0F172A', outlineStyle: 'none' },

  uploadBox: { height: 100, borderRadius: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  uploadText: { fontSize: 13, color: '#64748B' },

  submitBtn: { height: 48, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 12, textAlign: 'center' },
  successDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', maxWidth: 300, marginBottom: 32 },
  primaryBtn: { height: 48, paddingHorizontal: 32, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});
