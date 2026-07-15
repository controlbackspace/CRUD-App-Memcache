import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Pressable } from 'react-native';
import CustomInput from '../../../components/atoms/CustomInput';
import CustomButton from '../../../components/atoms/CustomButton';
import FormField from '../../../components/molecules/FormField';

export default function LoginForm({ onSubmit, onNavigateToRegister, isLoading, serverError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = () => {
    if (username.trim() && password.trim()) {
      onSubmit(username, password);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>CRUD APP</Text>
      
      {serverError && <Text style={styles.errorText}>{serverError}</Text>}

      <FormField label="Username">
        <CustomInput placeholder="Enter username" value={username} onChangeText={setUsername} />
      </FormField>

      <FormField label="Password">
        <CustomInput placeholder="Enter password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      </FormField>

      {isLoading ? (
        <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 16 }} />
      ) : (
        <CustomButton title="Log In" onPress={handlePress} />
      )}

      
      <Pressable onPress={onNavigateToRegister} style={styles.linkContainer}>
  <Text style={styles.linkText}>Don't have an account? Register</Text>
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 8, width: '100%', shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007AFF' },
  errorText: { color: 'red', marginBottom: 12, textAlign: 'center' },
  linkContainer: { marginTop: 20, alignItems: 'center', padding: 8 },
  linkText: { color: '#007AFF', fontSize: 14, fontWeight: '600' }
});