import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface AuthInputProps {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: string;
    inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
}

export default function AuthInput({ placeholder, onChangeText, value, inputMode = "text" }: AuthInputProps) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                inputMode={inputMode}
                placeholderTextColor={'#D3D3D3'}
                autoComplete="off"
                autoCorrect={false}
                underlineColorAndroid="transparent"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        borderRadius: 8,
        backgroundColor: '#fff',
        borderColor: '#D3D3D3',
        borderWidth: 1,
        height: 56,
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    input: {
        fontSize: 16,
        color: '#1E1D1D',
        width: "100%",
    },
});
