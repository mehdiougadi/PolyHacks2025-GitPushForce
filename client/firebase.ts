import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBoH0xBuCRxEOn9X-znxcw2NxI7Xcu0AkM",
    authDomain: "farmflow-66226.firebaseapp.com",
    projectId: "farmflow-66226",
    storageBucket: "farmflow-66226.firebasestorage.app",
    messagingSenderId: "1079483008473",
    appId: "1:1079483008473:web:73ab0df2cc3b194d5f05c8"
};

const app = initializeApp(firebaseConfig);

let persistence;
if (Platform.OS === 'web') {
    const { browserLocalPersistence } = require('firebase/auth');
    persistence = browserLocalPersistence;
} else {
    const { getReactNativePersistence } = require('firebase/auth');
    persistence = getReactNativePersistence(ReactNativeAsyncStorage);
}

export const auth = initializeAuth(app, {
    persistence: persistence,
});

export const db = getFirestore(app);