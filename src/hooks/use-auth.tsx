'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authStatus = localStorage.getItem('brc_admin_auth');
      const userString = localStorage.getItem('brc_admin_user');
      
      if (authStatus === 'true' && userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('brc_admin_auth');
    localStorage.removeItem('brc_admin_user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/admin/login');
  };

  const login = (userData: AdminUser) => {
    localStorage.setItem('brc_admin_auth', 'true');
    localStorage.setItem('brc_admin_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    checkAuth
  };
};