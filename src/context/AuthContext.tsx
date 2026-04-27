"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken as setLocalToken, removeToken as removeLocalToken } from '@/utils/authClient';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const base64Url = storedToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          );
          const parsedUser = JSON.parse(jsonPayload);

          // Check if token is expired (optional, depending on payload)
          if (parsedUser.exp && parsedUser.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }

          setTokenState(storedToken);
          setUser(parsedUser);
        } catch (e) {
          console.error("Invalid token, auto logging out", e);
          removeLocalToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string) => {
    setLocalToken(newToken);
    try {
      const base64Url = newToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const parsedUser = JSON.parse(jsonPayload);
      setTokenState(newToken);
      setUser(parsedUser);
    } catch (e) {
      console.error("Invalid token on login", e);
    }
  };

  const logout = () => {
    removeLocalToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
