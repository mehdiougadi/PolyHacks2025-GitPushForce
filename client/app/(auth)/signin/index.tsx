import AuthInput from "@client/components/inputs/input-auth";
import DefaultScreen from "@client/components/screens/default-screen";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@client/contexts/auth-context";
import LoadingScreen from "@client/components/screens/loading-screen";

export default function SigninScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signIn, isLoading} = useAuth();

    useEffect(() => {}, [isLoading]);

    if(isLoading){
        return <LoadingScreen />
    }

    return (
        <DefaultScreen>
            <View style={styles.content}>
                <Image 
                    source={require('@client/assets/images/logo.png')} 
                    style={{ height: 300, width: 300 }}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Sign In</Text>
                <View style={styles.form}>
                    <AuthInput 
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                        inputMode="email"
                    />
                    <AuthInput 
                        placeholder="Password"
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => {signIn(email, password)}}
                    >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </DefaultScreen>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'System',
    },
    form: {
        display: "flex",
        width: "70%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        gap: 16,
        borderRadius: 12,
        backgroundColor: "#84e296",
        maxWidth: 600,
    },
    button: {
        backgroundColor: '#2b9348',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'System',
    }
});