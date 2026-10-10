/**
 * ==========================================================
 * LUMIÈRE
 * Scroll Engine
 * ==========================================================
 *
 * Responsibilities
 * ----------------
 * ✓ Track scroll position
 * ✓ Detect direction
 * ✓ Active section
 * ✓ Scroll progress
 * ✓ Smooth scroll API
 * ✓ Velocity
 * ✓ Global scroll events
 *
 * ==========================================================
 */

import throttle from "../utils/throttle.js";

export default class ScrollEngine {

    constructor(app) {

        this.app = app;

        this.state = app.state.scroll;
        this.events = app.events;

        this.sections = [];

        this.viewportHeight = window.innerHeight;

        this.documentHeight = 0;

        this.currentY = window.scrollY;

        this.lastY = window.scrollY;

        this.velocity = 0;

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        this.cacheDOM();

        this.calculate();

        this.bindEvents();

        this.updateState();

    }

    /* ======================================================
       CACHE
    ====================================================== */

    cacheDOM() {

        this.sections = [

            ...document.querySelectorAll("section[id]")

        ];

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    bindEvents() {

        window.addEventListener(

            "scroll",

            throttle(

                () => this.onScroll(),

                16

            ),

            {

                passive: true

            }

        );

        window.addEventListener(

            "resize",

            throttle(

                () => this.calculate(),

                100

            )

        );

    }

    /* ======================================================
       CALCULATE
    ====================================================== */

    calculate() {

        this.viewportHeight =

            window.innerHeight;

        this.documentHeight =

            document.documentElement.scrollHeight -

            this.viewportHeight;

    }

    /* ======================================================
       SCROLL
    ====================================================== */

    onScroll() {

        this.currentY = window.scrollY;

    }

    /* ======================================================
       UPDATE
    ====================================================== */

    update() {

        this.updateState();

        this.detectSection();

    }

    /* ======================================================
       STATE
    ====================================================== */

    updateState() {

        this.velocity =

            this.currentY -

            this.lastY;

        this.state.lastY =

            this.lastY;

        this.state.y =

            this.currentY;

        this.state.direction =

            this.velocity >= 0

                ? "down"

                : "up";

        this.state.velocity =

            this.velocity;

        this.state.progress =

            this.documentHeight === 0

                ? 0

                : this.currentY /

                  this.documentHeight;

        this.lastY =

            this.currentY;

        this.events.emit(

            "scroll:update",

            {

                y: this.state.y,

                progress: this.state.progress,

                velocity: this.velocity,

                direction: this.state.direction

            }

        );

    }

    /* ======================================================
       ACTIVE SECTION
    ====================================================== */

    detectSection() {

        let active = null;

        const middle =

            this.currentY +

            this.viewportHeight * 0.4;

        for (const section of this.sections) {

            if (

                middle >= section.offsetTop &&

                middle <

                section.offsetTop +

                section.offsetHeight

            ) {

                active = section.id;

                break;

            }

        }

        if (

            active &&

            active !==

            this.app.state.activeSection

        ) {

            this.app.state.setActiveSection(

                active

            );

            this.events.emit(

                "section:change",

                {

                    id: active

                }

            );

        }

    }

    /* ======================================================
       PUBLIC
    ====================================================== */

    scrollTo(target, options = {}) {

        const {

            offset = 0,

            behavior = "smooth"

        } = options;

        let top = 0;

        if (

            typeof target === "string"

        ) {

            const element =

                document.querySelector(

                    target

                );

            if (!element) return;

            top =

                element.offsetTop -

                offset;

        }

        else {

            top =

                target -

                offset;

        }

        window.scrollTo({

            top,

            behavior

        });

    }

    scrollTop() {

        this.scrollTo(0);

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        window.removeEventListener(

            "scroll",

            this.onScroll

        );

    }

}