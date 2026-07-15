import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

import RegisterForm from '../components/RegisterForm';

export default function RegisterScreen({ onNavigateToLogin }) {
  const { register, isLoading, error } = useAuth();

  const handleRegisterSubmit = async ({ username, password }) => {
    const result = await register(username, password);
    if (result && result.success) {
      alert('Registration successful! Redirecting to login...');
      onNavigateToLogin();
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.cardWrapper}>
        <RegisterForm 
          onRegisterSubmit={handleRegisterSubmit} 
          onNavigateToLogin={onNavigateToLogin} 
          isLoading={isLoading} 
          serverError={error} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f3f4f6',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  cardWrapper: { 
    width: '90%', 
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  }
});