/**
 * ==========================================================
 * LUMIÈRE
 * Render Engine
 * ==========================================================
 *
 * A centralized requestAnimationFrame engine.
 *
 * Every animated module registers a callback here.
 *
 * Modules NEVER create their own requestAnimationFrame loops.
 *
 * ==========================================================
 */

export default class Renderer {

    constructor() {

        /* ==============================================
           State
        ============================================== */

        this.running = false;

        this.frame = null;

        /* ==============================================
           Time
        ============================================== */

        this.startTime = 0;

        this.currentTime = 0;

        this.lastTime = 0;

        this.delta = 0;

        this.elapsed = 0;

        this.fps = 0;

        /* ==============================================
           Subscribers
        ============================================== */

        this.subscribers = new Set();

        /* ==============================================
           Visibility
        ============================================== */

        this.visible = true;

        document.addEventListener(

            "visibilitychange",

            this.handleVisibility

        );

    }

    /* ======================================================
       START
    ====================================================== */

    start() {

        if (this.running) return;

        this.running = true;

        this.startTime = performance.now();

        this.lastTime = this.startTime;

        this.loop(this.startTime);

    }

    /* ======================================================
       STOP
    ====================================================== */

    stop() {

        this.running = false;

        cancelAnimationFrame(this.frame);

    }

    /* ======================================================
       MAIN LOOP
    ====================================================== */

    loop = (time) => {

        if (!this.running) return;

        this.currentTime = time;

        this.delta =

            (time - this.lastTime) / 1000;

        this.elapsed =

            (time - this.startTime) / 1000;

        this.fps =

            Math.round(

                1 / Math.max(this.delta, 0.00001)

            );

        this.lastTime = time;

        this.update();

        this.frame =

            requestAnimationFrame(this.loop);

    }

    /* ======================================================
       UPDATE
    ====================================================== */

    update() {

        this.subscribers.forEach(callback => {

            callback({

                delta: this.delta,

                elapsed: this.elapsed,

                time: this.currentTime,

                fps: this.fps

            });

        });

    }

    /* ======================================================
       SUBSCRIBE
    ====================================================== */

    add(callback) {

        if (

            typeof callback !== "function"

        ) {

            console.warn(

                "Renderer: callback must be a function."

            );

            return;

        }

        this.subscribers.add(callback);

    }

    /* ======================================================
       UNSUBSCRIBE
    ====================================================== */

    remove(callback) {

        this.subscribers.delete(callback);

    }

    /* ======================================================
       REMOVE ALL
    ====================================================== */

    clear() {

        this.subscribers.clear();

    }

    /* ======================================================
       PAUSE
    ====================================================== */

    pause() {

        this.running = false;

    }

    /* ======================================================
       RESUME
    ====================================================== */

    resume() {

        if (this.running) return;

        this.running = true;

        this.lastTime = performance.now();

        this.loop(this.lastTime);

    }

    /* ======================================================
       VISIBILITY
    ====================================================== */

    handleVisibility = () => {

        this.visible = !document.hidden;

        if (this.visible) {

            this.resume();

        }

        else {

            this.pause();

        }

    }

    /* ======================================================
       INFO
    ====================================================== */

    getInfo() {

        return {

            fps: this.fps,

            delta: this.delta,

            elapsed: this.elapsed,

            subscribers:

                this.subscribers.size,

            running:

                this.running,

            visible:

                this.visible

        };

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        this.stop();

        this.clear();

        document.removeEventListener(

            "visibilitychange",

            this.handleVisibility

        );

    }

}