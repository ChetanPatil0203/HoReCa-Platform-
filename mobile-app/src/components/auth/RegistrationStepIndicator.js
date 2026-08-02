import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function RegistrationStepIndicator({ currentStep }) {
  const renderStep = (stepNumber, label) => {
    const isCompleted = stepNumber < currentStep;
    const isActive = stepNumber === currentStep;
    
    let circleStyle = styles.stepCircle;
    let textStyle = styles.stepCircleText;
    let labelStyle = styles.stepLabel;

    if (isCompleted) {
      circleStyle = styles.stepCircleCompleted;
      labelStyle = styles.stepLabelCompleted;
    } else if (isActive) {
      circleStyle = styles.stepCircleActive;
      textStyle = styles.stepCircleTextActive;
      labelStyle = styles.stepLabelActive;
    }

    return (
      <View style={styles.stepBlock} key={stepNumber}>
        <View style={circleStyle}>
          {isCompleted ? (
            <CheckCircle2 size={18} color={AUTH_COLORS.success} />
          ) : (
            <Text style={textStyle}>{stepNumber}</Text>
          )}
        </View>
        <Text style={labelStyle}>{label}</Text>
      </View>
    );
  };

  const renderLine = (stepNumber) => {
    const isCompleted = stepNumber < currentStep;
    return (
      <View key={`line-${stepNumber}`} style={[styles.stepLine, isCompleted && styles.stepLineCompleted]} />
    );
  };

  return (
    <View style={styles.container}>
      {renderStep(1, 'BUSINESS')}
      {renderLine(1)}
      {renderStep(2, 'OWNER')}
      {renderLine(2)}
      {renderStep(3, 'VERIFY')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    paddingHorizontal: 8,
    width: '100%'
  },
  stepBlock: { 
    alignItems: 'center', 
    width: 68,
    zIndex: 2
  },
  stepCircle: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: AUTH_COLORS.input, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 6,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border
  },
  stepCircleActive: { 
    backgroundColor: AUTH_COLORS.primary,
    borderColor: AUTH_COLORS.primary,
    shadowColor: AUTH_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  stepCircleCompleted: { 
    backgroundColor: '#D1FAE5',
    borderColor: '#D1FAE5'
  },
  stepCircleText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: AUTH_COLORS.muted,
    textAlign: 'center',
    includeFontPadding: false
  },
  stepCircleTextActive: { 
    color: '#FFFFFF' 
  },
  stepLabel: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: AUTH_COLORS.muted,
    letterSpacing: 0.5,
    textAlign: 'center'
  },
  stepLabelActive: { 
    color: AUTH_COLORS.primary 
  },
  stepLabelCompleted: { 
    color: AUTH_COLORS.success 
  },
  stepLine: { 
    flex: 1, 
    height: 2, 
    backgroundColor: AUTH_COLORS.border, 
    marginHorizontal: -8, 
    marginTop: 14,
    zIndex: 1
  },
  stepLineCompleted: { 
    backgroundColor: AUTH_COLORS.success 
  }
});
