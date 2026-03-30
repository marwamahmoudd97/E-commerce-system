import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/types';
import { usersApi } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });


  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken;
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      console.log("[AuthContext] Token saved to localStorage");
    } else {
      console.log("[AuthContext] Token is null. Removing from localStorage.");
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await usersApi.login({ email, password });

      console.log("LOGIN RESPONSE:", response);

      if (response.success && response.data) {
        const userData = response.data;

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role   
        });

        if (userData.token) {
          setToken(userData.token);
        } else {
          console.error("No token returned from backend");
        }

        toast.success("Login successful");
        return true;
      } else {
        toast.error(response.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      toast.error("Server error during login");
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const response = await usersApi.register(userData);

      console.log("[AuthContext] Register response:", response);

      if (response.success && response.data) {
        setUser(response.data);

        // Check if token exists in response
        if (response.token) {
          setToken(response.token);
          console.log("[AuthContext] Token saved to state");
        } else {
          console.warn("[AuthContext] No token found in register response");
        }

        toast.success('Account created successfully!');
        return true;
      } else {
        toast.error(response.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error("[AuthContext] Register error:", error);
      toast.error('An error occurred during registration');
      return false;
    }
  };

  const logout = () => {
    console.log("[AuthContext] Logout called. Clearing user and token.");
    setUser(null);
    setToken(null);

    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, register, logout, updateUser }}>
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
