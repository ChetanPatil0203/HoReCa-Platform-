import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [vendorType, setVendorType] = useState('raw-material');

  const login = (role, token, type = 'raw-material') => {
    setIsLoading(true);
    setUserToken(token);
    setUserRole(role);
    setVendorType(type);
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    setUserRole(null);
    setVendorType('raw-material');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, userRole, vendorType }}>
      {children}
    </AuthContext.Provider>
  );
};
