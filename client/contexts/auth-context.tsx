import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '@client/firebase';
import UserSignUp from '@common/interfaces/user-signup';
import User from '@common/interfaces/user';

interface AuthContextProps {
    children: ReactNode;
}

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (userData: UserSignUp) => Promise<void>;
    signOut: () => Promise<void>;
    getToken: () => string | null;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: AuthContextProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            await checkAuthStatus();
        };
        initializeAuth();
    }, []);

    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated === null) return;

        const navigate = async () => {
            try {
                if (isAuthenticated) {
                    await router.navigate('/(app)/home');
                } else {
                    await router.replace('/(auth)/entry');
                }
            } catch (error) {
                console.error('Navigation error:', error);
            }
        };

        navigate();
    }, [isAuthenticated, isLoading]);

    // Getters
    const getToken = () => {
        return token;
    };

    // Setters
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    // Methods
    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const currentUser = auth.currentUser;

            setIsAuthenticated(true);
            return;

            // if (currentUser) {
            //     const token = await currentUser.getIdToken();
            //     // const userData = await authService.getUserDetails(currentUser.uid, token);
            //     setToken(token);
            //     // setUser(userData);
            //     setIsAuthenticated(true);
            // } else {
            //     setIsAuthenticated(false);
            // }
        } catch (error) {
            console.log("Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (userData: UserSignUp) => {
    };

    const signIn = async (username: string, password: string) => {

    };

    const signOut = async () => {
    };

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        getToken,
        updateUser,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export default function AuthProvider({ children }: AuthContextProps) {
    return (
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}