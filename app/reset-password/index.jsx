import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { Link, router } from 'expo-router';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const { resetPassword } = useContext(AuthContext);

  const handleResetPassword = async () => {
    try {
      await resetPassword(email, otp, password);
      alert('Password reset successful.');
      router.replace('/login');
    } catch (error) {
      console.log('Reset Password Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl text-center text-gray-800 mb-4">Reset Password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-2 mb-2 rounded"
      />
      <TextInput
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        className="border border-gray-300 p-2 mb-2 rounded"
      />
      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 p-2 mb-2 rounded"
      />
      <Button title="Reset Password" onPress={handleResetPassword} color="#4CAF50" />
      <TouchableOpacity className="mt-2">
        <Link href="/login" className="text-blue-500 text-center">Back to Login</Link>
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