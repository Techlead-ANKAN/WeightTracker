import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    if (password === 'Ankan@1234') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const loginWithBiometric = async () => {
    try {
      // Check if Web Authentication API is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported');
      }

      // For simplicity, we'll just check if the user has previously set up biometric
      const hasBiometric = localStorage.getItem('biometricEnabled');
      
      if (hasBiometric === 'true') {
        // In a real app, this would trigger actual biometric verification
        // For this demo, we'll simulate it
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      } else {
        throw new Error('Biometric not set up. Please use password first.');
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw error;
    }
  };

  const enableBiometric = () => {
    // Enable biometric for future logins after successful password login
    localStorage.setItem('biometricEnabled', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    loginWithBiometric,
    enableBiometric,
    logout,
    userId: 'Ankan Maity'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
