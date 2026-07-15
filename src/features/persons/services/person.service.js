// C:\Users\jakea\Basic_CRUD_Application\src\services\persons.service.js
import { Platform } from 'react-native'; 
// ^^^ EXISTING: Crucial platform detection tool

// FIX: Helper declared BEFORE BASE_URL initialization
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/persons'; 
  }
  return 'http://localhost:5000/api/persons'; 
};

const BASE_URL = getBaseUrl();
// ^^^ FIX: Unified single declaration evaluated at runtime without duplicate variable bindings

// FIX: Single, clean export module containing all resolved operations
export const personsService = {
  getAll: async (token) => {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch persons records.");
    return data;
  },

  create: async (token, personData) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(personData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create new person record.');
    return data;
  },

  update: async (token, id, personData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(personData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update person record.');
    return data;
  },

  delete: async (token, id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete person record.');
    return data;
  }
};
// ^^^ FIX: Standardized, deduplicated, and clean service architecture