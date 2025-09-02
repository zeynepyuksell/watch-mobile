import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({ 
  title, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  style, 
  ...props 
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'ghost':
        return styles.ghost;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return styles.textOutline;
      case 'secondary':
        return styles.textSecondary;
      default:
        return styles.textDefault;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.small;
      case 'lg':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const renderButtonContent = () => {
    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={['#4C3BD7', '#B072FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            getSizeStyle(),
            fullWidth && styles.fullWidth,
            styles.gradientButton,
          ]}
        >
          <Text style={[styles.text, getTextStyle()]}>
            {title}
          </Text>
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.button, getButtonStyle(), getSizeStyle(), fullWidth && styles.fullWidth]}>
        <Text style={[styles.text, getTextStyle()]}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[style]}
      activeOpacity={0.8}
      {...props}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    shadowColor: '#4C3BD7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  secondary: {
    backgroundColor: '#141821',
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textDefault: {
    color: 'white',
  },
  textSecondary: {
    color: '#E5E7EB',
  },
  textOutline: {
    color: '#6366F1',
  },
});
