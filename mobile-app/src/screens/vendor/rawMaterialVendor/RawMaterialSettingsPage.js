import React from 'react';
import UnifiedProfileSettingsScreen from '../../../components/common/UnifiedProfileSettingsScreen';

export default function RawMaterialSettingsPage({ navigation, onNavigate, onEditProfile }) {
  return <UnifiedProfileSettingsScreen roleOverride="rawMaterial" navigation={navigation} onNavigate={onNavigate} onEditProfile={onEditProfile} />;
}
