import AuthInput from "@client/components/inputs/input-auth";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@client/contexts/auth-context";
import LoadingScreen from "@client/components/screens/loading-screen";
import AuthScreen from "@client/components/screens/auth-screen";
import { useMessage } from "@client/contexts/message-context";
import verificationService from "@client/services/user-verification";
import { router } from "expo-router";

export default function SignUpScreen() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        profilePicture: ''
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value.trim()
        }));
    };
    const { signUp, isLoading } = useAuth();
    const { showMessage } = useMessage();

    useEffect(() => {}, [isLoading]);

    if(isLoading){
        <LoadingScreen />
    }

    const handleSignUp = async () => {
        try {
            const errors = verificationService.validateSignup(formData);
            if (errors.length > 0) {
                showMessage(errors, "Validation Error");
                return;
            }
            const [isUsernameTaken, isEmailTaken] = await Promise.all([
                verificationService.isUsernameTaken(formData.username),
                verificationService.isEmailTaken(formData.email)
            ]);

            if (isUsernameTaken || isEmailTaken) {
                const takenErrors = [];
                if (isUsernameTaken) takenErrors.push("Username is already taken");
                if (isEmailTaken) takenErrors.push("Email is already in use");
                showMessage(takenErrors, "Account Error");
                return;
            }
            await signUp(formData);
            setFormData({
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                profilePicture: ''
            });
        } catch (error) {
            showMessage("An error occurred during sign up. Please try again.", "Error");
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
                        <Text style={styles.title}>Sign Up</Text>
                    </View>
                    <AuthInput 
                        placeholder="Username"
                        onChangeText={(value) => updateField('username', value)}
                        value={formData.username}
                    />
                    <AuthInput 
                        placeholder="Email"
                        onChangeText={(value) => updateField('email', value)}
                        value={formData.email}
                        inputMode="email"
                    />
                    <AuthInput 
                        placeholder="First Name"
                        onChangeText={(value) => updateField('firstName', value)}
                        value={formData.firstName}
                    />
                    <AuthInput 
                        placeholder="Last Name"
                        onChangeText={(value) => updateField('lastName', value)}
                        value={formData.lastName}
                    />
                    <AuthInput 
                        placeholder="Password"
                        onChangeText={(value) => updateField('password', value)}
                        value={formData.password}
                    />
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => {handleSignUp()}}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                    <TouchableOpacity 
                        style={styles.signinLink}
                        onPress={() => router.navigate('/(auth)/signin')}
                    >
                        <Text style={styles.signinText}>Already have an account? Sign In!</Text>
                    </TouchableOpacity> 
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
    signinLink: {
        marginTop: 16,
    },
    signinText: {
        color: '#013220',
        textDecorationLine: 'underline',
        fontSize: 16,
        fontFamily: 'System',
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