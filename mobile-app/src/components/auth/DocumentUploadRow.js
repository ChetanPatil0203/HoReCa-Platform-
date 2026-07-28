import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Linking, Alert } from 'react-native';
import { FileText, Upload, Trash2, CheckCircle2, FileUp, Eye, X } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AUTH_COLORS } from './AuthTheme';

export default function DocumentUploadRow({ document, selectedFile, onFileSelect, onFileRemove }) {
  const { name, helperText, requirement } = document;
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

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

  const isRequired = requirement === 'Required';
  const isSelected = !!selectedFile;

  let badgeStyle = styles.badgeOptional;
  let badgeTextStyle = styles.badgeTextOptional;
  
  if (isRequired) {
    badgeStyle = styles.badgeRequired;
    badgeTextStyle = styles.badgeTextRequired;
  } else if (requirement === 'Required if applicable') {
    badgeStyle = styles.badgeApplicable;
    badgeTextStyle = styles.badgeTextApplicable;
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.iconBox}>
          {isSelected ? <CheckCircle2 size={24} color={AUTH_COLORS.success} /> : <FileText size={24} color={AUTH_COLORS.primary} />}
        </View>
        
        <View style={styles.infoArea}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            {!isSelected && (
              <View style={[styles.badge, badgeStyle]}>
                <Text style={[styles.badgeText, badgeTextStyle]}>{requirement}</Text>
              </View>
            )}
          </View>
          
          {!isSelected ? (
            <Text style={styles.helperText} numberOfLines={2}>{helperText}</Text>
          ) : (
            <View>
              <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
              <View style={styles.fileMetaRow}>
                <Text style={styles.fileSize}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.readyText}>Ready for Submission</Text>
              </View>
            </View>
          )}
        </View>

        {!isSelected && (
          <TouchableOpacity style={styles.uploadAction} onPress={handlePickDocument}>
            <Upload size={18} color={AUTH_COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isSelected && (
        <View style={styles.actionsFooter}>
          <TouchableOpacity style={styles.previewBtn} onPress={() => setIsPreviewVisible(true)}>
            <Eye size={14} color={AUTH_COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.replaceBtn} onPress={handlePickDocument}>
            <FileUp size={14} color={AUTH_COLORS.muted} style={{ marginRight: 6 }} />
            <Text style={styles.replaceText}>Replace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={onFileRemove}>
            <Trash2 size={14} color={AUTH_COLORS.error} style={{ marginRight: 6 }} />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

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
  container: { 
    backgroundColor: AUTH_COLORS.card, 
    borderWidth: 1, 
    borderColor: AUTH_COLORS.border, 
    borderRadius: 16, 
    padding: 14, 
    marginBottom: 10 
  },
  contentWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: AUTH_COLORS.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border
  },
  infoArea: {
    flex: 1,
    justifyContent: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6
  },
  name: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: AUTH_COLORS.text
  },
  badge: { 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 6 
  },
  badgeRequired: { backgroundColor: '#FEE2E2' },
  badgeTextRequired: { color: AUTH_COLORS.error, fontSize: 10, fontWeight: 'bold' },
  badgeApplicable: { backgroundColor: '#FFEDD5' },
  badgeTextApplicable: { color: AUTH_COLORS.warning, fontSize: 10, fontWeight: 'bold' },
  badgeOptional: { backgroundColor: AUTH_COLORS.input },
  badgeTextOptional: { color: AUTH_COLORS.muted, fontSize: 10, fontWeight: 'bold' },
  
  helperText: { 
    fontSize: 12, 
    color: AUTH_COLORS.muted, 
    lineHeight: 16 
  },
  
  uploadAction: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },

  fileName: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: AUTH_COLORS.text, 
    marginBottom: 2 
  },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fileSize: { 
    fontSize: 11, 
    color: AUTH_COLORS.muted 
  },
  dot: {
    color: AUTH_COLORS.border,
    marginHorizontal: 6
  },
  readyText: {
    fontSize: 11,
    color: AUTH_COLORS.success,
    fontWeight: '600'
  },

  actionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AUTH_COLORS.border,
    gap: 12
  },
  replaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: AUTH_COLORS.input,
    borderRadius: 8
  },
  replaceText: {
    fontSize: 12,
    fontWeight: '600',
    color: AUTH_COLORS.text
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 8
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AUTH_COLORS.error
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F0F4F8',
    borderRadius: 8
  },
  previewText: {
    fontSize: 12,
    fontWeight: '600',
    color: AUTH_COLORS.primary
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: AUTH_COLORS.card,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AUTH_COLORS.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AUTH_COLORS.primary,
    flex: 1,
    marginRight: 10,
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  previewImage: {
    width: '100%',
    height: 350,
    borderRadius: 10,
  },
  pdfPreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  pdfName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AUTH_COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  pdfSize: {
    fontSize: 12,
    color: AUTH_COLORS.muted,
    marginBottom: 20,
  },
  openSystemBtn: {
    backgroundColor: AUTH_COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  openSystemBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
