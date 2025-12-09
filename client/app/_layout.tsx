import { Stack } from "expo-router";
import { AppProvider } from "../state/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="data" options={{ headerShown: false }} />
        <Stack.Screen name="support" options={{ headerShown: false }} />
        <Stack.Screen name="ai" options={{ headerShown: false }} />
        <Stack.Screen name="project" options={{ headerShown: false }} />
        <Stack.Screen name="people" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  )
}
