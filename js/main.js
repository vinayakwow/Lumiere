import App from "./engine/app.js";

class Lumiere {
    constructor() {
        this.app = new App();
    }

    async start() {
        try {
            await this.app.boot();
        } catch (error) {
            console.error("[LUMIÈRE] Startup failed.", error);
            document.querySelector(".loader")?.remove();
            document.body.classList.remove("loader-open", "animations-ready");
            document.querySelector(".hero")?.classList.add("ready");
        }
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    const lumiere = new Lumiere();
    await lumiere.start();
}, { once: true });
