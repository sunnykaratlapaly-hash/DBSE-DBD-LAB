import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../utils/demoData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_auth_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // default Admin for showcase
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('dhms_jwt_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dhms_demo_payload';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dhms_auth_user', JSON.stringify(currentUser));
      const simulatedJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
        sub: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        exp: Math.floor(Date.now() / 1000) + 86400
      }))}.signature_hash`;
      localStorage.setItem('dhms_jwt_token', simulatedJwt);
      setToken(simulatedJwt);
    } else {
      localStorage.removeItem('dhms_auth_user');
      localStorage.removeItem('dhms_jwt_token');
      setToken(null);
    }
  }, [currentUser]);

  const login = (email, password, requestedRole) => {
    // Check if user exists in initial list by email or role
    let found = INITIAL_USERS.find(
      (u) => (requestedRole && u.role === requestedRole) || u.email.toLowerCase() === email.toLowerCase()
    );

    if (!found) {
      // Create ad-hoc user for registration / custom login
      found = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
        email: email,
        role: requestedRole || 'Patient',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        title: `${requestedRole || 'Patient'} Member`,
        department: 'Clinical Care'
      };
    }

    setCurrentUser(found);
    return found;
  };

  const switchRole = (roleName) => {
    const targetUser = INITIAL_USERS.find((u) => u.role === roleName);
    if (targetUser) {
      setCurrentUser(targetUser);
      return targetUser;
    }
    return currentUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (userData) => {
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'Patient',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Registered Member',
      department: 'General Care'
    };
    setCurrentUser(newUser);
    return newUser;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        role: currentUser?.role || 'Guest',
        token,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
