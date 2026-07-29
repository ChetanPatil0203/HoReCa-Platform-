import React from 'react';
import UnifiedProfileSettingsScreen from '../../../components/common/UnifiedProfileSettingsScreen';

export default function MarketingSettingsScreen({ navigation, onNavigate, onEditProfile }) {
  return <UnifiedProfileSettingsScreen roleOverride="marketing" navigation={navigation} onNavigate={onNavigate} onEditProfile={onEditProfile} />;
}
