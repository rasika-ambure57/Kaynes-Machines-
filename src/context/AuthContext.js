import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@pat_auth_user_v1';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted user on app startup
  useEffect(() => {
    const loadPersistedUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load user from AsyncStorage:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadPersistedUser();
  }, []);

  const login = async (role, userName) => {
    const resolvedName = userName?.trim() ? userName.trim() : getDefaultRoleName(role);
    const userData = {
      role, // 'admin' | 'operator' | 'viewer'
      name: resolvedName,
      loggedInAt: new Date().toISOString(),
    };
    setUser(userData);
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn('Failed to persist user session:', e);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear user session:', e);
    }
  };

  const getDefaultRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Plant Admin';
      case 'operator':
        return 'Floor Operator';
      case 'viewer':
        return 'Plant Viewer';
      default:
        return 'Plant User';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isOperator: user?.role === 'operator',
        isViewer: user?.role === 'viewer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
