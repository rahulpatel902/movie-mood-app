/**
 * UI management module for movie display and loading states
 * @module ui
 * 
 * Dependencies:
 * - config.js: Contains image base URL
 * - utils.js: Contains formatting utilities
 */

import { IMG_BASE_URL } from './config.js';
import { formatRuntime } from './utils.js';

/**
 * Updates the movie card UI with new movie data
 * @param {Object} movie - Movie data object from TMDB API
 * @param {Array} genres - Array of genre objects for mapping IDs to names
 */
export function updateMovieUI(movie, genres) {
    // Map genre IDs to their names
    const movieGenres = movie.genre_ids
        .map(id => genres.find(g => g.id === id)?.name)
        .filter(Boolean)
        .join(', ');
    
    // Update all UI elements with movie details
    document.getElementById('moviePoster').src = `${IMG_BASE_URL}${movie.poster_path}`;
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('movieYear').textContent = movie.release_date.split('-')[0];
    document.getElementById('movieRating').textContent = `${movie.vote_average.toFixed(1)}`;
    document.getElementById('movieDuration').textContent = formatRuntime(movie.runtime);
    document.getElementById('movieGenres').textContent = movieGenres;
    document.getElementById('movieOverview').textContent = movie.overview;
}

/**
 * Toggles visibility of loading spinner and movie card
 * @param {boolean} isLoading - Whether the application is in loading state
 */
export function toggleLoadingState(isLoading) {
    const movieCard = document.getElementById('movieCard');
    const loadingSpinner = document.querySelector('.loading-spinner');
    
    if (isLoading) {
        movieCard.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
        movieCard.classList.remove('hidden');
    }
}