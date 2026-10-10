/**
 * ==========================================================
 * Linear Interpolation
 * ==========================================================
 *
 * Smoothly interpolates between two values.
 *
 * Example:
 *
 * position = lerp(position, target, 0.12);
 *
 * ==========================================================
 */

export default function lerp(start, end, amount) {

    return start + (end - start) * amount;

}