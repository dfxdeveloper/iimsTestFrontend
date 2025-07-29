import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../config/axiosInstance';


const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "RzVrN3VoSVAwNUdrWTU4SFBKWkRxckp3TnR6cEdTNldUeFBHU0FVSg==";

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('https://api.countrystatecity.in/v1/countries', {
        headers: {
          'X-CSCAPI-KEY': apiKey
        }
      });
      setCountries(response);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const fetchStates = useCallback(async (countryIso2) => {
    if (!countryIso2) {
      setStates([]);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(
        `https://api.countrystatecity.in/v1/countries/${countryIso2}/states`,
        {
          headers: {
            'X-CSCAPI-KEY': apiKey
          }
        }
      );
      setStates(response);
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const fetchCities = useCallback(async (countryIso2, stateIso2) => {
    if (!countryIso2 || !stateIso2) {
      setCities([]);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(
        `https://api.countrystatecity.in/v1/countries/${countryIso2}/states/${stateIso2}/cities`,
        {
          headers: {
            'X-CSCAPI-KEY': apiKey
          }
        }
      );
      setCities(response);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return (
    <LocationContext.Provider
      value={{
        countries,
        states,
        cities,
        loading,
        fetchStates,
        fetchCities
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};