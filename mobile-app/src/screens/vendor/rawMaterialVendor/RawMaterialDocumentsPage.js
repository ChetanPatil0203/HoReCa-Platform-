import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView
} from 'react-native';
import { FileText, CheckCircle, AlertCircle, Clock, Eye, RefreshCw } from 'lucide-react-native';

const NAVY = '#081A3A';

const MOCK_DOCS = [];

export default function RawMaterialDocumentsPage() {
  
  const getStatusInfo = (status) => {
    switch(status) {
      case 'Verified': return { color: '#10B981', icon: CheckCircle };
      case 'Pending': return { color: '#F59E0B', icon: Clock };
      case 'Expired': return { color: '#EF4444', icon: AlertCircle };
      default: return { color: '#64748B', icon: FileText };
    }
  };

  const renderDocCard = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    const StatusIcon = statusInfo.icon;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <FileText size={24} color={NAVY} />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.docTitle}>{item.title}</Text>
            <Text style={styles.docExpiry}>Expiry: {item.expiry}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}>
            <StatusIcon size={14} color={statusInfo.color} style={{marginRight: 4}} />
            <Text style={[styles.statusText, {color: statusInfo.color}]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnOutline}>
            <Eye size={16} color={NAVY} />
            <Text style={styles.btnOutlineText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnPrimary, item.status === 'Verified' && {backgroundColor: '#F1F5F9', borderColor: '#E2E8F0'}]}>
            <RefreshCw size={16} color={item.status === 'Verified' ? '#64748B' : '#FFFFFF'} />
            <Text style={[styles.btnPrimaryText, item.status === 'Verified' && {color: '#64748B'}]}>Replace</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Documents</Text>
        </View>
        <FlatList
          data={MOCK_DOCS}
          keyExtractor={item => item.id}
          renderItem={renderDocCard}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  listContent: { padding: 16, paddingBottom: 80 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  titleBox: { flex: 1 },
  docTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  docExpiry: { fontSize: 13, color: '#64748B' },
  cardBody: { marginBottom: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  btnOutline: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  btnOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY, marginLeft: 8 },
  btnPrimary: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 8, backgroundColor: NAVY, borderWidth: 1, borderColor: NAVY },
  btnPrimaryText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 8 },
});
