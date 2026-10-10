/**
 * ==========================================================
 * LUMIÈRE
 * Loader Module
 * ==========================================================
 */

export default class Loader {

    constructor(app) {

        this.app = app;

        this.config = app.config.loader;
        this.state = app.state.loader;

        this.loader = document.querySelector(".loader");
        this.hero = document.querySelector(".hero");

    }

    /* ======================================================
   INIT
====================================================== */

init() {

    if (!this.loader) return;

    setTimeout(() => {

        this.loader.remove();

        document.body.style.overflow = "";

    }, 1000);

}

    /* ======================================================
       START
    ====================================================== */

    start() {

        setTimeout(() => {

            this.finish();

        }, this.config.duration);

    }

    /* ======================================================
       FINISH
    ====================================================== */

    finish() {

        this.loader.classList.add("hide");

        this.state.finished = true;
        this.state.animating = false;

        this.app.state.app.loading = false;
        this.app.state.app.ready = true;

        if (this.hero) {

            requestAnimationFrame(() => {

                this.hero.classList.add("ready");

            });

        }

        setTimeout(() => {

            this.loader.remove();

            this.unlockScroll();

            this.app.events.emit("loader:finished");

            this.dispatchReadyEvent();

        }, this.config.fadeDuration);

    }

    /* ======================================================
       READY EVENT
    ====================================================== */

    dispatchReadyEvent() {

        document.dispatchEvent(

            new CustomEvent("lumiere:ready")

        );

    }

    /* ======================================================
       SCROLL LOCK
    ====================================================== */

    lockScroll() {

        document.body.style.overflow = "hidden";

    }

    unlockScroll() {

        document.body.style.overflow = "";

    }

}