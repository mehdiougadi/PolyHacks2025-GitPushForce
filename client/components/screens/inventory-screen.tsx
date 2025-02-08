import { View, Text, FlatList, Button } from 'react-native';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import DefaultScreen from "@client/components/screens/default-screen";

interface InventoryCategory {
  id: string;
  name: string;
  count: number;
}

export default function InventoryScreen() {
  const categories: InventoryCategory[] = [
    { id: '1', name: 'Seeds', count: 45 },
    { id: '2', name: 'Fertilizers', count: 23 },
    { id: '3', name: 'Tools', count: 15 },
    { id: '4', name: 'Animal Feed', count: 32 },
    { id: '5', name: 'Machinery Parts', count: 8 },
  ];

  const renderItem = ({ item }: { item: InventoryCategory }) => (
    <DefaultScreen>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.count}>Quantity: {item.count}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" color={Colors.light.tint} />
        <Button title="Delete" color="#dc3545" />
      </View>
    </DefaultScreen>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Farm Inventory' }} />
      <Button title="Add New Item" color={Colors.light.tint} />
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// Rest of the styles remain the same with color updates
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: Colors.light.background,
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  count: {
    fontSize: 16,
    color: Colors.dark.text,
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
});