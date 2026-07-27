import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, useWindowDimensions,
  Easing, AccessibilityInfo, Platform, SafeAreaView, Image
} from 'react-native';
import Svg, { Path, Circle, G, LinearGradient, Stop } from 'react-native-svg';
import { Package, Users, Wrench, Megaphone } from 'lucide-react-native';

const PRIMARY_NAVY = '#041533';
const SECONDARY_NAVY = '#0A2454';
const BRAND_GOLD = '#C89423';
const WHITE = '#FFFFFF';
const BG_WHITE = '#FAFBFD';
const TEXT_NAVY = '#041533';

export default function SplashScreen({ onFinish }) {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 350;
  const isTablet = width >= 600;

  // Responsive dimensions strictly matching Image 2 hierarchy
  const logoSize = isSmallPhone ? 110 : isTablet ? 200 : 155;
  const titleSize = isSmallPhone ? 38 : isTablet ? 58 : 50;
  const subtitleSize = isSmallPhone ? 14 : isTablet ? 20 : 16;
  const categorySize = isSmallPhone ? 12 : isTablet ? 17 : 14;
  const cardHeight = isSmallPhone ? 78 : isTablet ? 98 : 88;

  // Animation values
  const bgOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(12)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(10)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dividerOpacity = useRef(new Animated.Value(0)).current;
  const categoriesOpacity = useRef(new Animated.Value(0)).current;

  // Cards stagger animation values
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card1TranslateY = useRef(new Animated.Value(10)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;
  const card2TranslateY = useRef(new Animated.Value(10)).current;
  const card3Opacity = useRef(new Animated.Value(0)).current;
  const card3TranslateY = useRef(new Animated.Value(10)).current;
  const card4Opacity = useRef(new Animated.Value(0)).current;
  const card4TranslateY = useRef(new Animated.Value(10)).current;

  // Loader and bottom tagline animations
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isReduceMotionEnabled = false;

    const checkReduceMotion = async () => {
      try {
        if (AccessibilityInfo.isReduceMotionEnabled) {
          isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        }
      } catch (e) {
        // Silent fallback
      }

      if (isReduceMotionEnabled) {
        // Simple fade animations only
        Animated.parallel([
          Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dividerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(categoriesOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(card1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(card2Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(card3Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(card4Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(loaderOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      } else {
        // High fidelity sequence matching Image 2 style
        Animated.sequence([
          // 1. Logo scale & fade in
          Animated.parallel([
            Animated.timing(logoOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
            Animated.timing(logoScale, {
              toValue: 1,
              duration: 450,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(logoTranslateY, {
              toValue: 0,
              duration: 450,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            })
          ]),
          // 2. Title & Subtitle fade up
          Animated.parallel([
            Animated.timing(titleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(titleTranslateY, {
              toValue: 0,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]),
          // 3. Divider line & Category list
          Animated.parallel([
            Animated.timing(dividerOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.timing(categoriesOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          ]),
          // 4. Staggered card animation sequence
          Animated.stagger(60, [
            Animated.parallel([
              Animated.timing(card1Opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
              Animated.timing(card1TranslateY, { toValue: 0, duration: 220, useNativeDriver: true })
            ]),
            Animated.parallel([
              Animated.timing(card2Opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
              Animated.timing(card2TranslateY, { toValue: 0, duration: 220, useNativeDriver: true })
            ]),
            Animated.parallel([
              Animated.timing(card3Opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
              Animated.timing(card3TranslateY, { toValue: 0, duration: 220, useNativeDriver: true })
            ]),
            Animated.parallel([
              Animated.timing(card4Opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
              Animated.timing(card4TranslateY, { toValue: 0, duration: 220, useNativeDriver: true })
            ]),
          ]),
          // 5. Loader & Tagline
          Animated.parallel([
            Animated.timing(loaderOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(taglineOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          ])
        ]).start();
      }
    };

    checkReduceMotion();

    // Loader rotation spin
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Total display duration of 5 seconds
    const timer = setTimeout(() => {
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 4750);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View 
      style={[styles.container, { opacity: bgOpacity }]}
      accessibilityLabel="HRC HUB Splash Screen"
    >
      {/* Background Layer matching Image 2 */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main White Central Surface */}
          <Path d="M 0 0 L 100 0 L 100 100 L 0 100 Z" fill={BG_WHITE} />

          {/* Top-Left Dark Navy Curve */}
          <Path d="M 0 0 L 58 0 C 42 16 18 22 0 18 Z" fill={PRIMARY_NAVY} />
          {/* Gold highlight top curve */}
          <Path d="M 0 18 C 18 22 42 16 58 0" fill="none" stroke={BRAND_GOLD} strokeWidth="0.8" />
          {/* Secondary thin white/light grey arc */}
          <Path d="M 0 20 C 20 24 44 18 60 0" fill="none" stroke="#E2E8F0" strokeWidth="0.6" />

          {/* Bottom Dark Navy Footer Curve */}
          <Path d="M 0 81 C 25 75 75 73 100 85 L 100 100 L 0 100 Z" fill={PRIMARY_NAVY} />
          {/* Wave navy layers */}
          <Path d="M 0 84 C 30 78 70 81 100 89 L 100 100 L 0 100 Z" fill={SECONDARY_NAVY} opacity="0.6" />
          {/* Thin gold edge above footer */}
          <Path d="M 0 81 C 25 75 75 73 100 85" fill="none" stroke={BRAND_GOLD} strokeWidth="1" />
        </Svg>
      </View>

      {/* Decorative Gold Microdots in Footer Area */}
      <View style={styles.microDots}>
        <Svg width="35" height="35" viewBox="0 0 35 35">
          <Circle cx="4" cy="4" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
          <Circle cx="12" cy="4" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
          <Circle cx="20" cy="4" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
          <Circle cx="4" cy="12" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
          <Circle cx="12" cy="12" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
          <Circle cx="20" cy="12" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
          <Circle cx="4" cy="20" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
          <Circle cx="12" cy="20" r="1.5" fill={BRAND_GOLD} opacity="0.4" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Spacer */}
        <View style={styles.topSpacer} />

        {/* Central Logo, Brand and Cards Block */}
        <View style={styles.centerBrandBlock}>
          {/* Large Gold H Logo (Rendered using high-fidelity transparent PNG) */}
          <Animated.View style={[
            styles.logoContainer,
            {
              width: logoSize,
              height: logoSize,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: logoTranslateY }]
            }
          ]}>
            <Image
              source={require('../../../assets/HRCHUB_Logo.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Large Title */}
          <Animated.View style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }]
          }}>
            <Text style={[styles.brandTitle, { fontSize: titleSize }]}>
              HRC <Text style={{ color: BRAND_GOLD }}>HUB</Text>
            </Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View style={{ opacity: subtitleOpacity }}>
            <Text style={[styles.brandSubtitle, { fontSize: subtitleSize }]}>
              HoReCa Business Partner
            </Text>
          </Animated.View>

          {/* Divider diamond layout */}
          <Animated.View style={[styles.dividerRow, { opacity: dividerOpacity }]}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* Hotels Restaurants Cafes Row */}
          <Animated.View style={{ opacity: categoriesOpacity }}>
            <Text style={[styles.categoriesText, { fontSize: categorySize }]}>
              Hotels <Text style={{ color: BRAND_GOLD }}>•</Text> Restaurants <Text style={{ color: BRAND_GOLD }}>•</Text> Cafes
            </Text>
          </Animated.View>

          {/* Business Pillar Cards forced side-by-side in a single row */}
          <View style={styles.cardsContainer}>
            {/* Card 1: Raw Material */}
            <Animated.View style={[
              styles.card,
              { width: '23.2%', height: cardHeight, opacity: card1Opacity, transform: [{ translateY: card1TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Package size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={2}>Raw Material</Text>
            </Animated.View>

            {/* Card 2: Manpower */}
            <Animated.View style={[
              styles.card,
              { width: '23.2%', height: cardHeight, opacity: card2Opacity, transform: [{ translateY: card2TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Users size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={2}>Manpower</Text>
            </Animated.View>

            {/* Card 3: Service Provider */}
            <Animated.View style={[
              styles.card,
              { width: '23.2%', height: cardHeight, opacity: card3Opacity, transform: [{ translateY: card3TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Wrench size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={2}>Service Provider</Text>
            </Animated.View>

            {/* Card 4: Marketing */}
            <Animated.View style={[
              styles.card,
              { width: '23.2%', height: cardHeight, opacity: card4Opacity, transform: [{ translateY: card4TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Megaphone size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={2}>Marketing</Text>
            </Animated.View>
          </View>
        </View>

        {/* Bottom Curved Section */}
        <View style={styles.bottomCurvedContainer}>
          {/* Gold Loading Indicator */}
          <Animated.View style={[styles.loaderContainer, { opacity: loaderOpacity }]}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg width="46" height="46" viewBox="0 0 36 36">
                <Circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
                <Circle cx="18" cy="18" r="15" fill="none" stroke={BRAND_GOLD} strokeWidth="2.5" strokeDasharray="50 40" strokeLinecap="round" />
              </Svg>
            </Animated.View>
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={{ opacity: taglineOpacity }}>
            <Text style={styles.taglineText}>CONNECT  •  COLLABORATE  •  GROW</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_NAVY,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        width: '100vw',
        height: '100vh',
      }
    })
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 600, // Center viewport composition
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topSpacer: {
    height: Platform.OS === 'ios' ? 24 : 44,
  },
  microDots: {
    position: 'absolute',
    bottom: 84,
    left: 20,
    zIndex: 2,
  },
  centerBrandBlock: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  brandTitle: {
    fontWeight: '900',
    color: TEXT_NAVY,
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 64,
  },
  brandSubtitle: {
    color: TEXT_NAVY,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    marginVertical: 14,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.25)',
  },
  dividerDiamond: {
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
    backgroundColor: BRAND_GOLD,
  },
  categoriesText: {
    color: TEXT_NAVY,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 4,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(200, 148, 35, 0.15)',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: TEXT_NAVY,
    textAlign: 'center',
  },
  bottomCurvedContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 36,
    height: '22%',
    minHeight: 140,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  taglineText: {
    color: BRAND_GOLD,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.2,
    textAlign: 'center',
  },
});
