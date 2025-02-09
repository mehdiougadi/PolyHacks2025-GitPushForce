import DefaultScreen from "@client/components/screens/default-screen";
import { Colors } from "@client/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@client/contexts/auth-context";
import { useEffect } from "react";

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();

    if(!user){
        return;
    }

    useEffect(()=>{},[user])

    const handleBack = () => {
        router.back();
    };

    return (
        <DefaultScreen>
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
                </Pressable>
                <Text style={styles.headerTitle}>Home</Text>
            </View>
            
            <View style={styles.profileContainer}>
                <View style={styles.profileHeader}>
                    <Image 
                        source={require('@client/assets/images/profile-pic.png')}
                        style={styles.profilePicture}
                    />
                    <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                    <Text style={styles.username}>@{user.username}</Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>{user.email}</Text>
                    </View>
                </View>
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
    profileContainer: {
        flex: 1,
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePicture: {
        width: 200,
        height: 200,
        borderRadius: 60,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    infoSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 12,
    },
    statsSection: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});