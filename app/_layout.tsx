import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const DONE_KEY = 'onboarding_done';

export default function RootLayout() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(true);
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem(DONE_KEY);
      setIsOnboardingComplete(done === '1');
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isOnboardingComplete !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isOnboardingComplete]);

  if (!fontsLoaded || isOnboardingComplete === null) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isOnboardingComplete
        ? <Stack.Screen name="onboarding" />
        : (
          <>
            <Stack.Screen name="signin" />
            <Stack.Screen name="(tabs)" />
          </>
        )}
    </Stack>
  );
}
