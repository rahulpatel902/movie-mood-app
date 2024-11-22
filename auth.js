import { auth } from './src/firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const passwordInput = document.querySelector('#signupForm input[type="password"]');
    const strengthProgress = document.querySelector('.strength-progress');
    const strengthText = document.querySelector('.strength-text');

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}Form`).classList.add('active');
        });
    });

    // Password visibility toggle
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            btn.classList.toggle('fa-eye');
            btn.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Character variety checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        return {
            score: strength,
            feedback: getStrengthFeedback(strength)
        };
    }

    function getStrengthFeedback(strength) {
        if (strength <= 2) return { text: 'Weak password', class: 'weak' };
        if (strength <= 3) return { text: 'Medium password', class: 'medium' };
        return { text: 'Strong password', class: 'strong' };
    }

    // Password input handler
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const { score, feedback } = checkPasswordStrength(e.target.value);
            
            strengthProgress.className = 'strength-progress';
            strengthProgress.classList.add(feedback.class);
            strengthText.textContent = feedback.text;
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            // Set persistence based on remember me checkbox
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            
            // Sign in user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            loginError.textContent = getErrorMessage(error.code);
        }
    });

    // Sign up form submission
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const name = document.getElementById('signupName').value;

        try {
            // Create new user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update user profile with name
            await userCredential.user.updateProfile({
                displayName: name
            });
        } catch (error) {
            signupError.textContent = getErrorMessage(error.code);
        }
    });

    // Forgot password functionality
    document.getElementById('forgotPassword').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        
        if (!email) {
            loginError.textContent = 'Please enter your email address';
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            loginError.textContent = 'Password reset email sent. Please check your inbox.';
            loginError.style.color = 'green';
        } catch (error) {
            loginError.textContent = getErrorMessage(error.code);
        }
    });

    // Error message helper function
    function getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support';
            case 'auth/user-not-found':
                return 'No account exists with this email. Please sign up first';
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Incorrect password. Please try again';
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please login instead';
            case 'auth/weak-password':
                return 'Password must be at least 6 characters long';
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later';
            case 'auth/operation-not-allowed':
                return 'Email/password login is not enabled. Please contact support';
            default:
                console.error('Firebase Auth Error:', errorCode);
                return `Authentication error (${errorCode}). Please try again`;
        }
    }

    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            window.location.href = '/index.html';
        }
    });

    // Form validation
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            showError(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });

    function validateInput(input) {
        if (input.validity.valid) {
            input.classList.remove('error');
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            showError(input);
        }
    }

    function showError(input) {
        input.classList.add('error');
        
        // Remove existing error message if any
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';

        if (input.validity.valueMissing) {
            errorElement.textContent = `Please enter your ${input.placeholder.toLowerCase()}`;
        } else if (input.validity.typeMismatch) {
            errorElement.textContent = `Please enter a valid ${input.type}`;
        } else if (input.validity.tooShort) {
            errorElement.textContent = `${input.placeholder} should be at least ${input.minLength} characters`;
        }

        input.parentElement.appendChild(errorElement);
    }
});