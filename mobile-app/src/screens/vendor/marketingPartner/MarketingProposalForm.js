import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { ArrowLeft, Save, Send, AlertCircle, Calculator, ChevronDown } from 'lucide-react-native';

export default function MarketingProposalForm({ setActivePage, requirement }) {
  const req = requirement || { type: 'Online', id: 'REQ-000', client: 'Unknown' };
  const isOnline = req.type.includes('Online');
  const isOffline = req.type.includes('Offline');

  // Common Fields
  const [amount, setAmount] = useState('');
  const [strategy, setStrategy] = useState('');
  const [services, setServices] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [reporting, setReporting] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [revisionLimit, setRevisionLimit] = useState('');
  const [notes, setNotes] = useState('');

  // Online Fields
  const [platforms, setPlatforms] = useState('');
  const [socialPosts, setSocialPosts] = useState('');
  const [reels, setReels] = useState('');
  const [metaAds, setMetaAds] = useState(false);
  const [googleAds, setGoogleAds] = useState(false);
  const [seo, setSeo] = useState(false);
  const [influencer, setInfluencer] = useState(false);
  const [contentCalendar, setContentCalendar] = useState(false);
  const [estReach, setEstReach] = useState('');
  const [estLeads, setEstLeads] = useState('');
  const [adSpendExcluded, setAdSpendExcluded] = useState(true);

  // Offline Fields
  const [hoardingQty, setHoardingQty] = useState('');
  const [bannerQty, setBannerQty] = useState('');
  const [pamphletQty, setPamphletQty] = useState('');
  const [offlineOptions, setOfflineOptions] = useState('');
  const [printingIncluded, setPrintingIncluded] = useState(true);
  const [installationIncluded, setInstallationIncluded] = useState(true);
  const [locationsCovered, setLocationsCovered] = useState('');
  const [offlineAudience, setOfflineAudience] = useState('');
  const [materialSpec, setMaterialSpec] = useState('');

  const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
  const serviceCharge = parsedAmount * 0.4;
  const creativeCharge = parsedAmount * 0.3;
  const otherCharge = parsedAmount * 0.3; // Printing or Ad Mgmt
  const gst = parsedAmount * 0.18;
  const total = parsedAmount + gst;

  const handleSubmit = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Proposal submitted successfully.", ToastAndroid.SHORT);
    }
    setActivePage('requests'); // Takes back to requests/My Proposals
  };

  const handleDraft = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Draft saved.", ToastAndroid.SHORT);
    }
    setActivePage('requests');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setActivePage('dashboard')}>
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Send Proposal</Text>
          <Text style={styles.headerSub}>For {req.id} • {req.client}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Campaign Core</Text>
          
          <Text style={styles.label}>Proposed Amount (₹)</Text>
          <TextInput style={styles.input} placeholder="e.g. 50000" keyboardType="numeric" value={amount} onChangeText={setAmount} />

          <Text style={styles.label}>Campaign Strategy</Text>
          <TextInput style={styles.textArea} placeholder="Briefly explain your strategy..." multiline numberOfLines={3} value={strategy} onChangeText={setStrategy} />

          <Text style={styles.label}>Services Included</Text>
          <TextInput style={styles.input} placeholder="e.g. Design, Copywriting, Ads..." value={services} onChangeText={setServices} />
          
          <Text style={styles.label}>Deliverables</Text>
          <TextInput style={styles.textArea} placeholder="Detailed list of deliverables..." multiline numberOfLines={3} value={deliverables} onChangeText={setDeliverables} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timeline & Logistics</Text>
          <View style={styles.row}>
            <View style={styles.col}>
               <Text style={styles.label}>Duration</Text>
               <TextInput style={styles.input} placeholder="e.g. 3 Months" value={duration} onChangeText={setDuration} />
            </View>
            <View style={styles.col}>
               <Text style={styles.label}>Team Size</Text>
               <TextInput style={styles.input} placeholder="e.g. 4" keyboardType="numeric" value={teamSize} onChangeText={setTeamSize} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
               <Text style={styles.label}>Start Date</Text>
               <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={startDate} onChangeText={setStartDate} />
            </View>
            <View style={styles.col}>
               <Text style={styles.label}>Completion Date</Text>
               <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={completionDate} onChangeText={setCompletionDate} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
               <Text style={styles.label}>Reporting Freq.</Text>
               <TextInput style={styles.input} placeholder="e.g. Weekly" value={reporting} onChangeText={setReporting} />
            </View>
            <View style={styles.col}>
               <Text style={styles.label}>Revision Limit</Text>
               <TextInput style={styles.input} placeholder="e.g. 2 Rounds" value={revisionLimit} onChangeText={setRevisionLimit} />
            </View>
          </View>
          <Text style={styles.label}>Payment Terms</Text>
          <TextInput style={styles.input} placeholder="e.g. 50% Advance, 50% on Completion" value={paymentTerms} onChangeText={setPaymentTerms} />
        </View>

        {isOnline && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Online Marketing Add-ons</Text>
            <Text style={styles.label}>Platforms Covered</Text>
            <TextInput style={styles.input} placeholder="Instagram, Facebook, Google..." value={platforms} onChangeText={setPlatforms} />
            
            <View style={styles.row}>
              <View style={styles.col}>
                 <Text style={styles.label}>Social Posts</Text>
                 <TextInput style={styles.input} placeholder="Qty" keyboardType="numeric" value={socialPosts} onChangeText={setSocialPosts} />
              </View>
              <View style={styles.col}>
                 <Text style={styles.label}>Reels / Videos</Text>
                 <TextInput style={styles.input} placeholder="Qty" keyboardType="numeric" value={reels} onChangeText={setReels} />
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Meta Ads Management</Text>
              <Switch value={metaAds} onValueChange={setMetaAds} trackColor={{ true: '#071B3A' }} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Google Ads Management</Text>
              <Switch value={googleAds} onValueChange={setGoogleAds} trackColor={{ true: '#071B3A' }} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>SEO Services</Text>
              <Switch value={seo} onValueChange={setSeo} trackColor={{ true: '#071B3A' }} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Influencer Collaboration</Text>
              <Switch value={influencer} onValueChange={setInfluencer} trackColor={{ true: '#071B3A' }} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Content Calendar Prep</Text>
              <Switch value={contentCalendar} onValueChange={setContentCalendar} trackColor={{ true: '#071B3A' }} />
            </View>
            
            <View style={styles.row}>
              <View style={styles.col}>
                 <Text style={styles.label}>Est. Reach</Text>
                 <TextInput style={styles.input} placeholder="e.g. 50k" value={estReach} onChangeText={setEstReach} />
              </View>
              <View style={styles.col}>
                 <Text style={styles.label}>Est. Leads</Text>
                 <TextInput style={styles.input} placeholder="e.g. 200" value={estLeads} onChangeText={setEstLeads} />
              </View>
            </View>

            <View style={[styles.switchRow, { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 }]}>
              <View>
                <Text style={styles.switchLabel}>Ad Spend Excluded</Text>
                <Text style={styles.switchSub}>Client pays directly to ad platforms</Text>
              </View>
              <Switch value={adSpendExcluded} onValueChange={setAdSpendExcluded} trackColor={{ true: '#10B981' }} />
            </View>
          </View>
        )}

        {isOffline && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Offline Marketing Details</Text>
            
            <View style={styles.row}>
              <View style={styles.col}>
                 <Text style={styles.label}>Hoardings (Qty)</Text>
                 <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={hoardingQty} onChangeText={setHoardingQty} />
              </View>
              <View style={styles.col}>
                 <Text style={styles.label}>Banners (Qty)</Text>
                 <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={bannerQty} onChangeText={setBannerQty} />
              </View>
              <View style={styles.col}>
                 <Text style={styles.label}>Pamphlets</Text>
                 <TextInput style={styles.input} placeholder="e.g. 5000" keyboardType="numeric" value={pamphletQty} onChangeText={setPamphletQty} />
              </View>
            </View>

            <Text style={styles.label}>Other Options (Radio, Newspaper, Events)</Text>
            <TextInput style={styles.input} placeholder="Specify if any..." value={offlineOptions} onChangeText={setOfflineOptions} />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Printing Included in Quote</Text>
              <Switch value={printingIncluded} onValueChange={setPrintingIncluded} trackColor={{ true: '#10B981' }} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Installation/Distribution Included</Text>
              <Switch value={installationIncluded} onValueChange={setInstallationIncluded} trackColor={{ true: '#10B981' }} />
            </View>

            <Text style={styles.label}>Locations Covered</Text>
            <TextInput style={styles.input} placeholder="e.g. Andheri, Bandra..." value={locationsCovered} onChangeText={setLocationsCovered} />
            
            <Text style={styles.label}>Material Specification</Text>
            <TextInput style={styles.input} placeholder="e.g. 300gsm Glossy paper, Flex..." value={materialSpec} onChangeText={setMaterialSpec} />
            
            <Text style={styles.label}>Estimated Offline Audience</Text>
            <TextInput style={styles.input} placeholder="e.g. 10,000 footfall/day" value={offlineAudience} onChangeText={setOfflineAudience} />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput style={styles.textArea} placeholder="Any conditions or extra info..." multiline numberOfLines={3} value={notes} onChangeText={setNotes} />
        </View>

        {/* Calculations */}
        <View style={styles.calcCard}>
          <View style={styles.calcHeader}>
            <Calculator size={18} color="#0F172A" />
            <Text style={styles.calcTitle}>Proposal Breakdown</Text>
          </View>
          
          <View style={styles.calcRow}>
             <Text style={styles.calcLabel}>Service Charge (40%)</Text>
             <Text style={styles.calcVal}>₹{serviceCharge.toLocaleString()}</Text>
          </View>
          <View style={styles.calcRow}>
             <Text style={styles.calcLabel}>Creative Charge (30%)</Text>
             <Text style={styles.calcVal}>₹{creativeCharge.toLocaleString()}</Text>
          </View>
          <View style={styles.calcRow}>
             <Text style={styles.calcLabel}>{isOnline ? 'Ad Management (30%)' : 'Printing & Prod. (30%)'}</Text>
             <Text style={styles.calcVal}>₹{otherCharge.toLocaleString()}</Text>
          </View>
          <View style={[styles.calcRow, styles.calcDivider]}>
             <Text style={styles.calcLabel}>Subtotal</Text>
             <Text style={styles.calcVal}>₹{parsedAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.calcRow}>
             <Text style={styles.calcLabel}>GST (18%)</Text>
             <Text style={styles.calcVal}>+ ₹{gst.toLocaleString()}</Text>
          </View>
          <View style={styles.calcRow}>
             <Text style={styles.calcLabel}>Discount</Text>
             <Text style={[styles.calcVal, {color: '#10B981'}]}>- ₹0</Text>
          </View>
          
          <View style={styles.totalRow}>
             <Text style={styles.totalLabel}>Final Total</Text>
             <Text style={styles.totalVal}>₹{total.toLocaleString()}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnDraft} onPress={handleDraft}>
          <Save size={18} color="#64748B" />
          <Text style={styles.btnDraftText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
          <Send size={18} color="#fff" />
          <Text style={styles.btnSubmitText}>Submit Proposal</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    marginRight: 16, padding: 4,
  },
  headerTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
  },
  headerSub: {
    fontSize: 12, color: '#64748B', marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16, paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 16,
  },
  label: {
    fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500',
  },
  input: {
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#F8FAFC',
  },
  textArea: {
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#F8FAFC', textAlignVertical: 'top', minHeight: 80,
  },
  row: {
    flexDirection: 'row', gap: 12,
  },
  col: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14, color: '#334155', fontWeight: '500',
  },
  switchSub: {
    fontSize: 11, color: '#64748B', marginTop: 2,
  },
  calcCard: {
    backgroundColor: '#F1F5F9', borderRadius: 12, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  calcHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8,
  },
  calcTitle: {
    fontSize: 15, fontWeight: 'bold', color: '#0F172A',
  },
  calcRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,
  },
  calcDivider: {
    borderTopWidth: 1, borderTopColor: '#CBD5E1', paddingTop: 8, marginTop: 4,
  },
  calcLabel: {
    fontSize: 13, color: '#475569',
  },
  calcVal: {
    fontSize: 13, fontWeight: '500', color: '#0F172A',
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#94A3B8', paddingTop: 12, marginTop: 8,
  },
  totalLabel: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A',
  },
  totalVal: {
    fontSize: 18, fontWeight: '900', color: '#071B3A',
  },
  footer: {
    flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12,
  },
  btnDraft: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9',
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingVertical: 12, gap: 8,
  },
  btnDraftText: {
    fontSize: 14, fontWeight: 'bold', color: '#475569',
  },
  btnSubmit: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#071B3A',
    borderRadius: 8, paddingVertical: 12, gap: 8,
  },
  btnSubmitText: {
    fontSize: 14, fontWeight: 'bold', color: '#fff',
  }
});
