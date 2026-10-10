/**
 * ==========================================================
 * LUMIÈRE
 * Ambient Particles
 * ==========================================================
 *
 * Responsibilities
 * ----------------
 * ✓ Ambient luxury atmosphere
 * ✓ Canvas rendering
 * ✓ Renderer integration
 * ✓ Auto resize
 * ✓ Visibility pause
 * ✓ Performance friendly
 *
 * ==========================================================
 */

import { random } from "../utils/math.js";

export default class Particles {

    constructor(app) {

        this.app = app;

        this.events = app.events;
        this.config = app.config.particles;

        this.canvas = null;
        this.ctx = null;

        this.width = 0;
        this.height = 0;

        this.particles = [];

        this.enabled = this.config.enabled;

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        if (!this.enabled) return;

        this.createCanvas();

        this.resize();

        this.createParticles();

        window.addEventListener(

            "resize",

            this.handleResize

        );

        this.events.on(

            "loader:finished",

            () => {

                this.canvas.classList.add("ready");

            }

        );

    }

    /* ======================================================
       CANVAS
    ====================================================== */

    createCanvas() {

        this.canvas = document.createElement(

            "canvas"

        );

        this.canvas.className =

            "particle-canvas";

        this.ctx =

            this.canvas.getContext("2d");

        document.body.appendChild(

            this.canvas

        );

    }

    /* ======================================================
       SIZE
    ====================================================== */

    resize() {

        this.width =

            window.innerWidth;

        this.height =

            window.innerHeight;

        this.canvas.width =

            this.width *

            devicePixelRatio;

        this.canvas.height =

            this.height *

            devicePixelRatio;

        this.canvas.style.width =

            this.width + "px";

        this.canvas.style.height =

            this.height + "px";

        const dpr = window.devicePixelRatio || 1;

this.canvas.width = this.width * dpr;
this.canvas.height = this.height * dpr;

this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    }

    handleResize = () => {

        this.resize();

    }

    /* ======================================================
       CREATE
    ====================================================== */

    createParticles() {

        this.particles = [];

        for (

            let i = 0;

            i < this.config.count;

            i++

        ) {

            this.particles.push({

                x: random(0, this.width),

                y: random(0, this.height),

                radius: random(1, 3),

                speed: random(

                    0.05,

                    this.config.speed

                ),

                opacity: random(

                    0.02,

                    this.config.opacity

                ),

                drift: random(

                    -0.15,

                    0.15

                )

            });

        }

    }

    /* ======================================================
       UPDATE
    ====================================================== */

    update(frame) {

        if (!this.ctx) return;

        this.ctx.clearRect(

            0,

            0,

            this.width,

            this.height

        );

        this.particles.forEach(

            particle => {

                particle.y -=

                    particle.speed *

                    frame.delta *

                    60;

                particle.x +=

                    particle.drift *

                    frame.delta *

                    60;

                if (

                    particle.y < -10

                ) {

                    particle.y =

                        this.height + 10;

                    particle.x =

                        random(

                            0,

                            this.width

                        );

                }

                this.draw(particle);

            }

        );

    }

    /* ======================================================
       DRAW
    ====================================================== */

    draw(particle) {

        this.ctx.beginPath();

        this.ctx.arc(

            particle.x,

            particle.y,

            particle.radius,

            0,

            Math.PI * 2

        );

        this.ctx.fillStyle =

            `rgba(212,175,55,${particle.opacity})`;

        this.ctx.fill();

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        window.removeEventListener(

            "resize",

            this.handleResize

        );

        this.canvas?.remove();

    }

}