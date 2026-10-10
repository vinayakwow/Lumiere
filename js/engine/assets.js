/**
 * ==========================================================
 * LUMIÈRE
 * Asset Manager
 * ==========================================================
 *
 * Production Asset Pipeline
 *
 * Responsibilities
 * ----------------
 * ✓ Image preloading
 * ✓ Video preloading
 * ✓ Font preloading
 * ✓ Progress tracking
 * ✓ Promise based loading
 * ✓ Caching
 * ✓ Error recovery
 * ✓ Event emission
 *
 * ==========================================================
 */

export default class AssetManager {

    constructor(app) {

        this.app = app;

        this.events = app.events;

        /**
         * Assets waiting to load
         */

        this.queue = [];

        /**
         * Loaded assets
         */

        this.cache = new Map();

        /**
         * Failed assets
         */

        this.failed = [];

        /**
         * Progress
         */

        this.total = 0;

        this.loaded = 0;

        this.progress = 0;

        this.loading = false;

    }

    /* ======================================================
       REGISTER
    ====================================================== */

    register(asset) {

        if (!asset?.src) {

            throw new Error(
                "Asset requires a src."
            );

        }

        this.queue.push({

            type: asset.type ?? "image",

            src: asset.src,

            preload: asset.preload ?? true

        });

    }

    registerMany(list = []) {

        list.forEach(asset => this.register(asset));

    }

    /* ======================================================
       LOAD EVERYTHING
    ====================================================== */

    async load() {

        if (this.loading) {

            return;

        }

        this.loading = true;

        this.total = this.queue.length;

        if (this.total === 0) {

            this.finish();

            return;

        }

        const jobs = this.queue.map(asset =>

            this.loadAsset(asset)

        );

        await Promise.allSettled(jobs);

        this.finish();

    }

    /* ======================================================
       LOAD SINGLE
    ====================================================== */

    async loadAsset(asset) {

        try {

            switch (asset.type) {

                case "image":

                    await this.loadImage(asset);

                    break;

                case "video":

                    await this.loadVideo(asset);

                    break;

                case "font":

                    await this.loadFont(asset);

                    break;

                default:

                    throw new Error(
                        `Unknown asset type "${asset.type}"`
                    );

            }

        }

        catch (error) {

            this.failed.push({

                asset,

                error

            });

        }

        finally {

            this.loaded++;

            this.updateProgress();

        }

    }

    /* ======================================================
       IMAGE
    ====================================================== */

    loadImage(asset) {

        return new Promise((resolve, reject) => {

            const image = new Image();

            image.onload = () => {

                this.cache.set(

                    asset.src,

                    image

                );

                resolve(image);

            };

            image.onerror = reject;

            image.src = asset.src;

        });

    }

    /* ======================================================
       VIDEO
    ====================================================== */

    loadVideo(asset) {

        return new Promise((resolve, reject) => {

            const video = document.createElement("video");

            video.preload = "auto";

            video.onloadeddata = () => {

                this.cache.set(

                    asset.src,

                    video

                );

                resolve(video);

            };

            video.onerror = reject;

            video.src = asset.src;

        });

    }

    /* ======================================================
       FONT
    ====================================================== */

    async loadFont(asset) {

        await document.fonts.load(

            asset.font ?? "1rem serif"

        );

        this.cache.set(

            asset.src,

            true

        );

    }

    /* ======================================================
       PROGRESS
    ====================================================== */

    updateProgress() {

        this.progress =

            this.loaded /

            this.total;

        this.events.emit(

            "assets:progress",

            {

                loaded: this.loaded,

                total: this.total,

                progress: this.progress

            }

        );

    }

    /* ======================================================
       COMPLETE
    ====================================================== */

    finish() {

        this.loading = false;

        this.events.emit(

            "assets:loaded",

            {

                cache: this.cache,

                failed: this.failed,

                total: this.total

            }

        );

    }

    /* ======================================================
       GET
    ====================================================== */

    get(src) {

        return this.cache.get(src);

    }

    has(src) {

        return this.cache.has(src);

    }

    /* ======================================================
       INFO
    ====================================================== */

    getInfo() {

        return {

            total: this.total,

            loaded: this.loaded,

            failed: this.failed.length,

            progress: this.progress,

            cached: this.cache.size

        };

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        this.queue.length = 0;

        this.failed.length = 0;

        this.cache.clear();

    }

}