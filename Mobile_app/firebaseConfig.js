import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDRa5H8aitxVx_16F1cDDcWMAJUPJ1l8sM",
    authDomain: "gdsc-8a4e3.firebaseapp.com",
    projectId: "gdsc-8a4e3",
    storageBucket: "gdsc-8a4e3.appspot.com",
    messagingSenderId: "740580430649",
    appId: "1:740580430649:web:513f967ad6845cc6110ee8",
    measurementId: "G-5RDBN3XGW1"
};
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const auth =  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

