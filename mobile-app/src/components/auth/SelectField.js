import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { ChevronDown, X, CheckCircle2, Search } from 'lucide-react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function SelectField({ 
  label, value, options, onSelect, placeholder, error, containerStyle, searchable, icon: Icon 
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = searchable 
    ? options.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  let displayLabel = label;
  let isRequired = false;
  if (label && label.endsWith('*')) {
    isRequired = true;
    displayLabel = label.slice(0, -1).trim();
  }

  return (
    <View style={[styles.fieldBlock, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {displayLabel}
          {isRequired && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      
      <TouchableOpacity 
        style={[
          styles.dropdownWrap, 
          modalVisible && styles.dropdownFocused,
          error && styles.inputError
        ]} 
        onPress={() => { setSearchQuery(''); setModalVisible(true); }}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <View style={styles.leftContent}>
          {Icon && <Icon size={20} color={modalVisible ? AUTH_COLORS.accent : AUTH_COLORS.muted} style={styles.icon} />}
          <Text style={[styles.inputText, !value && { color: AUTH_COLORS.muted }]}>
            {value || placeholder || `Select ${displayLabel.toLowerCase()}`}
          </Text>
        </View>
        <ChevronDown size={20} color={AUTH_COLORS.muted} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{displayLabel}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color={AUTH_COLORS.primary} />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchWrap}>
                <Search size={18} color={AUTH_COLORS.muted} style={styles.searchIcon} />
                <TextInput 
                  style={styles.searchInput} 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  placeholderTextColor={AUTH_COLORS.muted}
                />
              </View>
            )}

            <ScrollView style={styles.optionsList} keyboardShouldPersistTaps="handled">
              {filteredOptions.length === 0 ? (
                <Text style={styles.noResults}>No options found.</Text>
              ) : (
                filteredOptions.map((opt, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.optionItem}
                    onPress={() => {
                      onSelect(opt);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[styles.optionText, value === opt && styles.optionTextActive]}>{opt}</Text>
                    {value === opt && <CheckCircle2 size={20} color={AUTH_COLORS.success} />}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: { marginBottom: 16 },
  label: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: AUTH_COLORS.primary, 
    marginBottom: 7, 
    textTransform: 'uppercase',
    letterSpacing: 0.5 
  },
  asterisk: { color: AUTH_COLORS.error },
  dropdownWrap: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: AUTH_COLORS.input, 
    borderWidth: 1, 
    borderColor: AUTH_COLORS.border, 
    borderRadius: 14, 
    height: 52, 
    paddingHorizontal: 16 
  },
  dropdownFocused: {
    borderColor: AUTH_COLORS.primary,
    backgroundColor: '#F0F4F8'
  },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { marginRight: 10 },
  inputText: { fontSize: 15, color: AUTH_COLORS.text, flex: 1 },
  inputError: { borderColor: AUTH_COLORS.error, backgroundColor: '#FEF2F2' },
  errorText: { color: AUTH_COLORS.error, fontSize: 12, marginTop: 6, fontWeight: '500' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7,27,58,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: AUTH_COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: AUTH_COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: AUTH_COLORS.primary },
  closeBtn: { padding: 4 },
  
  searchWrap: { padding: 16, borderBottomWidth: 1, borderBottomColor: AUTH_COLORS.border, position: 'relative', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 28, zIndex: 1 },
  searchInput: { backgroundColor: AUTH_COLORS.input, borderWidth: 1, borderColor: AUTH_COLORS.border, borderRadius: 12, height: 48, paddingLeft: 40, paddingRight: 16, fontSize: 15, color: AUTH_COLORS.text },
  
  optionsList: { paddingHorizontal: 8, paddingBottom: 32 },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: AUTH_COLORS.border },
  optionText: { fontSize: 16, color: AUTH_COLORS.text },
  optionTextActive: { fontWeight: 'bold', color: AUTH_COLORS.primary },
  noResults: { padding: 30, textAlign: 'center', color: AUTH_COLORS.muted, fontSize: 15 }
});
