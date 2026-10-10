/**
 * ==========================================================
 * Debounce
 * ==========================================================
 *
 * Executes only after events stop firing.
 *
 * Used for:
 *
 * - Resize
 * - Search
 * - Layout recalculation
 *
 * ==========================================================
 */

export default function debounce(callback, delay = 250) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}