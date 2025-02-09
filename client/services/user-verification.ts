import UserSignUp from "@common/interfaces/user-signup";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@client/firebase";

const verificationService = {
    usernameRegex: /^[a-zA-Z0-9_-]{3,20}$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passwordRegex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,

    validateSignup: (data: UserSignUp): string[] => {
        const errors: string[] = [];

        if (!data.username?.trim()) {
            errors.push('Username is required');
        } else if (!verificationService.usernameRegex.test(data.username)) {
            errors.push('Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens');
        }

        if (!data.email?.trim()) {
            errors.push('Email is required');
        } else if (!verificationService.emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.password?.trim()) {
            errors.push('Password is required');
        } else if (!verificationService.passwordRegex.test(data.password)) {
            errors.push('Password must be at least 8 characters and contain both letters and numbers');
        }

        return errors;
    },

    isEmailTaken: async (email: string): Promise<boolean> => {
        const userDoc = await getDoc(doc(db, "users", email));
        return userDoc.exists();
    },

    isUsernameTaken: async (username: string): Promise<boolean> => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    }
};

export default verificationService;