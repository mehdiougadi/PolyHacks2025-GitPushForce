import AuthInput from "@client/components/inputs/input-auth";
import DefaultScreen from "@client/components/screens/default-screen";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@client/contexts/auth-context";
import LoadingScreen from "@client/components/screens/loading-screen";

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
            [field]: value
        }));
    };
    const { signUp, isLoading } = useAuth();

    useEffect(() => {}, [isLoading]);

    if(isLoading){
        <LoadingScreen />
    }

    return (
        <DefaultScreen>
            <View style={styles.content}>
                <Image 
                    source={require('@client/assets/images/logo.png')} 
                    style={{ height: 300, width: 300 }}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.form}>
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
                        onPress={() => {signUp(formData)}}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
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