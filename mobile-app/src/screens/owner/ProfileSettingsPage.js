import React from 'react';
import UnifiedProfileSettingsScreen from '../../components/common/UnifiedProfileSettingsScreen';

export default function ProfileSettingsPage({ user, navigation, onNavigate, onEditProfile }) {
  return <UnifiedProfileSettingsScreen roleOverride="horeca" navigation={navigation} onNavigate={onNavigate} onEditProfile={onEditProfile} />;
}
