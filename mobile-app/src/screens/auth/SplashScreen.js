import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, useWindowDimensions,
  Easing, AccessibilityInfo, Platform, SafeAreaView, Image
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Package, Users, Wrench, Megaphone } from 'lucide-react-native';

const PRIMARY_NAVY = '#071B3A';
const SECONDARY_NAVY = '#102A4C';
const BRAND_GOLD = '#D8A51F';
const WHITE = '#FFFFFF';
const BG_WHITE = '#F7F9FC';
const TEXT_NAVY = '#071B3A';
const BORDER_COLOR = '#E4EAF2';

export default function SplashScreen({ onFinish }) {
  const { width } = useWindowDimensions();

  const isSmallPhone = width < 350;
  const isTablet = width >= 600;

  // Responsive dimensions meeting exact 8-12% logo reduction and hierarchy rules
  const logoSize = isSmallPhone ? 92 : width < 390 ? 102 : isTablet ? 136 : 110;
  const titleSize = isSmallPhone ? 36 : width < 390 ? 42 : isTablet ? 52 : 46;
  const subtitleSize = isSmallPhone ? 13 : isTablet ? 18 : 15;
  const categorySize = isSmallPhone ? 12 : isTablet ? 16 : 14;
  const cardHeight = isSmallPhone ? 82 : isTablet ? 96 : 88;

  // Animation values
  const bgOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(8)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dividerOpacity = useRef(new Animated.Value(0)).current;
  const categoriesOpacity = useRef(new Animated.Value(0)).current;

  // Cards stagger animation values
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card1TranslateY = useRef(new Animated.Value(8)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;
  const card2TranslateY = useRef(new Animated.Value(8)).current;
  const card3Opacity = useRef(new Animated.Value(0)).current;
  const card3TranslateY = useRef(new Animated.Value(8)).current;
  const card4Opacity = useRef(new Animated.Value(0)).current;
  const card4TranslateY = useRef(new Animated.Value(8)).current;

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
        Animated.parallel([
          Animated.timing(logoOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(titleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dividerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(categoriesOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(card1Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(card2Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(card3Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(card4Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(loaderOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(taglineOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      } else {
        Animated.sequence([
          // 1. Logo scale & fade in (350ms)
          Animated.parallel([
            Animated.timing(logoOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(logoScale, {
              toValue: 1,
              duration: 350,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(logoTranslateY, {
              toValue: 0,
              duration: 350,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            })
          ]),
          // 2. Title & Subtitle fade up (280ms)
          Animated.parallel([
            Animated.timing(titleOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
            Animated.timing(titleTranslateY, {
              toValue: 0,
              duration: 280,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(subtitleOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
          ]),
          // 3. Divider line & Category list (220ms)
          Animated.parallel([
            Animated.timing(dividerOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
            Animated.timing(categoriesOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
          ]),
          // 4. Staggered card animation sequence (50ms stagger)
          Animated.stagger(50, [
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
          // 5. Loader & Tagline (250ms)
          Animated.parallel([
            Animated.timing(loaderOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.timing(taglineOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          ])
        ]).start();
      }
    };

    checkReduceMotion();

    // Loader rotation spin (1300ms duration per rotation)
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Exactly 3 seconds (3000ms) total screen duration
    const timer = setTimeout(() => {
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 2700);

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
      {/* Background Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main Light Central Surface */}
          <Path d="M 0 0 L 100 0 L 100 100 L 0 100 Z" fill={BG_WHITE} />

          {/* Top-Left Dark Navy Curve */}
          <Path d="M 0 0 L 58 0 C 42 16 18 22 0 18 Z" fill={PRIMARY_NAVY} />
          {/* Thin gold highlight top curve */}
          <Path d="M 0 18 C 18 22 42 16 58 0" fill="none" stroke={BRAND_GOLD} strokeWidth="0.8" />

          {/* Bottom Dark Navy Footer Curves */}
          <Path d="M 0 81 C 25 75 75 73 100 85 L 100 100 L 0 100 Z" fill={PRIMARY_NAVY} />
          <Path d="M 0 84 C 30 78 70 81 100 89 L 100 100 L 0 100 Z" fill={SECONDARY_NAVY} opacity="0.6" />
          <Path d="M 0 81 C 25 75 75 73 100 85" fill="none" stroke={BRAND_GOLD} strokeWidth="1" />
        </Svg>
      </View>

      {/* Decorative Gold Microdots in Footer Area */}
      <View style={styles.microDots}>
        <Svg width="35" height="35" viewBox="0 0 35 35">
          <Circle cx="4" cy="4" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
          <Circle cx="12" cy="4" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
          <Circle cx="20" cy="4" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
          <Circle cx="4" cy="12" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
          <Circle cx="12" cy="12" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
          <Circle cx="20" cy="12" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
          <Circle cx="4" cy="20" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
          <Circle cx="12" cy="20" r="1.4" fill={BRAND_GOLD} opacity="0.35" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Spacer */}
        <View style={styles.topSpacer} />

        {/* Central Brand & Content Hierarchy Block */}
        <View style={styles.centerBrandBlock}>
          {/* 1. Official Gold H Logo (Refined responsive size) */}
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

          {/* 2. HRC HUB Wordmark */}
          <Animated.View style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }]
          }}>
            <Text style={[styles.brandTitle, { fontSize: titleSize, lineHeight: titleSize * 1.15 }]}>
              HRC <Text style={{ color: BRAND_GOLD }}>HUB</Text>
            </Text>
          </Animated.View>

          {/* 3. Subtitle */}
          <Animated.View style={{ opacity: subtitleOpacity }}>
            <Text style={[styles.brandSubtitle, { fontSize: subtitleSize }]}>
              HoReCa Business Partner
            </Text>
          </Animated.View>

          {/* 4. Small Gold Diamond Divider */}
          <Animated.View style={[styles.dividerRow, { opacity: dividerOpacity }]}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* 5. Business Types Line */}
          <Animated.View style={{ opacity: categoriesOpacity }}>
            <Text style={[styles.categoriesText, { fontSize: categorySize }]}>
              Hotels <Text style={{ color: BRAND_GOLD }}>•</Text> Restaurants <Text style={{ color: BRAND_GOLD }}>•</Text> Cafes
            </Text>
          </Animated.View>

          {/* 6. Four Platform Pillar Cards (Single Row Layout) */}
          <View style={styles.cardsContainer}>
            {/* Card 1: Raw Material */}
            <Animated.View style={[
              styles.card,
              { height: cardHeight, opacity: card1Opacity, transform: [{ translateY: card1TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Package size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={2}>Raw Material</Text>
            </Animated.View>

            {/* Card 2: Manpower */}
            <Animated.View style={[
              styles.card,
              { height: cardHeight, opacity: card2Opacity, transform: [{ translateY: card2TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Users size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={1}>Manpower</Text>
            </Animated.View>

            {/* Card 3: Service Provider */}
            <Animated.View style={[
              styles.card,
              { height: cardHeight, opacity: card3Opacity, transform: [{ translateY: card3TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Wrench size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={2}>Service Provider</Text>
            </Animated.View>

            {/* Card 4: Marketing */}
            <Animated.View style={[
              styles.card,
              { height: cardHeight, opacity: card4Opacity, transform: [{ translateY: card4TranslateY }] }
            ]}>
              <View style={styles.cardIconBox}>
                <Megaphone size={20} color={BRAND_GOLD} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={1}>Marketing</Text>
            </Animated.View>
          </View>
        </View>

        {/* Bottom Curved Section with Loader & Tagline */}
        <View style={styles.bottomCurvedContainer}>
          {/* Gold Loading Indicator */}
          <Animated.View style={[styles.loaderContainer, { opacity: loaderOpacity }]}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg width="36" height="36" viewBox="0 0 36 36">
                <Circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
                <Circle cx="18" cy="18" r="14" fill="none" stroke={BRAND_GOLD} strokeWidth="2.5" strokeDasharray="44 40" strokeLinecap="round" />
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
    maxWidth: 460, // Expo Web mobile emulation center constraint
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topSpacer: {
    height: Platform.OS === 'ios' ? 20 : 36,
  },
  microDots: {
    position: 'absolute',
    bottom: 76,
    left: 18,
    zIndex: 2,
  },
  centerBrandBlock: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 6,
  },
  brandTitle: {
    fontWeight: '900',
    color: TEXT_NAVY,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  brandSubtitle: {
    color: TEXT_NAVY,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginTop: 2,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 190,
    marginVertical: 10,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.2)',
  },
  dividerDiamond: {
    width: 5,
    height: 5,
    transform: [{ rotate: '45deg' }],
    backgroundColor: BRAND_GOLD,
  },
  categoriesText: {
    color: TEXT_NAVY,
    fontWeight: '600',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(216, 165, 31, 0.15)',
  },
  cardLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    color: TEXT_NAVY,
    textAlign: 'center',
  },
  bottomCurvedContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    height: 120,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  taglineText: {
    color: BRAND_GOLD,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.0,
    textAlign: 'center',
  },
});
