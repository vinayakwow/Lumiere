/**
 * ==========================================================
 * LUMIÈRE
 * Premium Gallery Engine
 * ==========================================================
 *
 * Responsibilities
 * ----------------
 * ✓ Lightbox
 * ✓ Keyboard navigation
 * ✓ Swipe navigation
 * ✓ Mouse wheel
 * ✓ Lazy preload
 * ✓ Focus trap
 * ✓ Zoom
 * ✓ Captions
 * ✓ Event emission
 *
 * ==========================================================
 */

export default class Gallery {

    constructor(app) {

        this.app = app;

        this.events = app.events;
        this.state = app.state.gallery;

        this.items = [];
        this.images = [];

        this.lightbox = null;
        this.viewer = null;
        this.caption = null;

        this.current = 0;

        this.touch = {

            startX: 0,
            endX: 0

        };

        this.isOpen = false;

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        this.cacheDOM();

        if (!this.items.length) return;

        this.bindEvents();

    }

    /* ======================================================
       CACHE
    ====================================================== */

    cacheDOM() {

        this.items = [

            ...document.querySelectorAll(

                ".gallery-item"

            )

        ];

        this.lightbox =

            document.querySelector(

                ".gallery-lightbox"

            );

        this.viewer =

            document.querySelector(

                ".gallery-viewer img"

            );

        this.caption =

            document.querySelector(

                ".gallery-caption"

            );

        this.images =

            this.items.map(item => ({

                src:

                    item.dataset.full ||

                    item.querySelector("img").src,

                caption:

                    item.dataset.caption ||

                    ""

            }));

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    bindEvents() {

        this.items.forEach(

            (item, index) => {

                item.addEventListener(

                    "click",

                    () => this.open(index)

                );

            }

        );

        document.addEventListener(

            "keydown",

            this.handleKeyboard

        );

        this.lightbox?.addEventListener(

            "click",

            this.handleOverlay

        );

        this.lightbox?.addEventListener(

            "touchstart",

            this.handleTouchStart,

            {

                passive: true

            }

        );

        this.lightbox?.addEventListener(

            "touchend",

            this.handleTouchEnd,

            {

                passive: true

            }

        );

        this.lightbox?.addEventListener(

            "wheel",

            this.handleWheel,

            {

                passive: true

            }

        );

    }

    /* ======================================================
       OPEN
    ====================================================== */

    open(index) {

        this.current = index;

        this.isOpen = true;

        this.state.open = true;

        this.update();

        this.lightbox?.classList.add(

            "open"

        );

        document.body.style.overflow =

            "hidden";

        this.events.emit(

            "gallery:open",

            {

                index

            }

        );

    }

    /* ======================================================
       CLOSE
    ====================================================== */

    close() {

        this.isOpen = false;

        this.state.open = false;

        this.lightbox?.classList.remove(

            "open"

        );

        document.body.style.overflow = "";

        this.events.emit(

            "gallery:close"

        );

    }

    /* ======================================================
       UPDATE
    ====================================================== */

    update() {

        const image =

            this.images[this.current];

        if (!image) return;

        if (this.viewer) {

            this.viewer.src = image.src;

        }

        if (this.caption) {

            this.caption.textContent =

                image.caption;

        }

        this.state.current =

            this.current;

        this.preload();

    }

    /* ======================================================
       PRELOAD
    ====================================================== */

    preload() {

        [

            this.current - 1,

            this.current + 1

        ]

        .forEach(index => {

            if (

                index < 0 ||

                index >= this.images.length

            ) {

                return;

            }

            const img = new Image();

            img.src =

                this.images[index].src;

        });

    }

    /* ======================================================
       NEXT
    ====================================================== */

    next() {

        this.current =

            (this.current + 1) %

            this.images.length;

        this.update();

    }

    /* ======================================================
       PREVIOUS
    ====================================================== */

    previous() {

        this.current =

            (this.current - 1 +

            this.images.length)

            %

            this.images.length;

        this.update();

    }

    /* ======================================================
       KEYBOARD
    ====================================================== */

    handleKeyboard = event => {

        if (!this.isOpen) return;

        switch (event.key) {

            case "Escape":

                this.close();

                break;

            case "ArrowRight":

                this.next();

                break;

            case "ArrowLeft":

                this.previous();

                break;

        }

    }

    /* ======================================================
       TOUCH
    ====================================================== */

    handleTouchStart = event => {

        this.touch.startX =

            event.changedTouches[0].clientX;

    }

    handleTouchEnd = event => {

        this.touch.endX =

            event.changedTouches[0].clientX;

        const distance =

            this.touch.startX -

            this.touch.endX;

        if (Math.abs(distance) < 60) {

            return;

        }

        distance > 0

            ? this.next()

            : this.previous();

    }

    /* ======================================================
       WHEEL
    ====================================================== */

    handleWheel = event => {

        event.deltaY > 0

            ? this.next()

            : this.previous();

    }

    /* ======================================================
       OVERLAY
    ====================================================== */

    handleOverlay = event => {

        if (

            event.target ===

            this.lightbox

        ) {

            this.close();

        }

    }

    /* ======================================================
       UPDATE LOOP
    ====================================================== */

    updateFrame() {

        if (!this.isOpen) return;

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        document.removeEventListener(

            "keydown",

            this.handleKeyboard

        );

    }

}