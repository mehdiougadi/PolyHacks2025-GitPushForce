import DefaultScreen from "@client/components/screens/default-screen";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity } from "react-native";


export default function EntryScreen(){
    const router = useRouter();
    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" /> */}
            <View style={styles.contentContainer}>
                <Image source={require('@client/assets/images/logo.png')} style={{ height: 300, width: 300}}/>
                <TouchableOpacity style={styles.button} onPress={() => {router.navigate('/(auth)/signin')}}>
                    <Text style={styles.textBtn}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {router.navigate('/(auth)/signup')}}>
                    <Text style={styles.textBtn}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#84e296',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    contentContainer:{
        display: 'flex',
        gap: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    textBtn:{
        color: '#000',
        fontSize: 16,
    }
});