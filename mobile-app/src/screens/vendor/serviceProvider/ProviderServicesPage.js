import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert
} from 'react-native';
import { 
  Search, SlidersHorizontal, Plus, Wrench, CircleCheck, CirclePause, 
  MoreVertical, Edit, ChevronRight, Clock, CalendarClock, Trash2, Copy, FileText, CheckCircle2
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const LIGHT_BG = '#F8FAFC';
const WHITE = '#FFFFFF';

const MOCK_SERVICES = [];

export default function ProviderServicesPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const modalWidth = Math.min(width * 0.9, 560);

  const [services, setServices] = useState(MOCK_SERVICES);
  const [filterMode, setFilterMode] = useState('All'); // All, Active, Inactive
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPricingType, setSelectedPricingType] = useState('All');

  // Modals
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '', category: '', description: '', pricingType: 'Fixed Price',
    price: '', duration: '', availability: 'Available Today', status: 'Active',
    included: '', excluded: ''
  });

  const getCounts = () => {
    const active = services.filter(s => s.status === 'Active').length;
    const inactive = services.filter(s => s.status === 'Inactive').length;
    return { total: services.length, active, inactive };
  };
  const counts = getCounts();

  const filteredServices = services.filter(s => {
    if (filterMode !== 'All' && s.status !== filterMode) return false;
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (selectedPricingType !== 'All' && s.pricingType !== selectedPricingType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getStatusBadge = (status, availability) => {
    if (status === 'Inactive') return { bg: '#F1F5F9', text: '#64748B' };
    if (availability === 'Temporarily Unavailable') return { bg: '#FFEDD5', text: '#C2410C' };
    return { bg: '#DCFCE7', text: '#15803D' };
  };

  const handleOpenForm = (service = null) => {
    setActiveMenuId(null);
    if (service) {
      setEditingService(service);
      setForm({ ...service });
    } else {
      setEditingService(null);
      setForm({
        name: '', category: '', description: '', pricingType: 'Fixed Price',
        price: '', duration: '', availability: 'Available Today', status: 'Active',
        included: '', excluded: ''
      });
    }
    setFormModalVisible(true);
  };

  const handleSaveService = () => {
    if (!form.name || !form.category || !form.description || !form.pricingType || !form.duration || !form.availability) {
      alert("Please fill all required fields.");
      return;
    }
    if (['Fixed Price', 'Starting From', 'Per Hour', 'Per Visit'].includes(form.pricingType) && !form.price) {
      alert("Please enter a valid price for this pricing type.");
      return;
    }

    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...form, id: s.id } : s));
      alert("Service updated successfully.");
    } else {
      const newService = { ...form, id: `SRV-${Math.floor(Math.random() * 1000)}`, created: "Today", updated: "Today" };
      setServices([newService, ...services]);
      alert("Service added successfully.");
    }
    setFormModalVisible(false);
  };

  const handleViewDetails = (service) => {
    setActiveMenuId(null);
    setSelectedService(service);
    setDetailsModalVisible(true);
  };

  const handleSetAvailability = (service) => {
    setActiveMenuId(null);
    setSelectedService(service);
    setAvailabilityModalVisible(true);
  };

  const handleDuplicate = (service) => {
    setActiveMenuId(null);
    const duplicate = { ...service, name: `${service.name} Copy`, status: 'Inactive', id: `SRV-${Math.floor(Math.random() * 1000)}` };
    setServices([duplicate, ...services]);
    handleOpenForm(duplicate);
  };

  const handleToggleStatus = (service, activate) => {
    setActiveMenuId(null);
    if (activate) {
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, status: 'Active' } : s));
      alert("Service activated successfully.");
    } else {
      Alert.alert("Deactivate this service?", "This service will no longer appear as available to HoReCa owners.", [
        { text: "Cancel", style: "cancel" },
        { text: "Deactivate", style: "destructive", onPress: () => {
          setServices(prev => prev.map(s => s.id === service.id ? { ...s, status: 'Inactive' } : s));
          alert("Service deactivated successfully.");
        }}
      ]);
    }
  };

  const handleDelete = (service) => {
    setActiveMenuId(null);
    // Mock dependency check
    const hasDependency = service.id === 'SRV-01'; 
    if (hasDependency) {
      Alert.alert("Cannot Delete", "This service is connected to active requests or service work. Deactivate it instead.", [
        { text: "Cancel", style: "cancel" },
        { text: "Deactivate Service", onPress: () => handleToggleStatus(service, false) }
      ]);
      return;
    }
    Alert.alert("Delete this service permanently?", "", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete Service", style: "destructive", onPress: () => {
        setServices(prev => prev.filter(s => s.id !== service.id));
      }}
    ]);
  };

  const renderServiceCard = ({ item }) => {
    const sColor = getStatusBadge(item.status, item.availability);
    const displayStatus = item.status === 'Inactive' ? 'Inactive' : (item.availability === 'Temporarily Unavailable' ? 'Temporarily Unavailable' : 'Active');
    const isMenuOpen = activeMenuId === item.id;

    return (
      <View style={[styles.card, isMenuOpen && { zIndex: 999, elevation: 10 }]}>
        {/* Top Row */}
        <View style={[styles.cardHeader, isMenuOpen && { zIndex: 999 }]}>
          <View style={styles.serviceSection}>
            <View style={styles.serviceIconBox}>
              <Wrench size={20} color={NAVY} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.serviceCategory} numberOfLines={1}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.cardHeaderRight}>
            <View style={[styles.statusBadge, { backgroundColor: sColor.bg }]}>
              <Text style={[styles.statusText, { color: sColor.text }]}>{displayStatus}</Text>
            </View>
            <View style={{position: 'relative'}}>
              <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}>
                <MoreVertical size={20} color="#64748B" />
              </TouchableOpacity>
              {isMenuOpen && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSetAvailability(item)}>
                    <CalendarClock size={16} color="#64748B" />
                    <Text style={styles.dropdownText}>Set Availability</Text>
                  </TouchableOpacity>
                  {item.status === 'Active' ? (
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleToggleStatus(item, false)}>
                      <CirclePause size={16} color="#64748B" />
                      <Text style={styles.dropdownText}>Deactivate Service</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleToggleStatus(item, true)}>
                      <CircleCheck size={16} color="#64748B" />
                      <Text style={styles.dropdownText}>Activate Service</Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.dropdownDivider} />
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => handleDelete(item)}>
                    <Trash2 size={16} color="#EF4444" />
                    <Text style={[styles.dropdownText, {color: '#EF4444'}]}>Delete Service</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Middle */}
        <Text style={styles.serviceDesc} numberOfLines={2}>{item.description}</Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <Text style={styles.infoPricing}>{item.price}</Text>
          <View style={styles.infoDot} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Clock size={12} color="#64748B" />
            <Text style={styles.infoDuration}>Est: {item.duration}</Text>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.availRow}>
          <CalendarClock size={14} color={item.availability === 'Temporarily Unavailable' ? '#C2410C' : '#15803D'} />
          <Text style={[styles.availText, item.availability === 'Temporarily Unavailable' && {color: '#C2410C'}]}>{item.availability}</Text>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnViewDetails} onPress={() => handleViewDetails(item)}>
            <Text style={styles.btnViewDetailsText}>View Details</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnEditOutline} onPress={() => handleOpenForm(item)}>
            <Edit size={14} color={NAVY} style={{marginRight: 6}} />
            <Text style={styles.btnEditOutlineText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderListHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>My Services</Text>
          <Text style={styles.headerSubtitle}>Manage the professional services offered by your business</Text>
        </View>
        <TouchableOpacity style={styles.btnAddService} onPress={() => handleOpenForm()}>
          <Plus size={18} color={WHITE} style={{marginRight: 4}} />
          <Text style={styles.btnAddServiceText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {/* Overview */}
      <View style={styles.overviewContainer}>
        <Text style={styles.sectionLabel}>Service Overview</Text>
        <View style={styles.overviewCard}>
          <TouchableOpacity style={styles.overviewSegment} onPress={() => setFilterMode('All')}>
            <Text style={styles.overviewCount}>{counts.total}</Text>
            <View style={styles.overviewLabelRow}>
              <Wrench size={12} color="#3B82F6" />
              <Text style={styles.overviewLabel}>Total Services</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.overviewDivider} />
          <TouchableOpacity style={styles.overviewSegment} onPress={() => setFilterMode('Active')}>
            <Text style={styles.overviewCount}>{counts.active}</Text>
            <View style={styles.overviewLabelRow}>
              <CircleCheck size={12} color="#10B981" />
              <Text style={styles.overviewLabel}>Active</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.overviewDivider} />
          <TouchableOpacity style={styles.overviewSegment} onPress={() => setFilterMode('Inactive')}>
            <Text style={styles.overviewCount}>{counts.inactive}</Text>
            <View style={styles.overviewLabelRow}>
              <CirclePause size={12} color="#94A3B8" />
              <Text style={styles.overviewLabel}>Inactive</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filters */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748B" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search services by name or category..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
          <SlidersHorizontal size={18} color={NAVY} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.pillContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8, paddingHorizontal: 16}}>
          {['All', 'Active', 'Inactive'].map(mode => (
            <TouchableOpacity 
              key={mode} 
              style={[styles.pill, filterMode === mode && styles.pillActive]}
              onPress={() => setFilterMode(mode)}
            >
              <Text style={[styles.pillText, filterMode === mode && styles.pillTextActive]}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
        <View style={styles.container}>
          
          {/* List */}
          <FlatList
            data={filteredServices}
            keyExtractor={item => item.id}
            renderItem={renderServiceCard}
            ListHeaderComponent={renderListHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBox}>
                  {searchQuery ? <Search size={32} color="#94A3B8" /> : <Wrench size={32} color="#94A3B8" />}
                </View>
                <Text style={styles.emptyTitle}>{searchQuery ? "No matching services found" : "No services added yet"}</Text>
                <Text style={styles.emptyText}>
                  {searchQuery ? "Try changing your search or filters." : "Add the professional services your business provides."}
                </Text>
                {searchQuery ? (
                  <TouchableOpacity style={styles.btnOutlineEmpty} onPress={() => {setSearchQuery(''); setFilterMode('All');}}>
                    <Text style={styles.btnOutlineEmptyText}>Clear Filters</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btnAddServiceEmpty} onPress={() => handleOpenForm()}>
                    <Plus size={16} color={WHITE} style={{marginRight: 6}} />
                    <Text style={styles.btnAddServiceEmptyText}>Add Service</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />

          {/* Add/Edit Modal */}
          <Modal visible={formModalVisible} animationType="fade" transparent={true} onRequestClose={() => setFormModalVisible(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
              <TouchableWithoutFeedback onPress={() => setFormModalVisible(false)}>
                <View style={styles.modalOverlayCenter}>
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '84%' }]}>
                      <View style={styles.modalHeader}>
                        <View>
                          <Text style={styles.modalTitle}>{editingService ? 'Edit Service' : 'Add Service'}</Text>
                          <Text style={styles.modalSubtitle}>{editingService ? 'Update service details' : 'Add a professional service to your business profile'}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                          <XCircle size={24} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                      
                      <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                      <Text style={styles.inputLabel}>Service Name *</Text>
                      <TextInput style={styles.input} placeholder="e.g. AC Deep Cleaning" value={form.name} onChangeText={(t) => setForm({...form, name: t})} />
                      
                      <Text style={styles.inputLabel}>Service Category *</Text>
                      <TextInput style={styles.input} placeholder="e.g. Cleaning Services" value={form.category} onChangeText={(t) => setForm({...form, category: t})} />
                      
                      <Text style={styles.inputLabel}>Short Description *</Text>
                      <TextInput style={styles.textArea} placeholder="Briefly describe what this service includes..." multiline numberOfLines={3} maxLength={250} value={form.description} onChangeText={(t) => setForm({...form, description: t})} />
                      
                      <View style={styles.formRow}>
                        <View style={styles.formCol}>
                          <Text style={styles.inputLabel}>Pricing Type *</Text>
                          <TextInput style={styles.input} placeholder="e.g. Starting From" value={form.pricingType} onChangeText={(t) => setForm({...form, pricingType: t})} />
                        </View>
                        <View style={styles.formCol}>
                          <Text style={styles.inputLabel}>Price *</Text>
                          <TextInput style={styles.input} placeholder="e.g. ₹2,500" value={form.price} onChangeText={(t) => setForm({...form, price: t})} />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <View style={styles.formCol}>
                          <Text style={styles.inputLabel}>Est. Duration *</Text>
                          <TextInput style={styles.input} placeholder="e.g. 2 Hours" value={form.duration} onChangeText={(t) => setForm({...form, duration: t})} />
                        </View>
                        <View style={styles.formCol}>
                          <Text style={styles.inputLabel}>Availability *</Text>
                          <TextInput style={styles.input} placeholder="e.g. Available Today" value={form.availability} onChangeText={(t) => setForm({...form, availability: t})} />
                        </View>
                      </View>

                      <Text style={styles.inputLabel}>Included Services (Optional)</Text>
                      <TextInput style={styles.textArea} placeholder="What's included..." multiline numberOfLines={2} value={form.included} onChangeText={(t) => setForm({...form, included: t})} />
                      
                      <Text style={styles.inputLabel}>Supporting Certificate (Optional)</Text>
                      <View style={styles.uploadBox}>
                        <FileText size={20} color="#94A3B8" />
                        <Text style={styles.uploadText}>Upload certificate document</Text>
                      </View>
                      
                      <View style={{height: 20}}/>
                    </ScrollView>
                    
                    <View style={styles.modalFooterActions}>
                      <TouchableOpacity style={styles.btnModalOutline} onPress={() => setFormModalVisible(false)}>
                        <Text style={styles.btnModalOutlineText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnModalPrimary} onPress={handleSaveService}>
                        <Text style={styles.btnModalPrimaryText}>{editingService ? 'Save Changes' : 'Save Service'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>

          {/* Details Modal */}
          <Modal visible={detailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
              <View style={styles.modalOverlayCenter}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '82%' }]}>
                    <View style={styles.modalHeader}>
                      <View>
                        <Text style={styles.modalTitle}>Service Details</Text>
                        <Text style={styles.modalSubtitle}>{selectedService?.id}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                        <XCircle size={24} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                      {selectedService && (
                        <>
                          <View style={styles.modalDataBlock}>
                            <Text style={styles.modalLabel}>Service Name</Text>
                            <Text style={styles.modalValue}>{selectedService.name}</Text>
                          </View>
                          <View style={styles.modalDataBlock}>
                            <Text style={styles.modalLabel}>Category</Text>
                            <Text style={styles.modalValue}>{selectedService.category}</Text>
                          </View>
                          <View style={styles.modalDataBlock}>
                            <Text style={styles.modalLabel}>Description</Text>
                            <Text style={styles.modalDescText}>{selectedService.description}</Text>
                          </View>
                          
                          <View style={styles.modalGrid}>
                            <View style={styles.modalGridCol}>
                              <Text style={styles.modalLabel}>Pricing Type</Text>
                              <Text style={styles.modalValue}>{selectedService.pricingType}</Text>
                            </View>
                            <View style={styles.modalGridCol}>
                              <Text style={styles.modalLabel}>Price</Text>
                              <Text style={styles.modalValue}>{selectedService.price}</Text>
                            </View>
                          </View>

                          <View style={styles.modalGrid}>
                            <View style={styles.modalGridCol}>
                              <Text style={styles.modalLabel}>Est. Duration</Text>
                              <Text style={styles.modalValue}>{selectedService.duration}</Text>
                            </View>
                            <View style={styles.modalGridCol}>
                              <Text style={styles.modalLabel}>Availability</Text>
                              <Text style={styles.modalValue}>{selectedService.availability}</Text>
                            </View>
                          </View>
                          
                          {selectedService.certificate && (
                            <View style={styles.modalDataBlock}>
                              <Text style={styles.modalLabel}>Certificate</Text>
                              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                                <CheckCircle2 size={14} color="#15803D" style={{marginRight: 4}}/>
                                <Text style={[styles.modalValue, {color: '#15803D'}]}>{selectedService.certificate} (Verified)</Text>
                              </View>
                            </View>
                          )}

                          <View style={{height: 20}}/>
                        </>
                      )}
                    </ScrollView>
                    
                    <View style={styles.modalFooterActions}>
                      <TouchableOpacity style={styles.btnModalOutline} onPress={() => { setDetailsModalVisible(false); handleSetAvailability(selectedService); }}>
                        <Text style={styles.btnModalOutlineText}>Set Availability</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnModalPrimary} onPress={() => { setDetailsModalVisible(false); handleOpenForm(selectedService); }}>
                        <Text style={styles.btnModalPrimaryText}>Edit Service</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Availability Modal */}
          <Modal visible={availabilityModalVisible} animationType="fade" transparent={true} onRequestClose={() => setAvailabilityModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setAvailabilityModalVisible(false)}>
              <View style={styles.modalOverlayCenter}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={[styles.centerModalContent, { width: Math.min(width * 0.85, 400) }]}>
                    <View style={styles.modalHeader}>
                      <View>
                        <Text style={styles.modalTitle}>Set Availability</Text>
                        <Text style={styles.modalSubtitle}>{selectedService?.name}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.modalBody}>
                      {['Available Today', 'Available This Week', 'By Appointment', 'Temporarily Unavailable'].map(opt => (
                        <TouchableOpacity key={opt} style={styles.availOptionBtn} onPress={() => {
                          setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, availability: opt } : s));
                          setAvailabilityModalVisible(false);
                        }}>
                          <Text style={[styles.availOptionText, opt === 'Temporarily Unavailable' && {color: '#EF4444'}]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <View style={styles.modalFooterActions}>
                      <TouchableOpacity style={[styles.btnModalOutline, {flex: 1}]} onPress={() => setAvailabilityModalVisible(false)}>
                        <Text style={styles.btnModalOutlineText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Category/Pricing Filter Modal */}
          <Modal visible={filterModalVisible} animationType="slide" transparent={true} onRequestClose={() => setFilterModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
              <View style={styles.modalOverlayBottom}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={[styles.bottomSheet, { width: width }]}>
                    <View style={styles.sheetHeader}>
                      <Text style={styles.sheetTitle}>Filter Services</Text>
                      <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                        <XCircle size={22} color={NAVY} />
                      </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.sheetBody}>
                      <Text style={styles.inputLabel}>Service Category</Text>
                      <View style={styles.chipsContainer}>
                        {['All', 'Cleaning Services', 'Plumbing Services', 'Fire Safety Services'].map(cat => (
                          <TouchableOpacity 
                            key={cat} 
                            style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
                            onPress={() => setSelectedCategory(cat)}
                          >
                            <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>{cat}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={[styles.inputLabel, {marginTop: 16}]}>Pricing Type</Text>
                      <View style={styles.chipsContainer}>
                        {['All', 'Fixed Price', 'Starting From', 'Per Hour', 'Inspection Required'].map(pt => (
                          <TouchableOpacity 
                            key={pt} 
                            style={[styles.filterChip, selectedPricingType === pt && styles.filterChipActive]}
                            onPress={() => setSelectedPricingType(pt)}
                          >
                            <Text style={[styles.filterChipText, selectedPricingType === pt && styles.filterChipTextActive]}>{pt}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      <View style={{height: 30}}/>
                    </ScrollView>
                    
                    <View style={styles.modalFooterActions}>
                      <TouchableOpacity 
                        style={[styles.btnModalOutline, {flex: 1}]} 
                        onPress={() => {
                          setSelectedCategory('All');
                          setSelectedPricingType('All');
                          setFilterModalVisible(false);
                        }}
                      >
                        <Text style={styles.btnModalOutlineText}>Clear Filters</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.btnModalPrimary, {flex: 1.5}]} 
                        onPress={() => setFilterModalVisible(false)}
                      >
                        <Text style={styles.btnModalPrimaryText}>Apply Filters</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const XCircle = ({ size, color }) => (
  <View style={{width: size, height: size, borderRadius: size/2, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center'}}>
    <Text style={{color, fontWeight: 'bold', fontSize: size * 0.5}}>✕</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  container: { flex: 1 },
  
  // Header
  header: { 
    paddingTop: 30, paddingBottom: 16, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 16, backgroundColor: WHITE,
    borderBottomWidth: 1, borderBottomColor: '#E8EDF4',
  },
  headerLeft: { flex: 1, paddingRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  headerSubtitle: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  btnAddService: { backgroundColor: NAVY, flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 16, borderRadius: 10 },
  btnAddServiceText: { color: WHITE, fontSize: 13, fontWeight: 'bold' },

  // Overview
  overviewContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 12 },
  overviewCard: { 
    flexDirection: 'row', backgroundColor: WHITE, borderRadius: 16, 
    borderWidth: 1, borderColor: '#E6EBF2', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
    paddingVertical: 16
  },
  overviewSegment: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overviewCount: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  overviewLabelRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  overviewLabel: { fontSize: 11, fontWeight: '600', color: '#475569', marginLeft: 4 },
  overviewDivider: { width: 1, backgroundColor: '#E8EDF4', marginVertical: 4 },

  // Search & Filters
  searchFilterContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderWidth: 1, borderColor: '#E6EBF2', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY, marginLeft: 8 },
  filterBtn: { width: 44, height: 44, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E6EBF2', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  pillContainer: { paddingBottom: 16 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: NAVY, borderColor: NAVY },
  pillText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  pillTextActive: { color: WHITE },

  listContent: { paddingHorizontal: 16, paddingBottom: 115 },
  
  // Premium Card
  card: { 
    backgroundColor: WHITE, borderRadius: 16, padding: 14, marginBottom: 12, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: '#E6EBF2',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, zIndex: 10 },
  serviceSection: { flexDirection: 'row', flex: 1, paddingRight: 8 },
  serviceIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E8EDF4' },
  serviceInfo: { flex: 1, justifyContent: 'center' },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  serviceCategory: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  moreBtn: { padding: 4 },
  
  dropdownMenu: { position: 'absolute', top: 30, right: 0, backgroundColor: WHITE, borderRadius: 12, width: 190, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, zIndex: 100, borderWidth: 1, borderColor: '#E8EDF4', paddingVertical: 4 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  dropdownDivider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 8 },
  dropdownText: { fontSize: 13, color: NAVY, fontWeight: '500', marginLeft: 10 },

  serviceDesc: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 12 },
  
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoPricing: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  infoDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  infoDuration: { fontSize: 13, color: '#475569', marginLeft: 4 },
  
  availRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 14 },
  availText: { fontSize: 12, fontWeight: '600', color: '#15803D', marginLeft: 6 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E8EDF4', paddingTop: 14 },
  btnViewDetails: { flexDirection: 'row', alignItems: 'center' },
  btnViewDetailsText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 2 },
  btnEditOutline: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  btnEditOutlineText: { fontSize: 12, fontWeight: 'bold', color: NAVY },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E8EDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: NAVY, marginBottom: 8, textAlign: 'center' },
  emptyText: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  btnAddServiceEmpty: { backgroundColor: NAVY, flexDirection: 'row', alignItems: 'center', height: 44, paddingHorizontal: 20, borderRadius: 12 },
  btnAddServiceEmptyText: { color: WHITE, fontSize: 14, fontWeight: 'bold' },
  btnOutlineEmpty: { borderWidth: 1, borderColor: '#E2E8F0', height: 44, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnOutlineEmptyText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },

  // Modals
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  modalSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  
  modalBody: { flexShrink: 1 },
  modalDataBlock: { marginBottom: 16 },
  modalLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
  modalValue: { fontSize: 15, color: '#1E293B', fontWeight: '500' },
  modalDescText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  modalGrid: { flexDirection: 'row', marginBottom: 16 },
  modalGridCol: { flex: 1, paddingRight: 8 },
  
  modalFooterActions: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  btnModalOutline: { flex: 1, height: 44, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnModalOutlineText: { color: '#475569', fontWeight: 'bold', fontSize: 14 },
  btnModalPrimary: { flex: 1.5, height: 44, backgroundColor: NAVY, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnModalPrimaryText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },

  availOptionBtn: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  availOptionText: { fontSize: 15, color: NAVY, fontWeight: '500' },

  // Form styles
  formRow: { flexDirection: 'row', gap: 12 },
  formCol: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY, marginBottom: 16 },
  textArea: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: NAVY, minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },
  uploadBox: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 10, height: 60, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  uploadText: { fontSize: 13, color: '#64748B', marginLeft: 8, fontWeight: '500' },
  
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  sheetBody: { padding: 20 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 4, marginBottom: 4 },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: WHITE }
});
