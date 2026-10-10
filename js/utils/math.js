/**
 * ==========================================================
 * Math Utilities
 * ==========================================================
 */

export function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}

export function map(value, inMin, inMax, outMin, outMax) {

    return (

        (value - inMin) *

        (outMax - outMin) /

        (inMax - inMin)

    ) + outMin;

}

export function random(min, max) {

    return Math.random() * (max - min) + min;

}

export function randomInt(min, max) {

    return Math.floor(

        random(min, max + 1)

    );

}

export function distance(x1, y1, x2, y2) {

    return Math.hypot(

        x2 - x1,

        y2 - y1

    );

}