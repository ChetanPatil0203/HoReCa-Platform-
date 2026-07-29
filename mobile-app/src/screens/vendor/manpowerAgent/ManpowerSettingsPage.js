import React from 'react';
import UnifiedProfileSettingsScreen from '../../../components/common/UnifiedProfileSettingsScreen';

export default function ManpowerSettingsPage({ navigation, onNavigate, onEditProfile }) {
  return <UnifiedProfileSettingsScreen roleOverride="manpower" navigation={navigation} onNavigate={onNavigate} onEditProfile={onEditProfile} />;
}
