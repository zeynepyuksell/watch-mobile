import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export default function Input({ label, error, helper, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {helper && !error && (
        <Text style={styles.helperText}>{helper}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
});
