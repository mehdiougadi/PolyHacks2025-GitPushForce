import { Tabs } from "expo-router";
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Screens */}
      <Tabs.Screen 
        name="home/index" 
        options={{ title: "Farm Dashboard" }} 
      />
      <Tabs.Screen 
        name="inventory/index" 
        options={{ title: "Inventory Management" }} 
      />
    </Tabs>
  );
}
