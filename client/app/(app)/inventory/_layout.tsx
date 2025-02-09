import { Tabs } from 'expo-router';

export default function InventoryLayout() {
  return (
    <Tabs 
      screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' }  }}
    >
      <Tabs.Screen 
        name="index" 
      />
      <Tabs.Screen 
        name="items" 
      />
      <Tabs.Screen 
        name="[item]/data" 
      />
    </Tabs>
  );
}