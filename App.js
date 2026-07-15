import React, { useState } from 'react';
import PersonsListScreen from './src/features/persons/screens/PersonsListScreen'; 
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import RegisterScreen from './src/features/auth/screens/RegisterScreen';
import { useAuth } from './src/features/auth/hooks/useAuth';

function NavigationRouter() {
  const { user, loading } = useAuth(); 
  const [currentScreen, setCurrentScreen] = useState('login');

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (user) {
    return <PersonsListScreen />; // FIX: Render the interactive list screen with modal handlers
  }

  return currentScreen === 'login' ? (
    <LoginScreen onNavigateToRegister={() => setCurrentScreen('register')} />
  ) : (
    <RegisterScreen onNavigateToLogin={() => setCurrentScreen('login')} />
  );
}

function AppContent() {
  return (
    <SafeAreaView style={styles.root}>
      <NavigationRouter />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f5f7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }
});