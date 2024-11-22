/**
 * Main application entry point that handles mood-based movie recommendations
 * @module main
 * 
 * Dependencies:
 * - config.js: Contains API configuration and mood category mappings
 * - api.js: Handles all TMDB API interactions
 * - ui.js: Manages UI updates and loading states
 */

import { moodCategories } from './config.js';
import { getRandomMovie, getGenres } from './api.js';
import { updateMovieUI, toggleLoadingState } from './ui.js';

// DOM element references for form controls
const primaryMoodSelect = document.getElementById('primaryMoodSelect');
const subMoodSelect = document.getElementById('subMoodSelect');
const formatSelect = document.getElementById('formatSelect');
const yearStart = document.getElementById('yearStart');
const yearEnd = document.getElementById('yearEnd');

// Initialize year range inputs with sensible defaults
const currentYear = new Date().getFullYear();
yearStart.max = currentYear;
yearEnd.max = currentYear;
yearStart.value = '2000'; // Default start year
yearEnd.value = '2024';   // Default end year

/**
 * Populates the primary mood dropdown with categories from config
 * Handles emoji display in category names by properly parsing Unicode characters
 */
Object.keys(moodCategories).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    // Parse category name to properly display emoji if present
    const match = category.match(/^(.*?)\s*([\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])$/u);
    if (match) {
        option.textContent = `${match[2]} ${match[1].trim()}`;
    } else {
        option.textContent = category;
    }
    primaryMoodSelect.appendChild(option);
});

/**
 * Event handler for primary mood selection changes
 * Updates sub-mood options based on selected primary mood
 * Enables/disables sub-mood select based on primary mood selection
 */
primaryMoodSelect.addEventListener('change', (e) => {
    const primaryMood = e.target.value;
    subMoodSelect.innerHTML = '<option value="">Select specific mood...</option>';
    
    if (primaryMood) {
        const subMoods = moodCategories[primaryMood];
        Object.entries(subMoods).forEach(([key, { label }]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = label;
            subMoodSelect.appendChild(option);
        });
        subMoodSelect.disabled = false;
    } else {
        subMoodSelect.disabled = true;
    }
});

/**
 * Event handlers for year range validation
 * Ensures start year is never greater than end year and vice versa
 */
yearStart.addEventListener('change', () => {
    if (yearEnd.value && parseInt(yearStart.value) > parseInt(yearEnd.value)) {
        yearEnd.value = yearStart.value;
    }
});

yearEnd.addEventListener('change', () => {
    if (yearStart.value && parseInt(yearEnd.value) < parseInt(yearStart.value)) {
        yearStart.value = yearEnd.value;
    }
});

/**
 * Fetches and displays a movie based on selected filters
 * @param {string} primaryMood - The selected primary mood category
 * @param {string} subMood - The selected sub-mood category
 * @returns {Promise<void>}
 */
async function updateMovie(primaryMood, subMood) {
    if (!primaryMood || !subMood) return;
    
    toggleLoadingState(true);
    
    // Extract filter values
    const { genres } = moodCategories[primaryMood][subMood];
    const format = formatSelect.value;
    const yearStartValue = yearStart.value ? parseInt(yearStart.value) : null;
    const yearEndValue = yearEnd.value ? parseInt(yearEnd.value) : null;
    
    // Fetch movie and genre data
    const movie = await getRandomMovie(genres, format, yearStartValue, yearEndValue);
    const genreList = await getGenres();
    
    if (!movie) {
        alert('No movie found with the selected filters. Please try different criteria.');
        toggleLoadingState(false);
        return;
    }
    
    updateMovieUI(movie, genreList);
    toggleLoadingState(false);
}

// Add change event listeners to all filter controls
[subMoodSelect, formatSelect, yearStart, yearEnd].forEach(element => {
    element.addEventListener('change', () => {
        const primaryMood = primaryMoodSelect.value;
        const subMood = subMoodSelect.value;
        if (primaryMood && subMood) {
            updateMovie(primaryMood, subMood);
        }
    });
});