/**
 * ==========================================================
 * Throttle
 * ==========================================================
 *
 * Limits how often a function can execute.
 *
 * Used for:
 *
 * - Scroll
 * - Resize
 * - Mouse events
 *
 * ==========================================================
 */

export default function throttle(callback, delay = 16) {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}