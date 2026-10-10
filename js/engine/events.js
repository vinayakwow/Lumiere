/**
 * ==========================================================
 * LUMIÈRE
 * Event Bus
 * ==========================================================
 *
 * Studio-grade publish / subscribe system.
 *
 * Features
 * --------
 * ✓ Namespaced events
 * ✓ once()
 * ✓ on()
 * ✓ off()
 * ✓ emit()
 * ✓ wildcard support
 * ✓ listener priority
 * ✓ debug mode
 * ✓ memory safe
 *
 * ==========================================================
 */

export default class EventBus {

    constructor(debug = false) {

        this.debug = debug;

        /**
         * eventName
         *
         * [
         *      {
         *          callback,
         *          priority,
         *          once
         *      }
         * ]
         */

        this.events = new Map();

    }

    /* ======================================================
       SUBSCRIBE
    ====================================================== */

    on(event, callback, priority = 0) {

        if (typeof callback !== "function") {

            throw new TypeError(

                `Event "${event}" requires a callback.`

            );

        }

        if (!this.events.has(event)) {

            this.events.set(event, []);

        }

        const listeners = this.events.get(event);

        listeners.push({

            callback,

            priority,

            once: false

        });

        listeners.sort(

            (a, b) => b.priority - a.priority

        );

        if (this.debug) {

            console.info(

                `[Events] Listening → ${event}`

            );

        }

        return () => this.off(event, callback);

    }

    /* ======================================================
       SUBSCRIBE ONCE
    ====================================================== */

    once(event, callback, priority = 0) {

        if (!this.events.has(event)) {

            this.events.set(event, []);

        }

        const listeners = this.events.get(event);

        listeners.push({

            callback,

            priority,

            once: true

        });

        listeners.sort(

            (a, b) => b.priority - a.priority

        );

        return () => this.off(event, callback);

    }

    /* ======================================================
       UNSUBSCRIBE
    ====================================================== */

    off(event, callback) {

        if (!this.events.has(event)) {

            return;

        }

        const listeners = this.events.get(event);

        this.events.set(

            event,

            listeners.filter(

                listener =>

                    listener.callback !== callback

            )

        );

    }

    /* ======================================================
       EMIT
    ====================================================== */

    emit(event, payload = {}) {

        this.execute(event, payload);

        /**
         * Namespace wildcard
         *
         * hero:ready
         *
         * ↓
         *
         * hero:*
         */

        const namespace = event.split(":")[0];

        this.execute(

            `${namespace}:*`,

            {

                event,

                payload

            }

        );

        /**
         * Global wildcard
         */

        this.execute(

            "*",

            {

                event,

                payload

            }

        );

    }

    /* ======================================================
       EXECUTE
    ====================================================== */

    execute(event, payload) {

        if (!this.events.has(event)) {

            return;

        }

        const listeners = this.events.get(event);

        for (const listener of [...listeners]) {

            try {

                listener.callback(payload);

            }

            catch (error) {

                console.error(

                    `[Events] "${event}" failed.`,

                    error

                );

            }

            if (listener.once) {

                this.off(

                    event,

                    listener.callback

                );

            }

        }

        if (this.debug) {

            console.log(

                `[Events] Emit → ${event}`,

                payload

            );

        }

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(event = null) {

        if (event) {

            this.events.delete(event);

            return;

        }

        this.events.clear();

    }

    /* ======================================================
       EXISTS
    ====================================================== */

    has(event) {

        return this.events.has(event);

    }

    /* ======================================================
       COUNT
    ====================================================== */

    count(event = null) {

        if (event) {

            return this.events.get(event)?.length || 0;

        }

        let total = 0;

        for (const listeners of this.events.values()) {

            total += listeners.length;

        }

        return total;

    }

    /* ======================================================
       LIST
    ====================================================== */

    list() {

        return [...this.events.keys()];

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        this.events.clear();

    }

}