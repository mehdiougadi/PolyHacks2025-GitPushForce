import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@client/firebase"; 
import UserSignUp from '@common/interfaces/user-signup';
import User from '@common/interfaces/user';
import {
    EmailAuthProvider,
    createUserWithEmailAndPassword,
    updateProfile,
    getAuth,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { MessageProvider } from './message-context';

interface AuthContextProps {
    children: ReactNode;
}

interface AuthContextType {
    user: User | null; // Added missing user property
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
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
        let unsubscribe: () => void;

        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            unsubscribe = onSnapshot(userRef, (doc) => {
                if (doc.exists()) {
                    const userData = doc.data() as User;
                    console.log("User data updated:");
                    setUser(userData);
                }
            }, (error) => {
                console.error("Error listening to user updates:", error);
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [auth.currentUser]);

    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated === null) return;

        const navigate = async () => {
            try {
                if (isAuthenticated) {
                    await router.replace('/(app)/home');
                } else {
                    await router.replace('/(auth)/entry');
                }
            } catch (error) {
                console.error('Navigation error:', error);
            }
        };

        navigate();
    }, [isAuthenticated, isLoading]);

    const getToken = () => {
        return token;
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const currentUser = auth.currentUser;

            if (currentUser) {
                const token = await currentUser.getIdToken();
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                
                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    setUser(userData);
                }
                
                setToken(token);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (userData: UserSignUp) => {
        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );
    
            if (userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: `${userData.firstName} ${userData.lastName}`,
                    photoURL: userData.profilePicture || null
                });
    
                const token = await userCredential.user.getIdToken();
                const newUser: User = {
                    uid: userCredential.user.uid,
                    email: userData.email,
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    profilePicture: userData.profilePicture,
                    items: [],
                };
                await setDoc(doc(db, "users", newUser.uid), newUser);

                setToken(token);
                setUser(newUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    
    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
            if (userCredential.user) {
                const token = await userCredential.user.getIdToken();
                const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    
                if (!userDoc.exists()) {
                    throw new Error("User data not found in Firestore");
                }
    
                const userData = userDoc.data() as User;
    
                setToken(token);
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            await firebaseSignOut(auth);
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            await router.replace('/(auth)/entry');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
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
            <MessageProvider>
                {children}
            </MessageProvider>
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