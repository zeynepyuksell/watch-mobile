import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0D1118' },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: '#0D1118' },
      }}
    >
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="language-selection" options={{ title: 'Language', headerShown: false }} />
      <Stack.Screen name="edit-phone" options={{ title: 'Edit Phone', headerShown: false }} />
      <Stack.Screen name="edit-email" options={{ title: 'Edit Email', headerShown: false }} />
      <Stack.Screen name="change-password" options={{ title: 'Change Password', headerShown: false }} />
    </Stack>
  );
}


