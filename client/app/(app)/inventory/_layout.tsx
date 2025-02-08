import { Stack } from 'expo-router';

export default function InventoryLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Inventory Categories' }} 
      />
      <Stack.Screen 
        name="[category]" 
        options={{ title: 'Category Items' }} 
      />
    </Stack>
  );
}