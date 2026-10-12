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

    init() {
        this.cacheDOM();
        if (!this.hero) return;

        if (this.app.state.animation.reducedMotion) {
            this.video?.pause();
            return;
        }

        this.bindEvents();
        this.start();
    }

    cacheDOM() {
        this.hero = document.querySelector(".hero");
        if (!this.hero) return;
        this.video = this.hero.querySelector(".hero-video");
        this.content = this.hero.querySelector(".hero-container");
        this.ambient = this.hero.querySelector(".ambient-light");
    }

    bindEvents() {
        window.addEventListener("mousemove", this.handleMouse, { passive: true });
        window.addEventListener("scroll", this.handleScroll, { passive: true });
    }

    handleMouse = event => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        this.mouse.targetX = event.clientX / window.innerWidth - 0.5;
        this.mouse.targetY = event.clientY / window.innerHeight - 0.5;
    };

    handleScroll = () => {
        this.scrollY = window.scrollY;
    };

    start() {
        if (this.frame !== null) return;
        const update = () => {
            this.updateMouse();
            this.updateParallax();
            this.updateVideo();
            this.updateAmbient();
            this.frame = requestAnimationFrame(update);
        };
        update();
    }

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

    updateParallax() {
        if (!this.content) return;
        const x = this.mouse.currentX * this.config.parallaxStrength;
        const y = this.mouse.currentY * this.config.parallaxStrength;
        this.content.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    }

    updateVideo() {
        if (!this.video) return;
        const zoom = clamp(1.05 - this.scrollY * 0.00008, 1, 1.08);
        this.video.style.transform = "scale(" + zoom + ")";
    }

    updateAmbient() {
        if (!this.ambient) return;
        const x = this.mouse.currentX * 140;
        const y = this.mouse.currentY * 140;
        this.ambient.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    }

    reveal() {
        this.hero?.classList.add("ready");
        this.state.revealed = true;
    }

    destroy() {
        window.removeEventListener("mousemove", this.handleMouse);
        window.removeEventListener("scroll", this.handleScroll);
        if (this.frame !== null) cancelAnimationFrame(this.frame);
        this.frame = null;
    }
}
