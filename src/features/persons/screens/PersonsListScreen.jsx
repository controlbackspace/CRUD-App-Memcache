// C:\Users\jakea\Basic_CRUD_Application\src\screens\PersonsListScreen.jsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { usePersons } from '../hooks/usePersons'; // EXISTING - Data layer hooks
import { useAuth } from '../../auth/hooks/useAuth'; // EXISTING - Auth security context
import PersonForm from '../components/PersonForm'; // EXISTING - Form layout molecule

export default function PersonsListScreen() {
  const { logout } = useAuth(); // EXISTING - Read global logout method
  const { persons, isLoading, error, fetchPersons, addPerson, editPerson, removePerson } = usePersons(); // EXISTING - Hook values
  
  const [isModalOpen, setIsModalOpen] = useState(false); // EXISTING - Toggle visibility states
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  const handleSave = async (payload) => {
    let result;
    if (selectedPerson) {
      result = await editPerson(selectedPerson.id, payload);
    } else {
      result = await addPerson(payload);
    }

    if (result.success) {
      setIsModalOpen(false);
      setSelectedPerson(null);
    } else {
      Alert.alert('Save Failed', result.error || 'An unexpected error occurred.');
    }
  };

  const executeDelete = async (id) => {
    console.log("Step 3: executeDelete entered. Running removePerson with ID:", id);
    const result = await removePerson(id);
    console.log("Step 4: removePerson returned result:", result);
    if (!result.success) {
      Alert.alert('Delete Failed', result.error || 'An unexpected error occurred.');
    }
  };

  const handleDeleteCheck = (id, name) => {
    console.log("Step 2: handleDeleteCheck entered. ID:", id, "Name:", name);
    
    if (id === undefined || id === null) {
      console.error("ERROR: Cannot delete. The provided ID is undefined or null.");
      alert("Error: Record has no valid database ID.");
      return;
    }

    // FIX: Check Platform.OS instead of relying on the presence of the Alert.alert stub
    if (Platform.OS === 'web') {
      console.log("Step 2b: Running web confirm window...");
      const confirmDelete = window.confirm(`Are you sure you want to permanently delete the record for ${name}?`);
      if (confirmDelete) {
        console.log("Step 2c: Confirm clicked YES. Proceeding to executeDelete.");
        setTimeout(() => {
          executeDelete(id);
        }, 0);
      } else {
        console.log("Step 2c: Confirm clicked NO. Deletion aborted.");
      }
    } else {
      // Native iOS/Android Environments
      console.log("Step 2b: Triggering mobile Native Alert.alert dialog.");
      Alert.alert(
        'Confirm Deletion',
        `Are you sure you want to permanently delete the record for ${name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => executeDelete(id) }
        ]
      );
    }
  };

  const renderPersonCard = ({ item }) => {
    const recordId = item.id !== undefined ? item.id : item.rowid;

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.nameText}>{item.firstname} {item.lastname}</Text>
          <Text style={styles.detailText}>DOB: {item.dob} • Sex: {item.sex}</Text>
          <Text style={styles.ageBadge}>Age: {item.age}</Text>
        </View>
        <View style={styles.actionColumn}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => {
              setSelectedPerson(item);
              setIsModalOpen(true);
            }}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => {
              console.log("Step 1: Delete button clicked! Raw item:", item);
              handleDeleteCheck(recordId, `${item.firstname} ${item.lastname}`);
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Persons Registry (v2-Updated)</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerAddButton} 
            onPress={() => {
              setSelectedPerson(null);
              setIsModalOpen(true);
            }}
          >
            <Text style={styles.headerAddButtonText}>+ Add Person</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
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

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => {
          setSelectedPerson(null);
          setIsModalOpen(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Unified Add/Edit Form Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedPerson ? 'Edit Person Record' : 'Create Person Record'}
            </Text>
            <PersonForm
              initialData={selectedPerson}
              onSave={handleSave}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedPerson(null);
              }}
              isLoading={isLoading}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f3f4f6',
    position: 'relative',
    width: '100%',
    minHeight: '100%'
  },
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAddButton: { backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  headerAddButtonText: { color: '#fff', fontWeight: '600' },
  logoutButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#ef4444' },
  logoutText: { color: '#fff', fontWeight: '600' },
  listContainer: { padding: 16, paddingBottom: 100 },
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
  actionColumn: { justifyContent: 'center', marginLeft: 12, gap: 8 },
  actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, alignItems: 'center' },
  editButton: { backgroundColor: '#eff6ff' },
  editText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
  deleteButton: { backgroundColor: '#fee2e2' },
  deleteText: { color: '#dc2626', fontWeight: '600', fontSize: 14 },
  buttonText: { color: '#fff', fontWeight: '600' },
  loader: { flex: 1, justifyContent: 'center' },
  errorBox: { padding: 16, backgroundColor: '#fef2f2', margin: 16, borderRadius: 6, alignItems: 'center' },
  errorText: { color: '#b91c1c', marginBottom: 8, textAlign: 'center' },
  retryButton: { backgroundColor: '#dc2626', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 99, 
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 }
  },
  fabText: { color: '#fff', fontSize: 32, fontWeight: '300', marginTop: -2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '90%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center'
  }
}); 