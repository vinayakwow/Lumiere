/**
 * ==========================================================
 * LUMIÈRE
 * Module Manager
 * ==========================================================
 *
 * Registers
 * Initializes
 * Enables
 * Disables
 * Restarts
 * Destroys
 * Profiles
 *
 * Every feature module is managed here.
 *
 * ==========================================================
 */

export default class ModuleManager {

    constructor(app) {

        this.app = app;

        /**
         * id -> module
         */

        this.modules = new Map();

        /**
         * Startup order
         */

        this.order = [];

    }

    /* ======================================================
       REGISTER
    ====================================================== */

    register({

        id,

        module,

        priority = 0,

        enabled = true

    }) {

        if (!id) {

            throw new Error(

                "Module requires an id."

            );

        }

        if (this.modules.has(id)) {

            throw new Error(

                `Module "${id}" already exists.`

            );

        }

        this.modules.set(id, {

            id,

            module,

            enabled,

            initialized: false,

            priority,

            startup: 0

        });

    }

    /* ======================================================
       SORT
    ====================================================== */

    sort() {

        this.order =

            [...this.modules.values()]

                .sort(

                    (a, b) =>

                        b.priority - a.priority

                );

    }

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async init() {

        this.sort();

        for (const entry of this.order) {

            if (!entry.enabled) {

                continue;

            }

            const start = performance.now();

            try {

                if (

                    typeof entry.module.init ===

                    "function"

                ) {

                    await entry.module.init();

                }

                entry.initialized = true;

            }

            catch (error) {

                console.error(

                    `[Module] ${entry.id}`,

                    error

                );

            }

            entry.startup =

                performance.now() - start;

        }

    }

    /* ======================================================
       ENABLE
    ====================================================== */

    enable(id) {

        const entry = this.modules.get(id);

        if (!entry) return;

        entry.enabled = true;

        entry.module.enable?.();

    }

    /* ======================================================
       DISABLE
    ====================================================== */

    disable(id) {

        const entry = this.modules.get(id);

        if (!entry) return;

        entry.enabled = false;

        entry.module.disable?.();

    }

    /* ======================================================
       RESTART
    ====================================================== */

    async restart(id) {

        const entry = this.modules.get(id);

        if (!entry) return;

        entry.module.destroy?.();

        await entry.module.init?.();

    }

    /* ======================================================
       UPDATE
    ====================================================== */

    update(frame) {

        for (const entry of this.order) {

            if (

                !entry.enabled ||

                !entry.initialized

            ) {

                continue;

            }

            entry.module.update?.(frame);

        }

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        for (const entry of this.order) {

            entry.module.destroy?.();

        }

        this.modules.clear();

    }

    /* ======================================================
       GET
    ====================================================== */

    get(id) {

        return this.modules.get(id)?.module;

    }

    /* ======================================================
       EXISTS
    ====================================================== */

    has(id) {

        return this.modules.has(id);

    }

    /* ======================================================
       INFO
    ====================================================== */

    info() {

        return this.order.map(entry => ({

            id: entry.id,

            enabled: entry.enabled,

            initialized: entry.initialized,

            startup:

                Number(

                    entry.startup.toFixed(2)

                )

        }));

    }

}