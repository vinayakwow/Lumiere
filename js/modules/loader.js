export default class Loader {
    constructor(app) {
        this.app = app;
        this.config = app.config.loader;
        this.state = app.state.loader;
        this.loader = document.querySelector(".loader");
        this.hero = document.querySelector(".hero");
        this.timer = null;
        this.finished = false;
    }

    init() {
        if (!this.loader) {
            this.complete();
            return;
        }

        this.lockScroll();
        const delay = this.app.state.animation.reducedMotion
            ? 0
            : Math.max(0, this.config.duration);
        this.timer = setTimeout(() => this.finish(), delay);
    }

    finish() {
        if (this.finished) return;
        this.finished = true;
        this.state.finished = true;
        this.state.animating = false;
        this.app.state.app.loading = false;
        this.app.state.app.ready = true;

        if (this.hero) {
            this.hero.classList.add("ready");
        }
        if (!this.loader) {
            this.complete();
            return;
        }

        this.loader.classList.add("hide");
        const fadeDuration = this.app.state.animation.reducedMotion
            ? 0
            : Math.max(0, this.config.fadeDuration);
        this.timer = setTimeout(() => this.complete(), fadeDuration);
    }

    complete() {
        this.state.finished = true;
        this.state.animating = false;
        this.app.state.app.loading = false;
        this.app.state.app.ready = true;
        this.hero?.classList.add("ready");
        this.loader?.remove();
        this.loader = null;
        this.unlockScroll();
        this.app.events.emit("loader:finished");
        document.dispatchEvent(new CustomEvent("lumiere:ready"));
    }

    lockScroll() {
        document.body.classList.add("loader-open");
    }

    unlockScroll() {
        document.body.classList.remove("loader-open");
    }

    destroy() {
        if (this.timer !== null) clearTimeout(this.timer);
        this.unlockScroll();
    }
}
