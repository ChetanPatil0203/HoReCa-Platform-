import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { User, Save, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export default function ProfileSettingsPage({ user }) {
  const [name, setName] = useState(user?.name || "Arjun Mehta");
  const [email, setEmail] = useState("arjun@meridian.com");
  const [businessName, setBusinessName] = useState(user?.businessName || "The Meridian Hotel");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [city, setCity] = useState("Mumbai");
  const [gst, setGst] = useState("27AAPCA1234A1ZX");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      alert("Profile updated successfully!");
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <User size={20} color="#1E40AF" />
          <Text style={styles.titleText}>Profile Settings</Text>
        </View>
        <Text style={styles.subText}>Manage your personal and business details</Text>
      </View>

      {/* Profile Form Card */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.avatarName}>{name}</Text>
            <Text style={styles.avatarEmail}>{email}</Text>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput style={styles.input} value={businessName} onChangeText={setBusinessName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GST Number</Text>
            <TextInput style={styles.input} value={gst} onChangeText={setGst} />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            {saved ? (
              <Check size={18} color="#fff" />
            ) : (
              <Save size={18} color="#fff" />
            )}
            <Text style={styles.saveText}>{saved ? "Saved" : "Save Changes"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  marginBottom: 16 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  titleText: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  subText: { fontSize: 13, color: '#64748B' },

  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 40 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(37,99,235,0.12)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#1E40AF' },
  avatarName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  avatarEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },

  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 44, fontSize: 14, color: '#1E293B' },

  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1E40AF', borderRadius: 12, height: 44, marginTop: 8 },
  saveText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
