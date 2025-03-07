import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          headerShown: false, // Ensure no header here too
        }} 
      />
      {/* Add more tabs here if needed in the future */}
    </Tabs>
  );
}