import React from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { Stack } from 'expo-router';
import '../global.css';
export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Globally disable headers for all screens
        }}
      >
        {/* Set Home as the initial route */}
        <Stack.Screen name="(tabs)/index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </AuthProvider>
  );
}