import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
// 🎯 Go up one level to auth/, then straight into components/
import LoginForm from '../components/LoginForm'; 

export default function LoginScreen({ onNavigateToRegister }) {
  const { login, isLoading, error } = useAuth();

  const handleLoginSubmit = async (username, password) => {
    await login(username, password);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.cardWrapper}>
        <LoginForm 
          onSubmit={handleLoginSubmit} 
          onNavigateToRegister={onNavigateToRegister} 
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