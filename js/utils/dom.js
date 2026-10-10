/**
 * ==========================================================
 * DOM Utilities
 * ==========================================================
 */

export const $ = (selector, scope = document) =>
    scope.querySelector(selector);

export const $$ = (selector, scope = document) =>
    [...scope.querySelectorAll(selector)];

export function create(tag, className = "") {

    const element = document.createElement(tag);

    if (className) {

        element.className = className;

    }

    return element;

}

export function on(element, event, callback, options = {}) {

    element.addEventListener(

        event,

        callback,

        options

    );

}

export function off(element, event, callback) {

    element.removeEventListener(

        event,

        callback

    );

}