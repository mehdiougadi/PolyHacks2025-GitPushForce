import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Item from '@common/interfaces/item';
import { useSegments } from "expo-router";
import { useAuth } from '@client/contexts/auth-context';
import InventoryModal from '@client/components/modals/item-modal';
import { useMessage } from '@client/contexts/message-context';

export default function InventoryScreen() {
  const segments = useSegments();
  const category = segments[segments.length - 1];
  const { user, updateUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const { showMessage } = useMessage();

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleDeleteItem = (itemName: string) => {
    showMessage("Are you sure you want to delete this item?");
    if (user) {
      const updatedItems = (user.items || []).filter(item => item.name !== itemName);
      updateUser({ ...user, items: updatedItems });
      showMessage("Item deleted successfully");
    }
  };

  const handleAddItem = () => {
    setEditingItem(undefined);
    setModalVisible(true);
  };

  const handleSaveItem = (item: Item) => {
    if (!user) return;

    const currentItems = user.items || [];
    let updatedItems: Item[];
    
    if (editingItem) {
      updatedItems = currentItems.map(existingItem =>
        existingItem.name === editingItem.name ? item : existingItem
      );
      showMessage("Item updated successfully");
    } else {
      if (currentItems.some(existingItem => existingItem.name === item.name)) {
        showMessage("An item with this name already exists");
        return;
      }
      updatedItems = [...currentItems, item];
      showMessage("Item added successfully");
    }
    
    updateUser({ ...user, items: updatedItems });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.count}>Quantity: {item.quantity} {item.unit}</Text>
        {item.averagePrice && (
          <Text style={styles.price}>Avg. Price: ${item.averagePrice}</Text>
        )}
        {item.sellPrice && (
          <Text style={styles.price}>Sell Price: ${item.sellPrice}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          onPress={() => handleEditItem(item)}
          color="#121212"
        />
        <Button
          title="Delete"
          onPress={() => handleDeleteItem(item.name)}
          color="#dc3545"
        />
      </View>
    </View>
  );

  const filteredItems = (user?.items || []).filter((item) => item.category === category);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Add New Item"
          onPress={handleAddItem}
          color="#121212"
        />
      </View>
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No items in this category</Text>
          <Text style={styles.emptyStateSubtext}>Tap "Add New Item" to get started</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <InventoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        editItem={editingItem}
        category={category}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    padding: 16,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
  },
  count: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});