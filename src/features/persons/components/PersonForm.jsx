// src/features/persons/components/PersonForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SEX_OPTIONS = ['Male', 'Female'];

export default function PersonForm({ initialData, onSave, onCancel, isLoading }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('Male');

  useEffect(() => {
    if (initialData) {
      setFirstname(initialData.firstname || '');
      setLastname(initialData.lastname || '');
      setDob(initialData.dob || '');
      setSex(initialData.sex || 'Male');
    } else {
      setFirstname('');
      setLastname('');
      setDob('');
      setSex('Male');
    }
  }, [initialData]);

  const getLiveAge = () => {
    const cleanedDob = dob.trim();
    if (!cleanedDob) return null;

    const dobParts = cleanedDob.split('-');
    if (dobParts.length !== 3) return null;

    const [yearText, monthText, dayText] = dobParts;
    const birthYear = Number.parseInt(yearText, 10);
    const birthMonth = Number.parseInt(monthText, 10);
    const birthDay = Number.parseInt(dayText, 10);

    if ([birthYear, birthMonth, birthDay].some((value) => Number.isNaN(value))) {
      return null;
    }

    if (birthYear < 1900 || birthYear > new Date().getFullYear()) return null;
    if (birthMonth < 1 || birthMonth > 12) return null;
    if (birthDay < 1 || birthDay > 31) return null;

    const now = new Date();
    const birthDate = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay));
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    let exactAge = today.getUTCFullYear() - birthDate.getUTCFullYear();
    if (
      today.getUTCMonth() < birthDate.getUTCMonth() ||
      (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate())
    ) {
      exactAge -= 1;
    }

    return exactAge >= 0 ? exactAge : 0;
  };

  const liveAge = getLiveAge();
  const isDobComplete = /^\d{4}-\d{2}-\d{2}$/.test(dob.trim());

  const handleSubmit = () => {
    if (!firstname.trim() || !lastname.trim() || !dob.trim() || !sex.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    onSave({ firstname, lastname, dob, sex });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstname}
        onChangeText={setFirstname}
        placeholder="Enter first name"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastname}
        onChangeText={setLastname}
        placeholder="Enter last name"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={dob}
        onChangeText={setDob}
        placeholder="e.g., 1995-08-24"
        placeholderTextColor="#9ca3af"
      />

      <View style={styles.calculatedAgeWrapper}>
        <Text style={styles.calculatedAgeLabel}>Calculated age</Text>
        <Text style={styles.calculatedAgeValue}>
          {liveAge !== null ? `${liveAge} years` : isDobComplete ? 'Enter a valid DOB' : 'Enter full DOB to calculate age'}
        </Text>
      </View>

      <Text style={styles.label}>Sex assigned at birth</Text>
      
     <View style={styles.pickerWrapper}>
      {/* ^^^ FIX: Styled container bounding box */}
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
          dropdownIconColor="#4b5563"
          style={styles.picker}
        >
        {/* ^^^ FIX: Native dropdown control replacing TouchableOpacity */}
          {SEX_OPTIONS.map((option) => (
            <Picker.Item 
              key={option} 
              label={option} 
              value={option} 
            />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Record</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { width: '100%', paddingVertical: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: '#111827'
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownTriggerText: {
    fontSize: 16,
    color: '#111827'
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#4b5563'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdownModalContent: {
    backgroundColor: '#ffffff',
    width: '80%',
    maxWidth: 320,
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10
  },
  pickerWrapper: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    minHeight: 48,
  },
  picker: {
    height: Platform.OS === 'web' ? 48 : 50,
    width: '100%',
    color: '#111827',
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
      cursor: 'pointer',
    }),
  },
  dropdownModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
    textAlign: 'center'
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 4
  },
  dropdownItemSelected: {
    backgroundColor: '#eff6ff'
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#4b5563'
  },
  dropdownItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600'
  },
  calculatedAgeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
  },
  calculatedAgeLabel: { fontSize: 14, fontWeight: '600', color: '#166534' },
  calculatedAgeValue: { fontSize: 16, fontWeight: '700', color: '#15803d' },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, alignItems: 'center', justifyContent: 'center', minWidth: 100 },
  cancelButton: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#d1d5db' },
  cancelButtonText: { color: '#4b5563', fontWeight: '600' },
  saveButton: { backgroundColor: '#007AFF' },
  saveButtonText: { color: '#fff', fontWeight: '600' }
  
});