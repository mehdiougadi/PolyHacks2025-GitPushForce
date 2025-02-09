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
        backgroundColor: '#fff',
        justifyContent: "center",
    },
    input: {
        fontSize: 16,
        paddingHorizontal: 16,
        height: 56,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        color: '#1E1D1D',
        width: "100%",
    },
});
