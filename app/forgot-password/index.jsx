import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { Link, router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { forgotPassword } = useContext(AuthContext);

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email);
      setOtpSent(true);
      alert('OTP sent! Check your email.');
    } catch (error) {
      console.log('Forgot Password Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Request failed');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl text-center text-gray-800 mb-4">Forgot Password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-2 mb-2 rounded"
      />
      {!otpSent && <Button title="Send OTP" onPress={handleForgotPassword} color="#4CAF50" />}
      {otpSent && (
        <TouchableOpacity className="mt-2">
          <Link href="/reset-password" className="text-blue-500 text-center">Go to Reset Password</Link>
        </TouchableOpacity>
      )}
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