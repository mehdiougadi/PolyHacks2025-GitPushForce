import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Farm Assistant Dashboard</Text>
            
            <Link href="/inventory" style={styles.card}>
                <Text style={styles.cardTitle}>Inventory Management</Text>
                <Text style={styles.cardText}>Track seeds, tools, and supplies</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2c3e50',
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#27ae60',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
});