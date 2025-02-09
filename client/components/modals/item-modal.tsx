import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Item from '@common/interfaces/item';
import { useMessage } from '@client/contexts/message-context';

interface InventoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  editItem?: Item;
  category: string;
}

export default function InventoryModal({
  visible,
  onClose,
  onSave,
  editItem,
  category
}: InventoryModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [unit, setUnit] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const { showMessage } = useMessage();

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setQuantity(editItem.quantity.toString());
      setUnit(editItem.unit);
      setAveragePrice(editItem.averagePrice?.toString() || '');
      setSellPrice(editItem.sellPrice?.toString() || '');
    } else {
      resetForm();
    }
  }, [editItem]);

  const resetForm = () => {
    setName('');
    setQuantity('0');
    setUnit('');
    setAveragePrice('');
    setSellPrice('');
  };

  const handleSave = () => {
    if (!name.trim()) {
      showMessage('Please enter an item name');
      return;
    }

    if (!unit.trim()) {
      showMessage('Please enter a unit of measurement');
      return;
    }

    const newItem: Item = {
      name: name.trim(),
      icon: '📦',
      category,
      quantity: Number(quantity) || 0,
      unit: unit.trim(),
      averagePrice: averagePrice ? Number(averagePrice) : undefined,
      sellPrice: sellPrice ? Number(sellPrice) : undefined,
    };

    onSave(newItem);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {editItem ? 'Edit Item' : 'Add New Item'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Unit (e.g., kg, pieces)"
            value={unit}
            onChangeText={setUnit}
          />

          <TextInput
            style={styles.input}
            placeholder="Average Price (optional)"
            value={averagePrice}
            onChangeText={setAveragePrice}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Sell Price (optional)"
            value={sellPrice}
            onChangeText={setSellPrice}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#6c757d',
  },
  buttonSave: {
    backgroundColor: '#121212',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});