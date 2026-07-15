import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';

export default function PersonForm({ initialData = null, onSave, onCancel, isLoading = false }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState(''); // Expected Format: YYYY-MM-DD
  const [sex, setSex] = useState('male');
  const [age, setAge] = useState('');

  // Hydrate fields if we are editing an existing record
  useEffect(() => {
    if (initialData) {
      setFirstname(initialData.firstname || '');
      setLastname(initialData.lastname || '');
      setDob(initialData.dob || '');
      setSex(initialData.sex || 'male');
      setAge(initialData.age ? initialData.age.toString() : '');
    }
  }, [initialData]);

  // Automatically calculate age whenever DOB changes
  useEffect(() => {
    if (!dob) {
      setAge('');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) {
      setAge('');
      return; 
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      setAge('');
      return;
    }

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < 0) {
      setAge('');
      return;
    }

    setAge(calculatedAge.toString());
  }, [dob]);

  const handleSubmit = () => {
    if (!firstname.trim() || !lastname.trim() || !dob.trim()) {
      Alert.alert('Validation Error', 'First Name, Last Name, and DOB (YYYY-MM-DD) are required.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) {
      Alert.alert('Validation Error', 'Date of Birth must match the YYYY-MM-DD format.');
      return;
    }

    const calculatedAgeNum = parseInt(age, 10);
    if (isNaN(calculatedAgeNum) || calculatedAgeNum < 0) {
      Alert.alert('Validation Error', 'Invalid Date of Birth. Age cannot be calculated into a negative value.');
      return;
    }

    const payload = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      dob: dob.trim(),
      sex,
      age: calculatedAgeNum
    };

    onSave(payload);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>First Name *</Text>
      <TextInput
        style={styles.input}
        value={firstname}
        onChangeText={setFirstname}
        placeholder="Enter first name"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Last Name *</Text>
      <TextInput
        style={styles.input}
        value={lastname}
        onChangeText={setLastname}
        placeholder="Enter last name"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Date of Birth (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        value={dob}
        onChangeText={setDob}
        placeholder="e.g. 1995-04-12"
        placeholderTextColor="#9ca3af"
        maxLength={10}
      />

      <Text style={styles.label}>Sex</Text>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.dropdownOption, sex === 'male' && styles.dropdownOptionSelected]}
          onPress={() => setSex('male')}
        >
          <Text style={[styles.dropdownText, sex === 'male' && styles.dropdownTextSelected]}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dropdownOption, sex === 'female' && styles.dropdownOptionSelected]}
          onPress={() => setSex('female')}
        >
          <Text style={[styles.dropdownText, sex === 'female' && styles.dropdownTextSelected]}>Female</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Calculated Age</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={age}
        editable={false}
        placeholder="Calculated automatically"
        placeholderTextColor="#9ca3af"
      />

      {/* Action Bar Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Record</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb'
  },
  disabledInput: {
    backgroundColor: '#e5e7eb',
    color: '#4b5563'
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  dropdownOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f9fafb'
  },
  dropdownOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#eff6ff'
  },
  dropdownText: {
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '500'
  },
  dropdownTextSelected: {
    color: '#007AFF',
    fontWeight: '600'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff'
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 16
  },
  saveButton: {
    backgroundColor: '#007AFF'
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16
  }
});