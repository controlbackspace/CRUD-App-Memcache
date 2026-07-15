const BASE_URL = "http://localhost:5000/api/persons";

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
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(personData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to create new person record.");
    return data;
  },
  update: async (token, id, personData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(personData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update person record.");
    return data;
  },
  delete: async (token, id) => {
    // ^^^ FIX: Declares both parameters so your security token successfully forwards to the server
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // FIX: Inject the Bearer token credentials to pass backend auth.js middleware
          'Authorization': `Bearer ${token}`
        }
      });
      // ^^^ FIX: Standardizes the delete request, passing the validation gates

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete record from database.');
      }

      return data;
    } catch (error) {
      console.error('❌ Service Layer Delete Error:', error.message);
      throw error; // Let the hook catch and alert this to the UI screen
    }
  }
};
