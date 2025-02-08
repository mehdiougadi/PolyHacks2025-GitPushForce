import { View, StyleSheet } from "react-native";
import DefaultScreen from "@client/components/screens/default-screen";
import features from "@client/constants/features";
import FeatureItem from "@client/components/items/feature-item";

export default function Home() {
    return (
        <DefaultScreen>
            <View style={styles.container}>
                {features.map((feature) => (
                    <FeatureItem key={feature.route} feature={feature} />
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
