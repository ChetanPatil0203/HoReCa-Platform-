import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, Switch
} from 'react-native';
import { 
  Wrench, Zap, CheckCircle, XCircle, Search, 
  Filter, Plus, Edit, IndianRupee, Clock, MapPin, AlertTriangle
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SUMMARY_DATA = [
  { label: "Total Services", value: "24", icon: Wrench, color: "#3B82F6", bg: "#DBEAFE" },
  { label: "Active", value: "18", icon: CheckCircle, color: "#10B981", bg: "#D1FAE5" },
  { label: "Inactive", value: "6", icon: XCircle, color: "#94A3B8", bg: "#F1F5F9" },
  { label: "Emergency", value: "4", icon: Zap, color: "#EF4444", bg: "#FEE2E2" },
];

const MOCK_SERVICES = [
  {
    id: "SRV-01",
    name: "AC Deep Cleaning & Service",
    category: "HVAC",
    description: "Comprehensive deep cleaning of filters, coils, and drain pipes for Split and Window ACs.",
    startingPrice: "₹1,200",
    visitCharge: "₹300",
    duration: "1.5 Hours",
    warranty: "30 Days",
    coverage: "Mumbai City & Suburbs",
    isEmergency: false,
    isActive: true,
  },
  {
    id: "SRV-02",
    name: "Commercial Oven Repair",
    category: "Commercial Kitchen",
    description: "Diagnosis and repair of commercial convection and deck ovens.",
    startingPrice: "₹2,500",
    visitCharge: "₹500",
    duration: "2-4 Hours",
    warranty: "6 Months on parts",
    coverage: "Mumbai (All)",
    isEmergency: true,
    isActive: true,
  },
  {
    id: "SRV-03",
    name: "Grease Trap Cleaning",
    category: "Plumbing",
    description: "Deep cleaning and unclogging of commercial grease traps.",
    startingPrice: "₹3,000",
    visitCharge: "₹0",
    duration: "3 Hours",
    warranty: "N/A",
    coverage: "South Mumbai",
    isEmergency: false,
    isActive: false,
  }
];

export default function ProviderServicesPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [services, setServices] = useState(MOCK_SERVICES);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    startingPrice: '',
    visitCharge: '',
    duration: '',
    warranty: '',
    coverage: '',
    isEmergency: false,
    isActive: true,
  });

  const handleOpenForm = (service = null) => {
    if (service) {
      setEditingService(service);
      setForm({ ...service });
    } else {
      setEditingService(null);
      setForm({
        name: '', category: '', description: '', startingPrice: '',
        visitCharge: '', duration: '', warranty: '', coverage: '',
        isEmergency: false, isActive: true,
      });
    }
    setFormModalVisible(true);
  };

  const handleSaveService = () => {
    // In a real app, API call goes here
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...form, id: s.id } : s));
    } else {
      const newService = { ...form, id: `SRV-${Math.floor(Math.random() * 1000)}` };
      setServices([newService, ...services]);
    }
    setFormModalVisible(false);
  };

  const toggleServiceStatus = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const renderSummaryCard = ({ item }) => {
    const Icon = item.icon;
    return (
      <View style={[styles.summaryCard, { width: (width - 48) / 2 }]}>
        <View style={styles.summaryTop}>
          <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
            <Icon size={20} color={item.color} />
          </View>
          <Text style={styles.summaryValue}>{item.value}</Text>
        </View>
        <Text style={styles.summaryLabel}>{item.label}</Text>
      </View>
    );
  };

  const renderServiceCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceCategory}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, item.isActive ? styles.statusActive : styles.statusInactive]}>
          <Text style={[styles.statusText, item.isActive ? styles.statusTextActive : styles.statusTextInactive]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailGrid}>
          <View style={styles.detailGridBox}>
            <Text style={styles.detailLabel}>Starting Price</Text>
            <View style={styles.detailValueRow}>
              <IndianRupee size={14} color={NAVY} />
              <Text style={styles.detailValue}>{item.startingPrice}</Text>
            </View>
          </View>
          <View style={styles.detailGridBox}>
            <Text style={styles.detailLabel}>Visit Charge</Text>
            <View style={styles.detailValueRow}>
              <IndianRupee size={14} color="#64748B" />
              <Text style={[styles.detailValue, { color: '#475569' }]}>{item.visitCharge}</Text>
            </View>
          </View>
          <View style={styles.detailGridBox}>
            <Text style={styles.detailLabel}>Duration</Text>
            <View style={styles.detailValueRow}>
              <Clock size={14} color="#64748B" />
              <Text style={[styles.detailValue, { color: '#475569', marginLeft: 4 }]}>{item.duration}</Text>
            </View>
          </View>
          <View style={styles.detailGridBox}>
            <Text style={styles.detailLabel}>Warranty</Text>
            <View style={styles.detailValueRow}>
              <CheckCircle size={14} color="#64748B" />
              <Text style={[styles.detailValue, { color: '#475569', marginLeft: 4 }]}>{item.warranty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.coverageRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.coverageText}>Coverage: {item.coverage}</Text>
        </View>
        
        {item.isEmergency && (
          <View style={styles.emergencyRow}>
            <Zap size={14} color="#EF4444" />
            <Text style={styles.emergencyText}>Available for Emergency Service</Text>
          </View>
        )}
      </View>

      <View style={[styles.cardFooter, isSmallScreen && { flexDirection: 'column' }]}>
        <View style={[styles.actionBtns, isSmallScreen && { width: '100%', marginBottom: 8 }]}>
          <TouchableOpacity 
            style={[styles.btnOutline, { flex: 1, marginRight: 8 }]} 
            onPress={() => toggleServiceStatus(item.id)}
          >
            <Text style={[styles.btnOutlineText, item.isActive ? { color: '#EF4444' } : { color: '#10B981' }]}>
              {item.isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.actionBtns, isSmallScreen && { width: '100%' }]}>
          <TouchableOpacity style={[styles.btnPrimary, { flex: 1 }]} onPress={() => handleOpenForm(item)}>
            <Edit size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.btnPrimaryText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Services Catalog</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Summary Section */}
          <View style={styles.summarySection}>
            <FlatList
              data={SUMMARY_DATA}
              keyExtractor={(item) => item.label}
              renderItem={renderSummaryCard}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.summaryRow}
            />
          </View>

          {/* List Section */}
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>All Services</Text>
            </View>
            
            {services.map(item => (
              <React.Fragment key={item.id}>
                {renderServiceCard({ item })}
              </React.Fragment>
            ))}

            {services.length === 0 && (
              <View style={styles.emptyState}>
                <Wrench size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>No services found. Add one to get started.</Text>
              </View>
            )}
            
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => handleOpenForm()}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Add/Edit Form Modal */}
        <Modal visible={formModalVisible} animationType="slide" transparent={true}>
          <KeyboardAvoidingView 
            style={styles.modalOverlay} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{editingService ? 'Edit Service' : 'Add New Service'}</Text>
                <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.inputLabel}>Service Name</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. AC Deep Cleaning" 
                  value={form.name}
                  onChangeText={(t) => setForm({...form, name: t})}
                />

                <Text style={styles.inputLabel}>Category</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. HVAC, Plumbing" 
                  value={form.category}
                  onChangeText={(t) => setForm({...form, category: t})}
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput 
                  style={styles.textArea} 
                  placeholder="Briefly describe what this service includes..." 
                  multiline
                  numberOfLines={3}
                  value={form.description}
                  onChangeText={(t) => setForm({...form, description: t})}
                />

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Starting Price</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. ₹1,200" 
                      value={form.startingPrice}
                      onChangeText={(t) => setForm({...form, startingPrice: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Visit Charge</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. ₹300" 
                      value={form.visitCharge}
                      onChangeText={(t) => setForm({...form, visitCharge: t})}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Est. Duration</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. 2 Hours" 
                      value={form.duration}
                      onChangeText={(t) => setForm({...form, duration: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Warranty</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. 30 Days" 
                      value={form.warranty}
                      onChangeText={(t) => setForm({...form, warranty: t})}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Coverage Area</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Mumbai City & Suburbs" 
                  value={form.coverage}
                  onChangeText={(t) => setForm({...form, coverage: t})}
                />

                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.switchLabel}>Emergency Availability</Text>
                    <Text style={styles.switchSubLabel}>Can be requested 24/7 for urgent needs</Text>
                  </View>
                  <Switch 
                    value={form.isEmergency} 
                    onValueChange={(val) => setForm({...form, isEmergency: val})} 
                    trackColor={{ false: '#CBD5E1', true: '#3B82F6' }}
                  />
                </View>

                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.switchLabel}>Active Status</Text>
                    <Text style={styles.switchSubLabel}>Make this service visible to clients</Text>
                  </View>
                  <Switch 
                    value={form.isActive} 
                    onValueChange={(val) => setForm({...form, isActive: val})} 
                    trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                  />
                </View>

                <TouchableOpacity style={styles.btnPrimaryLarge} onPress={handleSaveService}>
                  <Text style={styles.btnPrimaryLargeText}>Save Service</Text>
                </TouchableOpacity>
                <View style={{height: 40}}/>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 8,
  },
  summarySection: {
    padding: 16,
    paddingBottom: 0,
  },
  summaryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  listSection: {
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusTextActive: {
    color: '#10B981',
  },
  statusTextInactive: {
    color: '#64748B',
  },
  cardBody: {
    marginBottom: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  detailGridBox: {
    width: '50%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: NAVY,
    marginLeft: 2,
  },
  coverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coverageText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#475569',
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  emergencyText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionBtns: {
    flexDirection: 'row',
    flex: 1,
  },
  btnOutline: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    fontWeight: '600',
    fontSize: 13,
  },
  btnPrimary: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: NAVY,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  sheetBody: {
    padding: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formCol: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  switchSubLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  btnPrimaryLarge: {
    backgroundColor: NAVY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
