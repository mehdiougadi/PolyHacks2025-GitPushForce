// client/components/ChatBot.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';

import { appJson } from '@client/constants/api-key';
const { expo: { extra: { OPENAI_API_KEY } } } = appJson;

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatBot() {
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add the user message to the log
    const newChatLog = [...chatLog, { sender: 'user' as 'user', text: inputText }];
    setChatLog(newChatLog);
    setLoading(true);

    try {
      // Prepare the conversation history for the API
      // Start with a system message that instructs ChatGPT to provide agricultural advice.
      const messages = [
        {
          role: "system",
          content: "You are a helpful agricultural assistant. Provide clear and actionable advice for farmers based on their questions."
        },
        ...newChatLog.map(msg => ({
          role: msg.sender === 'user' ? "user" : "assistant",
          content: msg.text,
        })),
        // Also include the latest user message explicitly:
        { role: "user", content: inputText }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      console.log('API response:', data);

      // Check if the API returned an error
    if (data.error) {
        throw new Error(data.error.message);
    }

    // Validate that the structure is as expected
    if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Unexpected API response structure");
    }

      const reply = data.choices[0].message.content.trim();

      setChatLog(prev => [...prev, { sender: 'bot', text: reply }]);
      setInputText('');
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      setChatLog(prev => [...prev, { sender: 'bot', text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {chatLog.map((msg, index) => (
          <Text
            key={index}
            style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}
          >
            {msg.sender === 'user' ? 'You: ' : 'Advisor: '}{msg.text}
          </Text>
        ))}
        {loading && <ActivityIndicator size="small" color="#007AFF" />}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Ask your question..."
        multiline
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    marginBottom: 4,
    borderRadius: 8,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    padding: 8,
    marginBottom: 4,
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});
