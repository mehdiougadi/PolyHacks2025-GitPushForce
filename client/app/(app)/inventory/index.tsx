import CategoryItem from "@client/components/items/category-item";
import { Pressable, StyleSheet, View, Text, ScrollView } from "react-native";
import categories from "@client/constants/categories";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@client/constants/Colors";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventoryScreen(){
    const router = useRouter();

    const handleBack = () => {
        router.back();
      };

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
                </Pressable>
                <Text style={styles.headerTitle}>Home</Text>
            </View>
            <ScrollView style={{flex: 1, backgroundColor: '#fff'}} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {categories.map((category) => (
                        <CategoryItem key={category.name} category={category} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
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