import { View, Text, FlatList, Button } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { INVENTORY_CATEGORIES, InventoryItem } from '../../../constants/InventoryCategories';

export default function CategoryInventoryScreen() {
  const { category } = useLocalSearchParams();
  const selectedCategory = INVENTORY_CATEGORIES.find(c => c.name === category);

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.count}>Unit: {item.unit}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" color={Colors.light.tint} />
        <Button title="Delete" color="#dc3545" />
      </View>
    </View>
  );

  if (!selectedCategory) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: selectedCategory.name }} />
      <Button title="Add New Item" color={Colors.light.tint} />
      <FlatList
        data={selectedCategory.items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Keep your existing styles from inventory-screen.tsx
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