import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from "react-native";
import Feature from "@common/interfaces/feature";
import { useRouter } from "expo-router";

export default function FeatureItem({ feature }: { feature: Feature }) {
    const router = useRouter();
    
    return (
        <TouchableOpacity 
            style={[styles.container, Platform.select({
                web: styles.containerWeb
            })]} 
            onPress={() => {router.navigate(feature.route as any)}}
        >
            <Image 
                source={feature.icon} 
                style={[styles.icon, Platform.select({
                    web: styles.iconWeb
                })]} 
            />
            <Text style={[styles.name, Platform.select({
                web: styles.nameWeb
            })]}>
                {feature.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    containerWeb: {
        padding: 32,
        cursor: 'pointer',
    },
    icon: {
        height: 125,
        width: 125,
        borderRadius: 12,
    },
    iconWeb: {
        height: 200,
        width: 200,
    },
    name: {
        fontSize: 16,
        marginTop: 12,
    },
    nameWeb: {
        fontSize: 24,
        marginTop: 16,
    }
});