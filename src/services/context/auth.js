import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedAuthStatus = localStorage.getItem("isAuthenticated");
      
      if (storedUser && storedAuthStatus === "true") {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error reading auth data from localStorage:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.error("Error saving auth data to localStorage:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    } catch (error) {
      console.error("Error removing auth data from localStorage:", error);
    }
  };

  // Optional: Update user data without full re-login
  const updateUser = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error updating user data in localStorage:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};