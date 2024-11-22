// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3rjErlVpu0JHuBg2pU_z89CLTt0sxjT0",
    authDomain: "moviemood-f7456.firebaseapp.com",
    projectId: "moviemood-f7456",
    storageBucket: "moviemood-f7456.firebasestorage.app",
    messagingSenderId: "352206096533",
    appId: "1:352206096533:web:3d97be731629a23480f39c",
    measurementId: "G-T4H5Y7GR6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
