import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse, G, Rect, Text as SvgText, Circle, Polyline, Path, Line } from 'react-native-svg';

export default function HeroIllustration() {
  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 360 240" width="100%" height="100%">
        {/* Large background blob */}
        <Ellipse cx="180" cy="130" rx="155" ry="105" fill="#EFF6FF" />
        <Ellipse cx="180" cy="135" rx="120" ry="82" fill="#DBEAFE" opacity="0.5" />

        {/* ── Floating card: Revenue chart (top-right) ── */}
        <G>
          <Rect x="252" y="28" width="90" height="60" rx="10" fill="white" />
          <SvgText x="260" y="44" fontSize="7.5" fill="#94A3B8" fontFamily="System">Monthly Revenue</SvgText>
          {/* Bar chart */}
          <Rect x="260" y="64" width="8" height="16" rx="2" fill="#BFDBFE" />
          <Rect x="272" y="56" width="8" height="24" rx="2" fill="#93C5FD" />
          <Rect x="284" y="62" width="8" height="18" rx="2" fill="#BFDBFE" />
          <Rect x="296" y="52" width="8" height="28" rx="2" fill="#2563EB" />
          <Rect x="308" y="60" width="8" height="20" rx="2" fill="#93C5FD" />
          <Rect x="320" y="54" width="8" height="26" rx="2" fill="#3B82F6" />
          <Rect x="258" y="80" width="78" height="0.5" fill="#E2E8F0" />
        </G>

        {/* ── Floating card: Active Orders (top-left) ── */}
        <G>
          <Rect x="20" y="35" width="85" height="50" rx="10" fill="white" />
          <Circle cx="42" cy="55" r="13" fill="#EFF6FF" />
          <Polyline points="36,55 40,59 48,51" stroke="#2563EB" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <SvgText x="60" y="50" fontSize="7" fill="#94A3B8" fontFamily="System">Active</SvgText>
          <SvgText x="60" y="63" fontSize="14" fill="#0F172A" fontWeight="bold" fontFamily="System">24</SvgText>
          <SvgText x="78" y="63" fontSize="7" fill="#94A3B8" fontFamily="System">orders</SvgText>
        </G>

        {/* ── Floating pill: Live (bottom-right) ── */}
        <G>
          <Rect x="235" y="178" width="90" height="26" rx="13" fill="white" />
          <Circle cx="251" cy="191" r="5" fill="#10B981" />
          <SvgText x="261" y="195" fontSize="9" fill="#0F172A" fontFamily="System" fontWeight="600">24 orders live</SvgText>
        </G>

        {/* ── Desk ── */}
        <Rect x="90" y="165" width="180" height="9" rx="4.5" fill="#93C5FD" />
        <Rect x="102" y="174" width="5" height="30" rx="2.5" fill="#93C5FD" />
        <Rect x="253" y="174" width="5" height="30" rx="2.5" fill="#93C5FD" />

        {/* ── Laptop on desk ── */}
        <Rect x="148" y="138" width="84" height="28" rx="4" fill="#1E40AF" />
        <Rect x="143" y="164" width="94" height="6" rx="3" fill="#1D4ED8" />
        <Rect x="153" y="142" width="74" height="20" rx="2" fill="#DBEAFE" />
        <Rect x="157" y="146" width="28" height="3.5" rx="1.5" fill="#93C5FD" />
        <Rect x="157" y="152" width="20" height="3.5" rx="1.5" fill="#BFDBFE" />
        <Rect x="191" y="144" width="10" height="16" rx="2" fill="#2563EB" />
        <Rect x="205" y="148" width="10" height="12" rx="2" fill="#60A5FA" />
        <Rect x="219" y="145" width="5" height="15" rx="2" fill="#93C5FD" />

        {/* ── Center person (seated at desk) ── */}
        <Circle cx="190" cy="112" r="16" fill="#FDE68A" />
        <Path d="M174 108 Q180 96 190 95 Q200 96 206 108" fill="#78350F" />
        <Path d="M174 140 Q180 128 190 126 Q200 128 206 140 L208 165 L172 165 Z" fill="#2563EB" />
        <Path d="M174 142 L154 162" stroke="#2563EB" strokeWidth="9" strokeLinecap="round" />
        <Path d="M206 142 L226 162" stroke="#2563EB" strokeWidth="9" strokeLinecap="round" />

        {/* ── Left person (standing, holding document) ── */}
        <Circle cx="88" cy="118" r="13" fill="#FBBF24" />
        <Path d="M75 115 Q80 106 88 104 Q96 106 101 115" fill="#92400E" />
        <Path d="M75 136 Q80 130 88 128 Q96 130 101 136 L103 168 L73 168 Z" fill="#60A5FA" />
        <Rect x="56" y="140" width="22" height="28" rx="3" fill="white" stroke="#93C5FD" strokeWidth="1.5" />
        <Line x1="60" y1="148" x2="74" y2="148" stroke="#BFDBFE" strokeWidth="1.5" />
        <Line x1="60" y1="153" x2="74" y2="153" stroke="#BFDBFE" strokeWidth="1.5" />
        <Line x1="60" y1="158" x2="70" y2="158" stroke="#BFDBFE" strokeWidth="1.5" />
        <Path d="M75 140 L64 152" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" />

        {/* ── Right person (standing, holding tablet) ── */}
        <Circle cx="286" cy="118" r="13" fill="#FDE68A" />
        <Path d="M273 115 Q278 105 286 104 Q294 106 299 115" fill="#1C1917" />
        <Path d="M273 136 Q278 130 286 128 Q294 130 299 136 L301 168 L271 168 Z" fill="#60A5FA" />
        <Rect x="298" y="136" width="26" height="34" rx="4" fill="white" stroke="#93C5FD" strokeWidth="1.5" />
        <Rect x="302" y="140" width="18" height="14" rx="2" fill="#DBEAFE" />
        <Rect x="304" y="148" width="4" height="6" rx="1" fill="#93C5FD" />
        <Rect x="310" y="145" width="4" height="9" rx="1" fill="#2563EB" />
        <Rect x="316" y="147" width="4" height="7" rx="1" fill="#60A5FA" />
        <Path d="M299 140 L304 148" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" />

        {/* ── Decorative dots ── */}
        <Circle cx="46" cy="24" r="5" fill="#BFDBFE" />
        <Circle cx="60" cy="36" r="3" fill="#DBEAFE" />
        <Circle cx="320" cy="20" r="4" fill="#BFDBFE" />
        <Circle cx="340" cy="170" r="5" fill="#EFF6FF" />
        <Circle cx="18" cy="155" r="4" fill="#DBEAFE" />
        <Circle cx="175" cy="15" r="3" fill="#BFDBFE" />
        <Circle cx="340" cy="110" r="3" fill="#DBEAFE" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 360 / 240, // Match the original viewBox
    alignItems: 'center',
    justifyContent: 'center',
  }
});
