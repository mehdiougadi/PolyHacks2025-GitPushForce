import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { INVENTORY_CATEGORIES } from '../../constants/InventoryCategories';

export default function InventoryCategoriesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={INVENTORY_CATEGORIES}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/inventory/${item.name}`} style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>
              {item.items.length} items available
            </Text>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  cardText: {
    fontSize: 14,
    color: Colors.dark.text,
    marginTop: 4,
  },
});