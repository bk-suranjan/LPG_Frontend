import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { COLORS } from "./utils/theme";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryDark }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.primaryDark },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="user/screen" />
        <Stack.Screen name="user/subScreen/[GasDetails]" />
        <Stack.Screen name="admin/screens" />
        <Stack.Screen name="admin/subscreens/[Details]" />
        <Stack.Screen name="superadmin/screens" />
      </Stack>
    </SafeAreaView>
  );
}
