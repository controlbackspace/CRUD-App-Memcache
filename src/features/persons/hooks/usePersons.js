import { useState, useCallback } from 'react';
import { personsService } from '../services/persons.service'; 
import { useAuth } from '../../auth/hooks/useAuth'; 

export function usePersons() {
  const [persons, setPersons] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const { token } = useAuth(); 


  const fetchPersons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      
      if (!token) {
        throw new Error("Access token required. Please login to get a token.");
      }
      const data = await personsService.getAll(token);
      setPersons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addPerson = useCallback(async (personPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPerson = await personsService.create(token, personPayload);
      setPersons((prev) => [...prev, newPerson]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const editPerson = useCallback(async (id, personPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await personsService.update(token, id, personPayload);
      setPersons((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...personPayload } : item))
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const removePerson = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Session credentials missing. Please log in again.");
      }

      // FIX: Call the service layer instead of hardcoding localhost
      await personsService.delete(token, id);
      // ^^^ FIX: Standardizes API endpoints across environments (web/emulator/physical)

      // FIX: Filter the state immediately to update the UI
      setPersons((prevPersons) => prevPersons.filter((p) => p.id !== id));

      return { success: true };
    } catch (err) {
      console.error("❌ removePerson failure:", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    persons,
    isLoading,
    error,
    fetchPersons,
    addPerson,
    editPerson,
    removePerson
  };
}