import React, { useEffect } from 'react';
import HomeScreen from './src/features/persons/screens/PersonsListScreen';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { usePersons } from '../hooks/usePersons';
import { useAuth } from '../../auth/hooks/useAuth';

export default function HomeScreen() {
  const { logout } = useAuth();
  const { persons, isLoading, error, fetchPersons, removePerson } = usePersons();

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  const renderPersonCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.nameText}>{item.firstname} {item.lastname}</Text>
        <Text style={styles.detailText}>DOB: {item.dob} • Sex: {item.sex}</Text>
        <Text style={styles.ageBadge}>Age: {item.age}</Text>
      </View>
      <View style={styles.actionColumn}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => removePerson(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Persons Registry</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPersons}>
            <Text style={styles.buttonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && persons.length === 0 ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={persons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPersonCard}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={fetchPersons}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No person records present in database storage.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  logoutButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#ef4444' },
  logoutText: { color: '#fff', fontWeight: '600' },
  listContainer: { padding: 16 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    elevation: 2 
  },
  cardInfo: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  detailText: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  ageBadge: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#e0f2fe', 
    color: '#0369a1', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4, 
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: 6 
  },
  actionColumn: { justifyContent: 'center', marginLeft: 12 },
  actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, alignItems: 'center' },
  deleteButton: { backgroundColor: '#fee2e2' },
  buttonText: { color: '#dc2626', fontWeight: '600', fontSize: 14 },
  loader: { flex: 1, justifyContent: 'center' },
  errorBox: { padding: 16, backgroundColor: '#fef2f2', margin: 16, borderRadius: 6, alignItems: 'center' },
  errorText: { color: '#b91c1c', marginBottom: 8, textAlign: 'center' },
  retryButton: { backgroundColor: '#dc2626', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 16 }
});