import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../config/axiosInstance';


const PartnersContext = createContext();

export const usePartners = () => {
  const context = useContext(PartnersContext);
  if (!context) {
    throw new Error('usePartners must be used within a PartnersProvider');
  }
  return context;
};

export const PartnersProvider = ({ children }) => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/partners");
      const formattedPartners = response.data.map((partner, index) => ({
        srNo: (index + 1).toString().padStart(2, "0"),
        type: partner.type,
        clientName: partner.clientName,
        email: partner.email,
        mobile: partner.mobile,
        city: partner.city,
        pinCode: partner.pinCode,
        ...partner,
      }));
      setPartners(formattedPartners);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const value = {
    partners,
    setPartners,
    isLoading,
    fetchPartners,
  };

  return (
    <PartnersContext.Provider value={value}>
      {children}
    </PartnersContext.Provider>
  );
};