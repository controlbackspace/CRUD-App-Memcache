import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


export default function CustomButton({ title, onPress }) {
  return (
    
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});