import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, UIManager, LayoutAnimation, Modal, Image, Linking, Alert } from 'react-native';
import { FileText, Upload, Trash2, CircleCheck as CheckCircle2, FileUp, CircleHelp as HelpCircle, X, Eye } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AUTH_COLORS } from './AuthTheme';

if (typeof Platform !== 'undefined' && Platform?.OS === 'android' && UIManager?.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DocumentUploadRow({ document, selectedFile, onFileSelect, onFileRemove }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const { name, helperText, requirement } = document;

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.size && file.size > 5 * 1024 * 1024) {
          alert('File size must be 5MB or smaller.');
          return;
        }
        onFileSelect(file);
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  const toggleInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInfo(!showInfo);
  };

  const isRequired = requirement === 'Required';
  const isSelected = !!selectedFile;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, isSelected && styles.containerSelected]}>
        <View style={styles.iconBox}>
          {isSelected ? (
            <CheckCircle2 size={20} color={AUTH_COLORS.success} />
          ) : (
            <FileText size={20} color={AUTH_COLORS.primary} />
          )}
        </View>

        <View style={styles.infoArea}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {isRequired && !isSelected && (
              <View style={styles.badgeRequired}>
                <Text style={styles.badgeTextRequired}>Required</Text>
              </View>
            )}
            {helperText && !isSelected && (
              <TouchableOpacity onPress={toggleInfo} style={styles.infoIconBtn} accessibilityRole="button">
                <HelpCircle size={15} color={showInfo ? AUTH_COLORS.accent : AUTH_COLORS.muted} />
              </TouchableOpacity>
            )}
          </View>

          {isSelected ? (
            <View style={styles.fileDetails}>
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <Text style={styles.fileSize}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>
          ) : (
            <Text style={styles.statusText} numberOfLines={1}>
              Not uploaded
            </Text>
          )}
        </View>

        <View style={styles.actionColumn}>
          {isSelected ? (
            <View style={styles.activeActions}>
              <TouchableOpacity onPress={handlePickDocument} style={styles.actionIconBtn} accessibilityRole="button">
                <FileUp size={16} color={AUTH_COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPreviewVisible(true)} style={styles.actionIconBtn} accessibilityRole="button">
                <Eye size={16} color={AUTH_COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onFileRemove} style={[styles.actionIconBtn, styles.removeBtn]} accessibilityRole="button">
                <Trash2 size={16} color={AUTH_COLORS.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument} accessibilityRole="button">
              <Upload size={16} color={AUTH_COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal
        visible={isPreviewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPreviewVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>{name}</Text>
              <TouchableOpacity onPress={() => setIsPreviewVisible(false)} style={styles.closeBtn}>
                <X size={20} color={AUTH_COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {selectedFile && (
                selectedFile.mimeType?.startsWith('image/') || 
                /\.(jpg|jpeg|png|webp|gif)$/i.test(selectedFile.name)
              ) ? (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.pdfPreviewContainer}>
                  <FileText size={64} color={AUTH_COLORS.primary} style={{ marginBottom: 16 }} />
                  <Text style={styles.pdfName} numberOfLines={2}>{selectedFile?.name}</Text>
                  <Text style={styles.pdfSize}>
                    {selectedFile?.size ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0.00'} MB
                  </Text>
                  <TouchableOpacity
                    style={styles.openSystemBtn}
                    onPress={async () => {
                      try {
                        await Linking.openURL(selectedFile.uri);
                      } catch (err) {
                        Alert.alert('Error', 'Could not open the file.');
                      }
                    }}
                  >
                    <Text style={styles.openSystemBtnText}>Open Document</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 10,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AUTH_COLORS.input,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 14,
    minHeight: 68,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  containerSelected: {
    borderColor: AUTH_COLORS.success + '40', // light border for success
    backgroundColor: '#FFFFFF',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
  },
  infoArea: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    justifyContent: 'center',
    paddingRight: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 2,
    rowGap: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: AUTH_COLORS.text,
    marginRight: 6,
    flexShrink: 1,
  },
  infoIconBtn: {
    padding: 2,
  },
  badgeRequired: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginRight: 4,
  },
  badgeTextRequired: {
    color: AUTH_COLORS.error,
    fontSize: 9,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 11,
    color: AUTH_COLORS.muted,
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  fileName: {
    fontSize: 11,
    fontWeight: '600',
    color: AUTH_COLORS.text,
    flexShrink: 1,
    maxWidth: '65%',
  },
  fileSize: {
    fontSize: 10,
    color: AUTH_COLORS.muted,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  actionColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
  },
  activeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    backgroundColor: '#FEF2F2',
  },
  infoBox: {
    backgroundColor: '#F0F5FA',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: AUTH_COLORS.border,
    padding: 10,
    marginTop: -4,
    marginHorizontal: 8,
    zIndex: -1,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AUTH_COLORS.error
  },

  /* ── PREVIEW MODAL ─────────────────────────────── */
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AUTH_COLORS.border,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AUTH_COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 320,
    borderRadius: 10,
  },
  pdfPreviewContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pdfName: {
    fontSize: 14,
    fontWeight: '600',
    color: AUTH_COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  pdfSize: {
    fontSize: 12,
    color: AUTH_COLORS.muted,
    marginBottom: 20,
  },
  openSystemBtn: {
    backgroundColor: AUTH_COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  openSystemBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
