import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../config/axiosInstance';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompany = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userString = localStorage.getItem('user');

      // Check if user data exists
      if (!userString) {
        throw new Error('User data not found in localStorage');
      }

      let user;
      try {
        user = JSON.parse(userString);
      } catch (parseError) {
        throw new Error('Invalid user data in localStorage');
      }

      const companyId = user?.companyId;
      if (!companyId || companyId === 'undefined') {
        throw new Error('Company ID not found in user data');
      }
      const response = await api.get(`/companies/${companyId}`);
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching company:", error);
      setError(error.message || 'Failed to fetch company data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const value = {
    company,
    setCompany,
    isLoading,
    error,
    fetchCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};