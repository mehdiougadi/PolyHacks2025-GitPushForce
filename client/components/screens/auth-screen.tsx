import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DefaultScreenProps {
    children: ReactNode;
}

export default function AuthScreen({ children }: DefaultScreenProps) {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
            <SafeAreaView style={styles.safeContainer}>
                <KeyboardAwareScrollView
                    enableOnAndroid
                    enableAutomaticScroll
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {children}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#84e296',
    },
    safeContainer: {
        flex: 1,
    },
});