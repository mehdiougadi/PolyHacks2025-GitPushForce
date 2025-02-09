import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' }  }}>
      <Tabs.Screen 
        name="inventory/index" 
      />
      <Tabs.Screen 
        name="inventory/[category]" 
      />
    </Tabs>
  );
}
