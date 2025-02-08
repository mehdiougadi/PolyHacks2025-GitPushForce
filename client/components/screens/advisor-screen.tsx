import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdvisorScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Advisor Chatbot</Text>
      
      <Text style={styles.description}>
        Welcome to the Farm Advisor! Here, you can ask questions about farming practices, crop management, and more.
      </Text>

      {/* Placeholder text for future chatbot */}
      <Text style={styles.chatbotInstructions}>
        Once the chatbot is integrated, you will be able to ask farming-related questions here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  chatbotInstructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});

export default AdvisorScreen;
