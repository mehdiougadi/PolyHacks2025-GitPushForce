import { Stack } from 'expo-router';
import AuthProvider from '@client/contexts/auth-context';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
            </Stack>
        </AuthProvider>
    );
}