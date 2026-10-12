import createObserver from "../utils/observer.js";
import splitText from "../utils/splitText.js";

export default class Animations {
    constructor(app) {
        this.app = app;
        this.state = app.state;
        this.config = app.config.animation;
        this.observer = null;
        this.progressBar = null;
        this.sections = [];
        this.revealElements = [];
        this.counterElements = [];
        this.splitElements = [];
        this.timers = new Set();
        this.frames = new Set();
    }

    init() {
        this.cacheDOM();
        this.prepareSplitText();

        if (
            this.state.animation.reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            this.revealAll();
            return;
        }

        this.createObserver();
        this.observeElements();
        this.start();
    }

    cacheDOM() {
        this.progressBar = document.querySelector(".scroll-progress-bar");
        this.sections = [
            ...document.querySelectorAll("section.section, footer.footer")
        ];
        this.revealElements = [
            ...document.querySelectorAll(
                ".reveal, .reveal-left, .reveal-right, [data-reveal], .image-reveal"
            )
        ];
        this.counterElements = [
            ...document.querySelectorAll("[data-counter]")
        ];
        this.splitElements = [
            ...document.querySelectorAll(".split, [data-split]")
        ];
    }

    prepareSplitText() {
        this.splitElements.forEach(element => {
            if (element.dataset.splitReady === "true") return;
            splitText(element);
            element.dataset.splitReady = "true";
        });
    }

    createObserver() {
        this.observer = createObserver({
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px",
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
        const targets = new Set([
            ...this.sections,
            ...this.revealElements,
            ...this.counterElements,
            ...this.splitElements
        ]);

        targets.forEach(element => this.observer.observe(element));
        this.start();
    }

    start() {
        document.body.classList.add("animations-ready");
    }

    revealAll() {
        const targets = new Set([
            ...this.sections,
            ...this.revealElements,
            ...this.counterElements,
            ...this.splitElements
        ]);

        targets.forEach(element => {
            element.classList.add("active");
            element.querySelectorAll(".split-word").forEach(word => {
                word.classList.add("show");
            });
            if (element.dataset.counter !== undefined) {
                element.textContent = element.dataset.counter;
            }
        });
        this.start();
    }

    reveal(element) {
        element.classList.add("active");

        if (element.dataset.counter !== undefined) {
            this.animateCounter(element);
        }

        if (
            element.matches(".split, [data-split]") &&
            !this.state.animation.reducedMotion
        ) {
            this.animateSplit(element);
        }

        if (element.classList.contains("image-reveal")) {
            element.classList.add("show");
        }
    }

    animateCounter(element) {
        const end = Number(element.dataset.counter);
        if (!Number.isFinite(end)) return;

        const duration = Math.max(1, this.config.counterSpeed);
        const start = performance.now();
        let frame = 0;

        const update = time => {
            const progress = Math.min((time - start) / duration, 1);
            element.textContent = String(Math.floor(end * progress));
            if (progress < 1) {
                frame = requestAnimationFrame(update);
                this.frames.add(frame);
            } else {
                element.textContent = String(end);
                this.frames.delete(frame);
            }
        };

        frame = requestAnimationFrame(update);
        this.frames.add(frame);
    }

    animateSplit(element) {
        const delay = Math.max(0, this.config.splitDelay);
        element.querySelectorAll(".split-word").forEach((word, index) => {
            const timer = setTimeout(() => {
                word.classList.add("show");
                this.timers.delete(timer);
            }, index * delay);
            this.timers.add(timer);
        });
    }

    update() {
        if (!this.progressBar) return;
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
            ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
            : 0;
        this.progressBar.style.transform = "scaleX(" + progress + ")";
    }

    destroy() {
        this.observer?.disconnect();
        this.timers.forEach(timer => clearTimeout(timer));
        this.frames.forEach(frame => cancelAnimationFrame(frame));
        this.timers.clear();
        this.frames.clear();
    }
}
