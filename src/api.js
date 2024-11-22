/**
 * API interaction module for The Movie Database (TMDB)
 * Handles all movie data fetching with caching and error handling
 * @module api
 * 
 * Dependencies:
 * - config.js: Contains API keys and base URLs
 */

import { API_KEY, BASE_URL } from './config.js';

/**
 * Cache system for API responses to reduce API calls
 * Uses localStorage for persistence across sessions
 * @type {Object}
 */
const cache = {
    genres: null,
    movies: new Map(),
    details: new Map(),
    
    // Save cache to localStorage
    save() {
        const data = {
            genres: this.genres,
            movies: Array.from(this.movies.entries()),
            details: Array.from(this.details.entries()),
            timestamp: Date.now()
        };
        localStorage.setItem('movieCache', JSON.stringify(data));
    },
    
    // Load cache from localStorage
    load() {
        const data = JSON.parse(localStorage.getItem('movieCache'));
        if (data && (Date.now() - data.timestamp) < CACHE_DURATION) {
            this.genres = data.genres;
            this.movies = new Map(data.movies);
            this.details = new Map(data.details);
            return true;
        }
        return false;
    }
};

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Initialize cache from localStorage
cache.load();

/**
 * Keywords used to filter out adult or inappropriate content
 * @type {string[]}
 */
const adultContentKeywords = [
    'explicit', 'nude', 'nudity', 'sex', 'erotic', 'mature', 'rated r',
    'violence', 'lust', 'gore', 'bloody', 'seduce', 'disturbing', 'graphic'
].map(keyword => keyword.toLowerCase());

/**
 * Checks if movie overview contains adult content
 * @param {string} overview - Movie overview text
 * @returns {boolean} True if adult content is detected
 */
function containsAdultContent(overview) {
    if (!overview) return false;
    const lowercaseOverview = overview.toLowerCase();
    return adultContentKeywords.some(keyword => lowercaseOverview.includes(keyword));
}

/**
 * Fetches data with automatic retry and connection-aware throttling
 * @param {string} url - API endpoint URL
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Object>} Parsed JSON response
 */
async function fetchWithRetry(url, retries = 3) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection?.type === 'cellular' || connection?.downlink < 1;
    
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), isSlow ? 10000 : 5000);
            
            const response = await fetch(url, {
                signal: controller.signal,
                // Enable HTTP keep-alive
                headers: { 'Connection': 'keep-alive' }
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            // Exponential backoff with longer delays for slow connections
            await new Promise(resolve => setTimeout(resolve, (isSlow ? 2000 : 1000) * (i + 1)));
        }
    }
}

/**
 * Fetches detailed information about a specific movie
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Object|null>} Movie details or null if not found
 */
export async function getMovieDetails(movieId) {
    if (cache.details.has(movieId)) {
        return cache.details.get(movieId);
    }

    try {
        const data = await fetchWithRetry(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=images`
        );
        
        // Store only essential data to reduce cache size
        const essentialData = {
            id: data.id,
            title: data.title,
            overview: data.overview,
            release_date: data.release_date,
            runtime: data.runtime,
            vote_average: data.vote_average,
            poster_path: data.poster_path,
            genre_ids: data.genres.map(g => g.id)
        };
        
        cache.details.set(movieId, essentialData);
        cache.save();
        return essentialData;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

/**
 * Fetches a random movie based on provided filters
 * Implements progressive loading and data optimization
 * @param {number[]} genreIds - Array of TMDB genre IDs
 * @param {string} format - Movie format (animation/live-action)
 * @param {number|null} yearStart - Start year for release date filter
 * @param {number|null} yearEnd - End year for release date filter
 * @returns {Promise<Object|null>} Movie data or null if no match found
 */
export async function getRandomMovie(genreIds, format, yearStart, yearEnd) {
    const genreKey = genreIds.sort().join(',');
    const page = Math.floor(Math.random() * 5) + 1;
    
    // Construct API URL with filters
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreKey}&page=${page}&language=en-US&sort_by=popularity.desc&include_adult=false`;
    
    if (yearStart) url += `&primary_release_date.gte=${yearStart}-01-01`;
    if (yearEnd) url += `&primary_release_date.lte=${yearEnd}-12-31`;
    
    try {
        const data = await fetchWithRetry(url);
        
        if (!data.results?.length) return null;
        
        // Apply content and format filters
        let filteredMovies = data.results.filter(movie => !containsAdultContent(movie.overview));
        
        if (format === 'animation') {
            filteredMovies = filteredMovies.filter(movie => movie.genre_ids.includes(16));
        } else if (format === 'live-action') {
            filteredMovies = filteredMovies.filter(movie => !movie.genre_ids.includes(16));
        }
        
        if (filteredMovies.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * filteredMovies.length);
        const movie = filteredMovies[randomIndex];
        const movieDetails = await getMovieDetails(movie.id);
        
        if (movieDetails && !containsAdultContent(movieDetails.overview)) {
            return movieDetails;
        }
        
        return getRandomMovie(genreIds, format, yearStart, yearEnd);
    } catch (error) {
        console.error('Error fetching movie:', error);
        return null;
    }
}

/**
 * Fetches list of all movie genres with persistent caching
 * @returns {Promise<Array>} Array of genre objects with id and name
 */
export async function getGenres() {
    if (cache.genres) {
        return cache.genres;
    }

    try {
        const data = await fetchWithRetry(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        cache.genres = data.genres;
        cache.save();
        return data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
}