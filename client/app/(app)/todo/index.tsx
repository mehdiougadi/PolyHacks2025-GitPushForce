import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../../../firebase"; // Adjust the path if necessary
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import DefaultScreen from "../../../components/screens/default-screen"; // Original DefaultScreen with KeyboardAwareScrollView

type Task = {
  id: string;
  text: string;
};

export default function TodoScreen(): JSX.Element {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
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
        },
        (error) => {
          console.error("Error fetching tasks: ", error);
        }
      );
      return () => unsubscribe();
    }
  }, []);

  const addTask = async (): Promise<void> => {
    if (task.trim() && auth.currentUser) {
      try {
        await addDoc(collection(db, "users", auth.currentUser.uid, "todos"), {
          text: task,
        });
        setTask("");
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

  const removeTask = async (id: string): Promise<void> => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "todos", id));
      } catch (error) {
        console.error("Error removing task: ", error);
      }
    }
  };

  return (
    <DefaultScreen>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>To-Do List</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a task"
              value={task}
              onChangeText={setTask}
            />
            <Button title="Add Task" onPress={addTask} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </DefaultScreen>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  taskText: {
    fontSize: 18,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
});
