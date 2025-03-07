import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.log('Login Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl text-center text-gray-800 mb-4">Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-2 mb-2 rounded"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 p-2 mb-2 rounded"
      />
      <Button title="Login" onPress={handleLogin} color="#4CAF50" />
      <TouchableOpacity className="mt-2">
        <Link href="/forgot-password" className="text-blue-500 text-center">Forgot Password?</Link>
      </TouchableOpacity>
      <TouchableOpacity className="mt-2">
        <Link href="/signup" className="text-blue-500 text-center">Go to Signup</Link>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/index')}
        className="mt-4 bg-gray-500 p-2 rounded"
      >
        <Text className="text-white text-center">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}