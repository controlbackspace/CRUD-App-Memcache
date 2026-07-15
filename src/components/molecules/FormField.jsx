import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FormField({ label, children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
});