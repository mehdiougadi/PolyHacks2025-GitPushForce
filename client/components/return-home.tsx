import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

export default function ReturnHome() {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => router.navigate('/(app)/home')}
            >
                <Text style={styles.buttonText}>Return Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40,
        left: 15,
        zIndex: 1000,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});