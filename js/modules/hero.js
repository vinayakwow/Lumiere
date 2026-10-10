/**
 * ==========================================================
 * LUMIÈRE
 * Hero Engine
 * ==========================================================
 */

import lerp from "../utils/lerp.js";
import { clamp } from "../utils/math.js";

export default class Hero {

    constructor(app) {

        this.app = app;

        this.config = app.config.hero;
        this.state = app.state.hero;

        this.hero = null;
        this.video = null;
        this.content = null;
        this.ambient = null;

        this.mouse = {
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0
        };

        this.scrollY = 0;

        this.frame = null;

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        this.cacheDOM();

        if (!this.hero) return;

        this.bindEvents();

        this.start();

    }

    /* ======================================================
       CACHE
    ====================================================== */

    cacheDOM() {

        this.hero = document.querySelector(".hero");

        this.video = this.hero.querySelector("video");

        this.content = this.hero.querySelector(".hero-content");

        this.ambient = this.hero.querySelector(".ambient-light");

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    bindEvents() {

        window.addEventListener("mousemove", this.handleMouse);

        window.addEventListener("scroll", this.handleScroll, {

            passive: true

        });

    }

    handleMouse = (event) => {

        const x = event.clientX / window.innerWidth - .5;

        const y = event.clientY / window.innerHeight - .5;

        this.mouse.targetX = x;

        this.mouse.targetY = y;

    };

    handleScroll = () => {

        this.scrollY = window.scrollY;

    };

    /* ======================================================
       LOOP
    ====================================================== */

    start() {

        const update = () => {

            this.updateMouse();

            this.updateParallax();

            this.updateVideo();

            this.updateAmbient();

            this.frame = requestAnimationFrame(update);

        };

        update();

    }

    /* ======================================================
       MOUSE
    ====================================================== */

    updateMouse() {

        this.mouse.currentX = lerp(

            this.mouse.currentX,

            this.mouse.targetX,

            this.config.mouseEase

        );

        this.mouse.currentY = lerp(

            this.mouse.currentY,

            this.mouse.targetY,

            this.config.mouseEase

        );

    }

    /* ======================================================
       CONTENT PARALLAX
    ====================================================== */

    updateParallax() {

        if (!this.content) return;

        const x =

            this.mouse.currentX *

            this.config.parallaxStrength;

        const y =

            this.mouse.currentY *

            this.config.parallaxStrength;

        this.content.style.transform =

            `translate3d(${x}px, ${y}px, 0)`;

    }

    /* ======================================================
       VIDEO
    ====================================================== */

    updateVideo() {

        if (!this.video) return;

        const zoom =

            clamp(

                1.05 - this.scrollY * 0.00008,

                1,

                1.08

            );

        this.video.style.transform =

            `scale(${zoom})`;

    }

    /* ======================================================
       AMBIENT LIGHT
    ====================================================== */

    updateAmbient() {

        if (!this.ambient) return;

        const x =

            this.mouse.currentX * 140;

        const y =

            this.mouse.currentY * 140;

        this.ambient.style.transform =

            `translate3d(${x}px, ${y}px, 0)`;

    }

    /* ======================================================
       PUBLIC
    ====================================================== */

    reveal() {

        this.hero.classList.add("ready");

        this.state.revealed = true;

    }

    destroy() {

        cancelAnimationFrame(this.frame);

    }

}