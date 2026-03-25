import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../utils/theme';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.primaryDark },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register" />
    </Stack>
  );
};

export default AuthLayout;