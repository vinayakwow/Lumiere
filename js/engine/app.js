/**
 * ==========================================================
 * LUMIÈRE
 * Application Engine
 * ==========================================================
 */

import Config from "./config.js";
import State from "./state.js";
import Renderer from "./renderer.js";
import EventBus from "./events.js";
import AssetManager from "./assets.js";
import ModuleManager from "./moduleManager.js";

/* Modules */

import Loader from "../modules/loader.js";
import Navbar from "../modules/navbar.js";
import Cursor from "../modules/cursor.js";
import Hero from "../modules/hero.js";
import Gallery from "../modules/gallery.js";
import Reservation from "../modules/reservation.js";
import Scroll from "../modules/scroll.js";
import Animations from "../modules/animations.js";
import Particles from "../modules/particles.js";

export default class App {

    constructor() {

        this.config = new Config();

        this.state = new State();

        this.events = new EventBus(

            this.config.debug

        );

        this.renderer = new Renderer();

        this.assets = new AssetManager(this);

        this.modules = new ModuleManager(this);

    }

    /* ======================================================
       BOOT
    ====================================================== */

    async boot() {

        performance.mark("boot:start");

        this.registerModules();

        await this.registerAssets();

        await this.modules.init();

        this.renderer.add(

            frame =>

                this.modules.update(frame)

        );

        this.renderer.start();

        this.events.emit("app:ready");

        performance.mark("boot:end");

        performance.measure(

            "boot",

            "boot:start",

            "boot:end"

        );

    }

    /* ======================================================
       MODULES
    ====================================================== */

    registerModules() {

        this.modules.register({

            id: "loader",

            priority: 100,

            module: new Loader(this)

        });

        this.modules.register({

            id: "cursor",

            priority: 90,

            module: new Cursor(this)

        });

        this.modules.register({

            id: "navbar",

            priority: 80,

            module: new Navbar(this)

        });

        this.modules.register({

            id: "hero",

            priority: 70,

            module: new Hero(this)

        });

        this.modules.register({

            id: "scroll",

            priority: 60,

            module: new Scroll(this)

        });

        this.modules.register({

            id: "animations",

            priority: 50,

            module: new Animations(this)

        });

        this.modules.register({

            id: "gallery",

            priority: 40,

            module: new Gallery(this)

        });

        this.modules.register({

            id: "reservation",

            priority: 30,

            module: new Reservation(this)

        });

        this.modules.register({

            id: "particles",

            priority: 20,

            module: new Particles(this)

        });

    }

    /* ======================================================
       ASSETS
    ====================================================== */

    async registerAssets() {

        this.assets.registerMany([

            {
                type: "video",
                src: "assets/videos/hero.mp4"
            },

            {
                type: "image",
                src: "assets/images/chef.webp"
            },

            {
                type: "font",
                src: "Cormorant Garamond"
            }

        ]);

        await this.assets.load();

    }

}