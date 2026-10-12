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
        this.unsubscribeLoader = null;
    }

    init() {
        if (!this.enabled || this.app.state.animation.reducedMotion) return;
        this.createCanvas();
        if (!this.ctx) return;
        this.resize();
        this.createParticles();
        window.addEventListener("resize", this.handleResize, { passive: true });
        this.unsubscribeLoader = this.events.on("loader:finished", () => {
            this.canvas?.classList.add("ready");
        });
    }

    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.className = "particle-canvas";
        this.canvas.setAttribute("aria-hidden", "true");
        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) {
            this.canvas = null;
            return;
        }
        document.body.append(this.canvas);
    }

    resize = () => {
        if (!this.canvas || !this.ctx) return;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize = () => {
        this.resize();
        this.createParticles();
    };

    createParticles() {
        this.particles = [];
        for (let index = 0; index < this.config.count; index++) {
            this.particles.push({
                x: random(0, this.width),
                y: random(0, this.height),
                radius: random(1, 3),
                speed: random(0.05, this.config.speed),
                opacity: random(0.02, this.config.opacity),
                drift: random(-0.15, 0.15)
            });
        }
    }

    update(frame) {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach(particle => {
            particle.y -= particle.speed * frame.delta * 60;
            particle.x += particle.drift * frame.delta * 60;
            if (particle.y < -10) {
                particle.y = this.height + 10;
                particle.x = random(0, this.width);
            }
            this.draw(particle);
        });
    }

    draw(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(212,175,55," + particle.opacity + ")";
        this.ctx.fill();
    }

    destroy() {
        window.removeEventListener("resize", this.handleResize);
        this.unsubscribeLoader?.();
        this.unsubscribeLoader = null;
        this.canvas?.remove();
        this.canvas = null;
        this.ctx = null;
    }
}
