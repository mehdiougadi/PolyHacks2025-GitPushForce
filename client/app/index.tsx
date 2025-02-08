import { Redirect } from 'expo-router';
import { useAuth } from '@client/contexts/auth-context';

export default function RootIndex() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    return isAuthenticated ? <Redirect href="/(app)/home" /> : <Redirect href="/(auth)/entry" />;
}