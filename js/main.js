/**
 * ==========================================================
 * LUMIÈRE
 * Luxury Restaurant Experience
 *
 * Main Entry Point
 *
 * Everything starts here.
 *
 * ==========================================================
 */

import App from "./engine/app.js";

class Lumiere {

    constructor() {

        this.app = new App();

    }

    async start() {

        try {

            await this.app.boot();

        }

        catch (error) {

            console.group("%cLUMIÈRE ERROR", "color:#ff5555");

            console.error(error);

            console.groupEnd();

        }

    }

}

window.addEventListener(

    "DOMContentLoaded",

    async () => {

        const lumiere = new Lumiere();

        await lumiere.start();

    },

    {

        once: true

    }

);

