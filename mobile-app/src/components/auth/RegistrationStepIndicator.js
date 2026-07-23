import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
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
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 32,
    paddingHorizontal: 16
  },
  stepBlock: { 
    alignItems: 'center', 
    width: 60,
    zIndex: 2
  },
  stepCircle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: AUTH_COLORS.input, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border
  },
  stepCircleActive: { 
    backgroundColor: AUTH_COLORS.primary,
    borderColor: AUTH_COLORS.primary,
    shadowColor: AUTH_COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  stepCircleCompleted: { 
    backgroundColor: '#D1FAE5', // keeping soft green background for completed step
    borderColor: '#D1FAE5'
  },
  stepCircleText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: AUTH_COLORS.muted 
  },
  stepCircleTextActive: { 
    color: '#FFFFFF' 
  },
  stepLabel: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: AUTH_COLORS.muted,
    letterSpacing: 0.5
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
    marginHorizontal: -10, 
    marginBottom: 18,
    zIndex: 1
  },
  stepLineCompleted: { 
    backgroundColor: AUTH_COLORS.success 
  }
});
