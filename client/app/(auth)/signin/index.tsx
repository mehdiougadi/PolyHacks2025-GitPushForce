import AuthInput from "@client/components/inputs/input-auth";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@client/contexts/auth-context";
import LoadingScreen from "@client/components/screens/loading-screen";
import AuthScreen from "@client/components/screens/auth-screen";
import { useMessage } from "@client/contexts/message-context";

export default function SigninScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signIn, isLoading} = useAuth();
    const { showMessage } = useMessage();

    useEffect(() => {}, [isLoading]);

    if(isLoading){
        return <LoadingScreen />
    }

    const validateSignIn = () => {
        const errors: string[] = [];

        if (!email.trim()) {
            errors.push('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address');
        }

        if (!password.trim()) {
            errors.push('Password is required');
        }

        return errors;
    };

    const handleSignIn = async () => {
        try {
            const errors = validateSignIn();
            if (errors.length > 0) {
                showMessage(errors, "Validation Error");
                return;
            }

            await signIn(email, password);
            setEmail('');
            setPassword('');
        } catch (error: any) {
            let errorMessage = "An error occurred during sign in. Please try again.";
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account exists with this email address";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Please try again later";
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = "Invalid Password";
            }

            showMessage(errorMessage, "Sign In Error");
        }
    };

    return (
        <AuthScreen>
            <View style={styles.content}>
                <Image 
                    source={require('@client/assets/images/logo.png')} 
                    style={{ height: 300, width: 300 }}
                    resizeMode="contain"
                />
                <View style={styles.form}>
                    <View style={{width: '100%'}}>
                        <Text style={styles.title}>Sign In</Text>
                    </View>
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
                        onPress={() => {handleSignIn()}}
                    >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthScreen>
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
        marginBottom: 8,
        textAlign: 'left',
        fontFamily: 'System',
        alignSelf: 'flex-start',
        width: '100%',
    },
    form: {
        display: "flex",
        width: "80%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        gap: 16,
        borderRadius: 12,
        backgroundColor: "#FFF",
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        backgroundColor: '#2b9348',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'System',
    }
});