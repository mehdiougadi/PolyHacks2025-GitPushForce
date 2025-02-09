import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appJson } from '@client/constants/api-key';
import { useAuth } from '@client/contexts/auth-context';

const { expo: { extra: { OPENAI_API_KEY } } } = appJson;
const { width } = Dimensions.get('window');

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ChatBot() {
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const { user } = useAuth();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatLog]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      sender: 'user' as const,
      text: inputText.trim(),
      timestamp: new Date()
    };

    const newChatLog = [...chatLog, newMessage];
    setChatLog(newChatLog);
    setInputText('');
    setLoading(true);

    try {
      const messages = [
        {
          role: "system",
          content: `You are a helpful agricultural assistant. Provide clear and actionable advice for farmers based on their questions.`
        },
        ...newChatLog.map(msg => ({
          role: msg.sender === 'user' ? "user" : "assistant",
          content: msg.text,
        }))
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
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Unexpected API response structure");
      }

      const reply = data.choices[0].message.content.trim();

      setChatLog(prev => [...prev, { 
        sender: 'bot', 
        text: reply,
        timestamp: new Date()
      }]);
    } catch (error) {
      setChatLog(prev => [...prev, { 
        sender: 'bot', 
        text: "Sorry, something went wrong.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.sender === 'user';
    return (
      <View style={[
        styles.messageBubbleContainer,
        isUser ? styles.userBubbleContainer : styles.botBubbleContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.botMessageText
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.botTimestamp
          ]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
      >
        {chatLog.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={inputText.trim() && !loading ? "#007AFF" : "#999"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubbleContainer: {
    marginVertical: 4,
    maxWidth: width * 0.75,
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
  },
  botBubbleContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botTimestamp: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginVertical: 4,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});