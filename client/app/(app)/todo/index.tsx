import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "@client/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@client/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

type Task = {
  id: string;
  text: string;
};

export default function TodoScreen(): JSX.Element {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    
    const todosRef = collection(db, "users", user.uid, "todos");
    const q = query(todosRef);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tasksFromFirestore: Task[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
        }));
        setTasks(tasksFromFirestore);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const addTask = async (): Promise<void> => {
    if (task.trim() && user) {
      try {
        await addDoc(collection(db, "users", user.uid, "todos"), {
          text: task,
          createdAt: new Date().toISOString(),
        });
        setTask("");
      } catch (error) {
      }
    }
  };

  const removeTask = async (id: string): Promise<void> => {
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "todos", id));
      } catch (error) {
      }
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list" size={64} color={Colors.light.tint} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>No tasks yet</Text>
      <Text style={styles.emptySubtext}>Add your first task above</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
        </Pressable>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task"
            value={task}
            onChangeText={setTask}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <Pressable 
            onPress={addTask} 
            style={[styles.addButton, !task.trim() && styles.addButtonDisabled]}
            disabled={!task.trim()}
          >
            <Ionicons 
              name="add-circle" 
              size={32} 
              color={task.trim() ? Colors.light.tint : '#ccc'} 
            />
          </Pressable>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={Colors.light.tint} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.taskContainer}>
              <View style={styles.taskContent}>
                <View style={styles.taskDot} />
                <Text style={styles.taskText}>{item.text}</Text>
              </View>
              <Pressable 
                onPress={() => removeTask(item.id)} 
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deleteButtonPressed
                ]}
              >
                <Ionicons name="trash-outline" size={20} color="#FF4B4B" />
              </Pressable>
            </Pressable>
          )}
          contentContainerStyle={[
            styles.flatListContent,
            tasks.length === 0 && styles.emptyListContent
          ]}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: '#f5f5f5',
    borderRadius: 23,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    marginLeft: 12,
    padding: 4,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.tint,
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
  },
  deleteButtonPressed: {
    backgroundColor: '#ffeeee',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});