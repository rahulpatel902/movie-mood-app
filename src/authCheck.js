import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

// Check if user is authenticated
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        const currentPath = window.location.pathname;
        // Check if we're on the main page or any page other than auth
        if (!user && !currentPath.includes('auth.html')) {
            // If we're at the root path or index.html, redirect to auth
            if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('index.html')) {
                window.location.href = '/auth.html';
            }
        } else if (user && currentPath.includes('auth.html')) {
            // If user is authenticated and on auth page, redirect to main page
            window.location.href = '/index.html';
        }
    });
}

// Run auth check immediately
checkAuth();

// Also check when the page loads
window.addEventListener('load', checkAuth);
