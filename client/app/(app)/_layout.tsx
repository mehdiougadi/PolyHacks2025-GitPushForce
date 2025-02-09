import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs 
      screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' }  }}
    >
      <Tabs.Screen 
        name="home/index" 
      />
      <Tabs.Screen 
        name="advisor/index" 
      />
      <Tabs.Screen 
        name="inventory" 
      />
    </Tabs>
  );
}
