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
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const { showMessage } = useMessage();

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setQuantity(editItem.quantity);
      setUnit(editItem.unit);
      setAveragePrice(editItem.averagePrice?.toString() || '');
      setSellPrice(editItem.sellPrice?.toString() || '');
    } else {
      resetForm();
    }
  }, [editItem]);

  const resetForm = () => {
    setName('');
    setQuantity(0);
    setUnit('');
    setAveragePrice('');
    setSellPrice('');
  };

  const handleQuantityChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText === '') {
      setQuantity(0);
    } else {
      const newValue = parseInt(cleanedText, 10);
      if (!isNaN(newValue)) {
        setQuantity(newValue);
      }
    }
  };

  const handleQuantityIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleQuantityDecrement = () => {
    setQuantity(prev => Math.max(0, prev - 1));
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
      category,
      quantity: quantity,
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

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleQuantityDecrement}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              textAlign="center"
            />
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleQuantityIncrement}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#121212',
  },
  quantityInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 10,
    fontSize: 16,
    textAlign: 'center',
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