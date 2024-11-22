import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

// Check if user is authenticated
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user && !window.location.pathname.includes('auth.html')) {
            // No user is signed in, redirect to auth page
            window.location.href = '/auth.html';
        }
    });
}

// Run auth check
checkAuth();
