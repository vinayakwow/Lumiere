/**
 * ==========================================================
 * LUMIÈRE
 * Premium Cursor Engine
 * ==========================================================
 */

import lerp from "../utils/lerp.js";

export default class Cursor {

    constructor(app) {

        this.app = app;

        this.config = app.config.cursor;
        this.state = app.state.cursor;

        this.cursor = null;
        this.dot = null;

        this.current = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };

        this.scale = 1;
        this.targetScale = 1;

        this.raf = null;

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        if (!this.config.enabled) return;

        if (window.matchMedia("(hover: none)").matches) {

            return;

        }

        this.cacheDOM();

        if (!this.cursor || !this.dot) return;

        this.bindEvents();

        this.render();

    }

    /* ======================================================
       DOM
    ====================================================== */

    cacheDOM() {

        this.cursor = document.querySelector(".cursor");

        this.dot = document.querySelector(".cursor-dot");

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    bindEvents() {

        document.addEventListener("mousemove", this.onMove);

        document.addEventListener("mousedown", this.onDown);

        document.addEventListener("mouseup", this.onUp);

        document.addEventListener("mouseenter", this.show);

        document.addEventListener("mouseleave", this.hide);

        this.bindHoverTargets();

    }

    bindHoverTargets() {

        const targets = document.querySelectorAll(

            "a, button, .btn, .gallery-item, .menu-card"

        );

        targets.forEach(target => {

            target.addEventListener("mouseenter", () => {

                this.targetScale = this.config.hoverScale;

                this.state.hovering = true;

            });

            target.addEventListener("mouseleave", () => {

                this.targetScale = 1;

                this.state.hovering = false;

            });

        });

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    onMove = ({ clientX, clientY }) => {

        this.target.x = clientX;

        this.target.y = clientY;

    };

    onDown = () => {

        this.targetScale = this.config.clickScale;

        this.state.clicked = true;

    };

    onUp = () => {

        this.targetScale = this.state.hovering
            ? this.config.hoverScale
            : 1;

        this.state.clicked = false;

    };

    show = () => {

        this.cursor.style.opacity = "1";

        this.dot.style.opacity = "1";

    };

    hide = () => {

        this.cursor.style.opacity = "0";

        this.dot.style.opacity = "0";

    };

    /* ======================================================
       RENDER LOOP
    ====================================================== */

    render = () => {

        this.current.x = lerp(

            this.current.x,

            this.target.x,

            this.config.speed

        );

        this.current.y = lerp(

            this.current.y,

            this.target.y,

            this.config.speed

        );

        this.scale = lerp(

            this.scale,

            this.targetScale,

            0.15

        );

        this.cursor.style.transform =

            `translate3d(${this.current.x}px, ${this.current.y}px, 0)
             translate(-50%, -50%)
             scale(${this.scale})`;

        this.dot.style.transform =

            `translate3d(${this.target.x}px, ${this.target.y}px, 0)
             translate(-50%, -50%)`;

        this.raf = requestAnimationFrame(this.render);

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        cancelAnimationFrame(this.raf);

    }

}