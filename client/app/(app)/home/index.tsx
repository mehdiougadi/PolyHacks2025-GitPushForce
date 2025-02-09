import { View, StyleSheet, Platform } from "react-native";
import DefaultScreen from "@client/components/screens/default-screen";
import features from "@client/constants/features";
import FeatureItem from "@client/components/items/feature-item";
import SansitaText from "@client/components/texts/sansita-text";

export default function Home() {
    const titleSize = Platform.select({
        web: "48",
        default: "32"
    });

    return (
        <DefaultScreen>
            <View style={{flexDirection: "row", justifyContent: 'center', padding: 16}}>
                <SansitaText 
                    text="FarmerFlow" 
                    fontSize={titleSize} 
                    lineHeight="auto"
                />
            </View>
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