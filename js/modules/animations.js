/**
 * ==========================================================
 * LUMIÈRE
 * Animation Engine
 * ==========================================================
 *
 * Responsibilities
 * ----------------
 * ✓ Reveal sections
 * ✓ Split text
 * ✓ Stagger animations
 * ✓ Counters
 * ✓ Image reveals
 * ✓ Scroll progress
 * ✓ Observer lifecycle
 *
 * ==========================================================
 */

import createObserver from "../utils/observer.js";
import splitText from "../utils/splitText.js";

export default class Animations {

    constructor(app) {

        this.app = app;

        this.events = app.events;

        this.state = app.state;

        this.config = app.config.animation;

        this.observer = null;

        this.progressBar = null;

        this.revealElements = [];

        this.counterElements = [];

        this.splitElements = [];

        this.imageRevealElements = [];

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        this.cacheDOM();

        this.prepareSplitText();

        this.createObserver();

        this.observeElements();

        this.events.on(

            "loader:finished",

            () => this.start(),

            100

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    cacheDOM() {

        this.progressBar = document.querySelector(

            ".scroll-progress"

        );

        this.revealElements = [

            ...document.querySelectorAll(

                "[data-reveal]"

            )

        ];

        this.counterElements = [

            ...document.querySelectorAll(

                "[data-counter]"

            )

        ];

        this.splitElements = [

            ...document.querySelectorAll(

                "[data-split]"

            )

        ];

        this.imageRevealElements = [

            ...document.querySelectorAll(

                ".image-reveal"

            )

        ];

    }

    /* ======================================================
       SPLIT TEXT
    ====================================================== */

    prepareSplitText() {

        this.splitElements.forEach(element => {

            splitText(element);

        });

    }

    /* ======================================================
       OBSERVER
    ====================================================== */

    createObserver() {

        this.observer = createObserver({

            threshold: .18,

            rootMargin: "0px 0px -10% 0px",

            callback: entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    this.reveal(entry.target);

                    this.observer.unobserve(entry.target);

                });

            }

        });

    }

    observeElements() {

        [

            ...this.revealElements,

            ...this.counterElements,

            ...this.imageRevealElements,

            ...this.splitElements

        ]

        .forEach(element => {

            this.observer.observe(element);

        });

    }

    /* ======================================================
       START
    ====================================================== */

    start() {

        document.body.classList.add(

            "animations-ready"

        );

    }

    /* ======================================================
       REVEAL
    ====================================================== */

    reveal(element) {

        element.classList.add("show");

        if (

            element.dataset.counter !== undefined

        ) {

            this.animateCounter(element);

        }

        if (

            element.dataset.split !== undefined

        ) {

            this.animateSplit(element);

        }

        if (

            element.classList.contains(

                "image-reveal"

            )

        ) {

            element.classList.add("show");

        }

        this.events.emit(

            "animation:revealed",

            {

                element

            }

        );

    }

    /* ======================================================
       COUNTER
    ====================================================== */

    animateCounter(element) {

        const end = Number(

            element.dataset.counter

        );

        const duration =

            this.config.counterSpeed;

        const start = performance.now();

        const update = time => {

            const progress = Math.min(

                (time - start) / duration,

                1

            );

            const value = Math.floor(

                end * progress

            );

            element.textContent = value;

            if (progress < 1) {

                requestAnimationFrame(update);

            }

            else {

                element.textContent = end;

            }

        };

        requestAnimationFrame(update);

    }

    /* ======================================================
       SPLIT
    ====================================================== */

    animateSplit(element) {

        const words =

            element.querySelectorAll(

                ".split-word"

            );

        words.forEach(

            (word, index) => {

                setTimeout(() => {

                    word.classList.add(

                        "show"

                    );

                },

                index *

                this.config.splitDelay

                );

            }

        );

    }

    /* ======================================================
       UPDATE
    ====================================================== */

    update() {

        if (!this.progressBar) return;

        const scrollTop =

            window.scrollY;

        const height =

            document.documentElement

            .scrollHeight -

            window.innerHeight;

        const progress =

            scrollTop / height;

        this.progressBar.style.transform =

            `scaleX(${progress})`;

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        this.observer?.disconnect();

    }

}