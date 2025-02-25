import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    sendPasswordResetEmail
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBf_CI-lOZtuKx1X1SUxbBzK98dVpZGf9E",
    authDomain: "calendar-app-73c6a.firebaseapp.com",
    projectId: "calendar-app-73c6a",
    storageBucket: "calendar-app-73c6a.firebasestorage.app",
    messagingSenderId: "326058912063",
    appId: "1:326058912063:web:2f608069680ce06293cb8a",
    measurementId: "G-8E6JST2DQQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    sendPasswordResetEmail
};
