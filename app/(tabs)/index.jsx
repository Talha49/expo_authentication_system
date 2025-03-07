import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { logout, getUserData, getToken, loading: authLoading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('getToken function:', getToken);
        const data = await getUserData();
        setUserData(data);
        const tokenValue = await getToken();
        console.log('Fetched Token:', tokenValue);
        setToken(tokenValue);
      } catch (error) {
        console.log('Fetch Error:', error.response?.data || error.message);
        alert('Failed to fetch data or token');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getUserData, getToken]);

  if (authLoading || loading) {
    return <Text className="text-center">Loading...</Text>;
  }

  if (!userData && !token) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-700">You are not logged in.</Text>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="mt-4 bg-blue-500 p-2 rounded"
        >
          <Text className="text-white">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-xl text-gray-800">Welcome to Home!</Text>
      {userData ? (
        <>
          <Text className="text-gray-700">Full Name: {userData.fullName}</Text>
          <Text className="text-gray-700">Email: {userData.email}</Text>
          <Text className="text-gray-700">Contact: {userData.contact}</Text>
          <Text className="text-gray-700">City: {userData.city}</Text>
        </>
      ) : (
        <Text className="text-gray-700">No user data available</Text>
      )}
      {token ? (
        <Text className="text-gray-700">Token: {token}</Text>
      ) : (
        <Text className="text-gray-700">No token available</Text>
      )}
      <Button title="Logout" onPress={logout} color="#ff4444" />
    </View>
  );
}