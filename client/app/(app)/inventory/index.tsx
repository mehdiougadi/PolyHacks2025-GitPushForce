import CategoryItem from "@client/components/items/category-item";
import DefaultScreen from "@client/components/screens/default-screen";
import { Pressable, StyleSheet, View, Text } from "react-native";
import categories from "@client/constants/categories";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useRouter } from "expo-router";

export default function InventoryScreen(){
    const router = useRouter();

    const handleBack = () => {
        router.back();
      };

    return(
        <DefaultScreen>
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
                </Pressable>
                <Text style={styles.headerTitle}>Home</Text>
            </View>
            <View style={styles.container}>
                {categories.map((category) => (
                    <CategoryItem key={category.name} category={category} />
                ))}
            </View>
        </DefaultScreen>
    );
}

const styles = StyleSheet.create({
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
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
        padding: 20,
    },
});