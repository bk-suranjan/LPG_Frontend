import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
  <SafeAreaView style={{flex:1}}>
    <Stack screenOptions={{headerShown:false}} >
    <Stack.Screen name="(auth)"/>
    <Stack.Screen name="user/screen" />
    <Stack.Screen name="user/subScreen/[GasDetails]" />

    <Stack.Screen name="admin/screens"/>
    <Stack.Screen name="admin/subscreens/[Details]"/>
  </Stack>
  </SafeAreaView>
  )
}
