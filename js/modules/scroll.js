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
        this.handleScrollThrottled = throttle(this.handleScroll, 16);
        this.handleResizeThrottled = throttle(this.calculate, 100);
    }

    init() {
        this.cacheDOM();
        this.calculate();
        window.addEventListener("scroll", this.handleScrollThrottled, {
            passive: true
        });
        window.addEventListener("resize", this.handleResizeThrottled, {
            passive: true
        });
        this.updateState();
    }

    cacheDOM() {
        this.sections = [...document.querySelectorAll("section[id]")];
    }

    calculate = () => {
        this.viewportHeight = window.innerHeight;
        this.documentHeight = Math.max(
            0,
            document.documentElement.scrollHeight - this.viewportHeight
        );
    };

    handleScroll = () => {
        this.currentY = window.scrollY;
    };

    update() {
        this.updateState();
        this.detectSection();
    }

    updateState() {
        this.velocity = this.currentY - this.lastY;
        this.state.lastY = this.lastY;
        this.state.y = this.currentY;
        this.state.direction = this.velocity >= 0 ? "down" : "up";
        this.state.velocity = this.velocity;
        this.state.progress = this.documentHeight > 0
            ? Math.min(1, Math.max(0, this.currentY / this.documentHeight))
            : 0;
        this.lastY = this.currentY;

        this.events.emit("scroll:update", {
            y: this.state.y,
            progress: this.state.progress,
            velocity: this.velocity,
            direction: this.state.direction
        });
    }

    detectSection() {
        const marker = this.currentY + this.viewportHeight * 0.4;
        const active = this.sections.find(section => {
            const top = section.getBoundingClientRect().top + this.currentY;
            return marker >= top && marker < top + section.offsetHeight;
        });

        if (active && active.id !== this.app.state.activeSection) {
            this.app.state.setActiveSection(active.id);
            this.events.emit("section:change", { id: active.id });
        }
    }

    scrollTo(target, options = {}) {
        const { offset = 0, behavior } = options;
        let top = 0;
        if (typeof target === "string") {
            const element = document.querySelector(target);
            if (!element) return;
            top = element.getBoundingClientRect().top + window.scrollY - offset;
        } else {
            top = Number(target) - offset;
        }
        window.scrollTo({
            top: Math.max(0, top),
            behavior: behavior || (
                this.app.state.animation.reducedMotion ? "auto" : "smooth"
            )
        });
    }

    scrollTop() {
        this.scrollTo(0);
    }

    destroy() {
        window.removeEventListener("scroll", this.handleScrollThrottled);
        window.removeEventListener("resize", this.handleResizeThrottled);
    }
}
