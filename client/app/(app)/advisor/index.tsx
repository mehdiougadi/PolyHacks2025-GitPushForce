import DefaultScreen from '@client/components/screens/default-screen';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function AdvisorScreen(){
    const router = useRouter();

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
            <Text>Advisor Screen</Text>
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
})