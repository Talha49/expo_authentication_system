import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { router } from 'expo-router';

const API_URL = 'http://192.168.100.174:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log('API_URL in useEffect:', API_URL);
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const userData = await axios.get(`${API_URL}/auth/user`);
          setUser({ token, ...userData.data });
        } catch (error) {
          console.log('Auth check failed:', error.message);
          await SecureStore.deleteItemAsync('token');
        }
      } else {
        if (router.canGoBack()) router.replace('/login');
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signup = async (fullName, contact, city, email, password) => {
    try {
      console.log('Signup URL:', `${API_URL}/auth/signup`);
      console.log('Signup Data:', { fullName, contact, city, email, password }); // Debug data
      await axios.post(`${API_URL}/auth/signup`, { fullName, contact, city, email, password });
    } catch (error) {
      console.log('Signup Error Details:', error.response?.data || error.toJSON());
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
    const { token } = res.data;
    await SecureStore.setItemAsync('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ token });
    router.replace('/(tabs)');
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token } = res.data;
    await SecureStore.setItemAsync('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ token });
    router.replace('/(tabs)');
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    await axios.post(`${API_URL}/auth/logout`);
    router.replace('/login');
  };

  const forgotPassword = async (email) => {
    await axios.post(`${API_URL}/auth/forgot-password`, { email });
  };

  const resetPassword = async (email, otp, password) => {
    await axios.post(`${API_URL}/auth/reset-password`, { email, otp, password });
  };

  const getUserData = async () => {
    const res = await axios.get(`${API_URL}/auth/user`);
    return res.data;
  };

  const getToken = async () => {
    return await SecureStore.getItemAsync('token');
  };

  return (
    <AuthContext.Provider value={{ user, signup, verifyOtp, login, logout, forgotPassword, resetPassword, getUserData, getToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};