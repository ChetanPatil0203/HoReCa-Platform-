import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView, useWindowDimensions, Platform } from 'react-native';
import { ChevronDown, Check, AlertCircle, X } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const selectedOption = options.find((o) => o.value === value);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const openDropdown = () => {
    if (isLargeScreen && buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownCoords({ top: py + height + 4, left: px, width });
        setModalVisible(true);
      });
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>

      <TouchableOpacity
        ref={buttonRef}
        style={[
          styles.selectButton,
          modalVisible && styles.selectButtonActive,
          error && styles.selectButtonError
        ]}
        onPress={openDropdown}
        activeOpacity={0.8}
      >
        <View style={styles.selectValueContainer}>
          {selectedOption?.icon && <Text style={styles.optionIcon}>{selectedOption.icon}</Text>}
          <Text style={[styles.selectValueText, !selectedOption && { color: colors.muted }]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        <ChevronDown size={16} color={colors.muted} />
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={12} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Modal Dropdown */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType={isLargeScreen ? "none" : "slide"}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalOverlay, isLargeScreen && { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)} 
          />
          <View style={[
            styles.modalContent, 
            isLargeScreen && { 
              position: 'absolute', 
              top: dropdownCoords.top, 
              left: dropdownCoords.left, 
              width: dropdownCoords.width, 
              borderRadius: 16, 
              maxHeight: 300,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }
          ]}>
            {!isLargeScreen && (
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select {label}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={20} color={colors.muted} />
                </TouchableOpacity>
              </View>
            )}
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item.value && styles.optionItemActive,
                    isLargeScreen && { paddingVertical: 12, paddingHorizontal: 16 }
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.optionContent}>
                    {item.icon && <Text style={styles.optionIcon}>{item.icon}</Text>}
                    <Text style={[
                      styles.optionLabel,
                      value === item.value && styles.optionLabelActive,
                      isLargeScreen && { fontSize: 14 }
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  {value === item.value && <Check size={isLargeScreen ? 16 : 18} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 16,
  },
  selectButtonActive: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectButtonError: {
    borderColor: colors.error,
  },
  selectValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValueText: {
    fontSize: 14,
    color: colors.dark,
  },
  optionIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.dark,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
  },
  optionItemActive: {
    backgroundColor: colors.primaryLight,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 15,
    color: colors.dark,
  },
  optionLabelActive: {
    fontWeight: 'bold',
    color: colors.primary,
  }
});
