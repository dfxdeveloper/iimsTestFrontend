import  { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../config/axiosInstance';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompany = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userString = localStorage.getItem('user');
      
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
      if (!companyId) {
        throw new Error('Company ID not found in user data');
      }
      const response = await api.get(`/companies/${companyId}`);
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching company:", error);
      setError(error.message);
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