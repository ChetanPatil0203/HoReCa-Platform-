import React from 'react';
import UnifiedProfileSettingsScreen from '../../../components/common/UnifiedProfileSettingsScreen';

export default function ProviderSettingsPage({ navigation, onNavigate, onEditProfile }) {
  return <UnifiedProfileSettingsScreen roleOverride="serviceProvider" navigation={navigation} onNavigate={onNavigate} onEditProfile={onEditProfile} />;
}
