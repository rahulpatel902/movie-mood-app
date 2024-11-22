/**
 * Utility functions for data formatting
 * @module utils
 */

/**
 * Formats movie runtime from minutes to hours and minutes
 * @param {number} minutes - Total runtime in minutes
 * @returns {string} Formatted string in "Xh Ym" format
 * @example
 * formatRuntime(142) // Returns "2h 22m"
 */
export function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}