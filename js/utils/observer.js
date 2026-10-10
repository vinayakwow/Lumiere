/**
 * ==========================================================
 * Intersection Observer Factory
 * ==========================================================
 */

export default function createObserver({

    threshold = 0.2,

    root = null,

    rootMargin = "0px",

    callback

}) {

    return new IntersectionObserver(

        callback,

        {

            root,

            threshold,

            rootMargin

        }

    );

}