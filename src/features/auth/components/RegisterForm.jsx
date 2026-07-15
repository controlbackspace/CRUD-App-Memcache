import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CustomInput from '../../../components/atoms/CustomInput';
import CustomButton from '../../../components/atoms/CustomButton';
import FormField from '../../../components/molecules/FormField';

export default function RegisterForm({ onRegisterSubmit, onNavigateToLogin, isLoading, serverError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePress = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (username.trim() && password.trim()) {
      onRegisterSubmit({ username, password });
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Create Account</Text>
      
      {serverError && <Text style={styles.errorText}>{serverError}</Text>}

      <FormField label="Username">
        <CustomInput placeholder="Choose a username" value={username} onChangeText={setUsername} />
      </FormField>

      <FormField label="Password">
        <CustomInput placeholder="Create password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      </FormField>

      <FormField label="Confirm Password">
        <CustomInput placeholder="Repeat password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} />
      </FormField>

      <CustomButton title="Register" onPress={handlePress} />
      <CustomButton title="Back to Log In" onPress={onNavigateToLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 8, width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007AFF' },
  errorText: { color: 'red', marginBottom: 12, textAlign: 'center' }
});