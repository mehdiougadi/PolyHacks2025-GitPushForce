import CategoryItem from "@client/components/items/category-item";
import DefaultScreen from "@client/components/screens/default-screen";
import { StyleSheet, View } from "react-native";
import categories from "@client/constants/categories";

export default function InventoryScreen(){

    return(
        <DefaultScreen>
            <View style={styles.container}>
                {categories.map((category) => (
                    <CategoryItem key={category.name} category={category} />
                ))}
            </View>
        </DefaultScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
        padding: 20,
    },
});