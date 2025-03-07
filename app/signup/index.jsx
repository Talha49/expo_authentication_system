import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { Link, router } from 'expo-router';

export default function SignupScreen() {
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('signup');
  const { signup, verifyOtp } = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      // Ensure the order matches the backend: fullName, contact, city, email, password
      await signup(fullName, contact, city, email, password);
      setStep('verify');
      alert('Signup successful! Check your email for OTP.');
    } catch (error) {
      console.log('Signup Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Signup failed');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(email, otp);
      alert('OTP verified! Welcome aboard.');
    } catch (error) {
      console.log('OTP Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'OTP verification failed');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl text-center text-gray-800 mb-4">
        {step === 'signup' ? 'Signup' : 'Verify OTP'}
      </Text>
      {step === 'signup' ? (
        <>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            className="border border-gray-300 p-2 mb-2 rounded"
          />
          <TextInput
            placeholder="Contact"
            value={contact}
            onChangeText={setContact}
            className="border border-gray-300 p-2 mb-2 rounded"
          />
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            className="border border-gray-300 p-2 mb-2 rounded"
          />
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
          <Button title="Signup" onPress={handleSignup} color="#4CAF50" />
          <TouchableOpacity className="mt-2">
            <Link href="/login" className="text-blue-500 text-center">Go to Login</Link>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 p-2 mb-2 rounded"
          />
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            className="border border-gray-300 p-2 mb-2 rounded"
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} color="#4CAF50" />
        </>
      )}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/index')}
        className="mt-4 bg-gray-500 p-2 rounded"
      >
        <Text className="text-white text-center">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}