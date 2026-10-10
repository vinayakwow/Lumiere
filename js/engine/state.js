/**
 * ==========================================================
 * LUMIÈRE
 * Global Application State
 * ==========================================================
 *
 * This file stores the runtime state of the application.
 * It should NEVER contain business logic.
 *
 * Every module reads and writes state here.
 *
 * ==========================================================
 */

export default class State {

    constructor() {

        /**
         * ------------------------------------------------------
         * Application
         * ------------------------------------------------------
         */

        this.app = {

            initialized: false,

            loading: true,

            ready: false,

            paused: false,

        };

        /**
         * ------------------------------------------------------
         * Viewport
         * ------------------------------------------------------
         */

        this.viewport = {

            width: window.innerWidth,

            height: window.innerHeight,

            pixelRatio: window.devicePixelRatio || 1,

            mobile: false,

            tablet: false,

            desktop: true,

        };

        /**
         * ------------------------------------------------------
         * Scroll
         * ------------------------------------------------------
         */

        this.scroll = {

            x: 0,

            y: window.scrollY,

            lastY: window.scrollY,

            direction: "down",

            progress: 0,

            velocity: 0,

        };

        /**
         * ------------------------------------------------------
         * Mouse
         * ------------------------------------------------------
         */

        this.mouse = {

            x: 0,

            y: 0,

            targetX: 0,

            targetY: 0,

            inside: true,

            down: false,

        };

        /**
         * ------------------------------------------------------
         * Loader
         * ------------------------------------------------------
         */

        this.loader = {

            finished: false,

            animating: true,

        };

        /**
         * ------------------------------------------------------
         * Navbar
         * ------------------------------------------------------
         */

        this.navbar = {

            open: false,

            hidden: false,

            scrolled: false,

            activeLink: "home",

        };

        /**
         * ------------------------------------------------------
         * Hero
         * ------------------------------------------------------
         */

        this.hero = {

            revealed: false,

            parallaxX: 0,

            parallaxY: 0,

        };

        /**
         * ------------------------------------------------------
         * Cursor
         * ------------------------------------------------------
         */

        this.cursor = {

            visible: true,

            hovering: false,

            clicked: false,

            magnetic: false,

        };

        /**
         * ------------------------------------------------------
         * Gallery
         * ------------------------------------------------------
         */

        this.gallery = {

            open: false,

            current: 0,

            total: 0,

        };

        /**
         * ------------------------------------------------------
         * Reservation
         * ------------------------------------------------------
         */

        this.reservation = {

            submitting: false,

            success: false,

        };

        /**
         * ------------------------------------------------------
         * Animation
         * ------------------------------------------------------
         */

        this.animation = {

            running: true,

            reducedMotion:

                window.matchMedia("(prefers-reduced-motion: reduce)").matches,

        };

        /**
         * ------------------------------------------------------
         * Active Section
         * ------------------------------------------------------
         */

        this.activeSection = "hero";

    }

    /* ==========================================================
       HELPERS
    ========================================================== */

    setActiveSection(section) {

        this.activeSection = section;

    }

    updateViewport(width, height) {

        this.viewport.width = width;
        this.viewport.height = height;

    }

    updateMouse(x, y) {

        this.mouse.x = x;
        this.mouse.y = y;

    }

    updateScroll(y) {

        this.scroll.lastY = this.scroll.y;

        this.scroll.y = y;

        this.scroll.direction =
            y > this.scroll.lastY
                ? "down"
                : "up";

    }

}