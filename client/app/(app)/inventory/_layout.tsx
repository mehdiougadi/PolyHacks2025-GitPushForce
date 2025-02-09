import { Stack } from 'expo-router';

export default function InventoryLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
      />
      <Stack.Screen 
        name="items" 
      />
      <Stack.Screen 
        name="[item]/data" 
        options={{ 
          title: 'Item Data',
          presentation: 'modal' 
        }} 
      />
    </Stack>
  );
}