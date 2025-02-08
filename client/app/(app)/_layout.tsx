import { Tabs } from "expo-router";
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Main Tab Navigation */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Other Screens */}
      <Stack.Screen 
        name="home/index" 
        options={{ title: "Farm Dashboard" }} 
      />
      <Stack.Screen 
        name="inventory/index" 
        options={{ title: "Inventory Management" }} 
      />
    </Stack>
  );
}
