// API key for The Movie Database (TMDB)
const API_KEY = 'a699e481031e762bab78f5b6f496c8d5';
// Base URLs for API requests and image loading
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Map of moods to corresponding genre IDs in TMDB
const moodGenreMap = {
    happy: [35, 16],      // Comedy and Animation
    sad: [18, 10749],     // Drama and Romance
    excited: [28, 12],    // Action and Adventure
    romantic: [10749, 35], // Romance and Comedy
    stressed: [35, 16],   // Comedy and Animation
    relaxed: [99, 36],    // Documentary and History
    adventurous: [12, 14], // Adventure and Fantasy
    mysterious: [9648, 53] // Mystery and Thriller
};

import { auth } from './src/firebase.js';
import { signOut } from 'firebase/auth';

// Firebase imports
import { auth } from './src/firebase.js';
import { signOut } from 'firebase/auth';

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = async () => {
        try {
            await signOut(auth);
            window.location.href = './auth.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
}

// Initialize logout button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Display user name and handle logout
    auth.onAuthStateChanged((user) => {
        const userNameElement = document.getElementById('userName');
        if (user) {
            userNameElement.textContent = `${user.displayName || user.email}`;
        }
    });
});

// Get DOM elements for UI manipulation
const moodSelect = document.getElementById('moodSelect');
const movieCard = document.getElementById('movieCard');
const loadingSpinner = document.querySelector('.loading-spinner');

// Fetch detailed information about a specific movie
async function getMovieDetails(movieId) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

// Get a random movie based on selected genre IDs
async function getRandomMovie(genreIds) {
    // Get a random page (1-5) to increase variety
    const page = Math.floor(Math.random() * 5) + 1;
    const genreParam = genreIds.join(',');

    try {
        // Fetch movies matching the genre criteria
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreParam}&page=${page}&language=en-US&sort_by=popularity.desc`
        );
        const data = await response.json();

        if (data.results.length === 0) return null;

        // Select a random movie from the results
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const movie = data.results[randomIndex];
        // Get additional details for the selected movie
        const movieDetails = await getMovieDetails(movie.id);
        return { ...movie, ...movieDetails };
    } catch (error) {
        console.error('Error fetching movie:', error);
        return null;
    }
}

// Fetch all available movie genres
async function getGenres() {
    try {
        const response = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
}

// Format movie runtime from minutes to hours and minutes
function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

// Update the UI with new movie data
async function updateMovie(mood) {
    if (!mood) return;

    // Hide movie card and show loading spinner
    movieCard.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    // Get genre IDs for selected mood and fetch a random movie
    const genreIds = moodGenreMap[mood];
    const movie = await getRandomMovie(genreIds);
    const genres = await getGenres();

    if (!movie) {
        alert('No movie found for this mood. Please try again.');
        return;
    }

    // Map genre IDs to genre names
    const movieGenres = movie.genre_ids
        .map((id) => genres.find((g) => g.id === id)?.name)
        .filter(Boolean)
        .join(', ');

    // Update UI elements with movie information
    document.getElementById('moviePoster').src = `${IMG_BASE_URL}${movie.poster_path}`;
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('movieYear').textContent = movie.release_date.split('-')[0];
    document.getElementById('movieRating').textContent = `${movie.vote_average.toFixed(1)}`;
    document.getElementById('movieDuration').textContent = formatRuntime(movie.runtime);
    document.getElementById('movieGenres').textContent = movieGenres;
    document.getElementById('movieOverview').textContent = movie.overview;

    // Hide loading spinner and show movie card
    loadingSpinner.classList.add('hidden');
    movieCard.classList.remove('hidden');
}

// Add event listener for mood selection changes
moodSelect.addEventListener('change', (e) => updateMovie(e.target.value));