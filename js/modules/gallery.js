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
        this.closeButton = null;
        this.previousButton = null;
        this.nextButton = null;
        this.current = 0;
        this.isOpen = false;
        this.previousFocus = null;
        this.previousOverflow = "";
        this.touchStartX = null;
    }

    init() {
        this.cacheDOM();
        if (!this.items.length) return;
        this.createLightbox();
        this.bindEvents();
    }

    cacheDOM() {
        this.items = [...document.querySelectorAll(".gallery-card")];
        this.images = this.items.map(item => {
            const image = item.querySelector("img");
            const caption = item.querySelector("figcaption")?.textContent.trim() || "";
            if (image) {
                item.setAttribute("role", "button");
                item.setAttribute("tabindex", "0");
                item.setAttribute(
                    "aria-label",
                    "Open image: " + (caption || image.alt || "Gallery image")
                );
            }
            return {
                src: image?.currentSrc || image?.src || "",
                alt: image?.alt || "",
                caption
            };
        }).filter(image => image.src);
    }

    createLightbox() {
        this.lightbox = document.createElement("div");
        this.lightbox.className = "gallery-lightbox";
        this.lightbox.setAttribute("role", "dialog");
        this.lightbox.setAttribute("aria-modal", "true");
        this.lightbox.setAttribute("aria-label", "Image gallery");
        this.lightbox.setAttribute("aria-hidden", "true");
        this.lightbox.setAttribute("inert", "");
        this.lightbox.tabIndex = -1;

        const content = document.createElement("div");
        content.className = "gallery-lightbox-content";

        this.closeButton = this.createButton("gallery-close", "Close image", "×");
        this.previousButton = this.createButton("gallery-prev", "Previous image", "‹");
        this.nextButton = this.createButton("gallery-next", "Next image", "›");

        const figure = document.createElement("figure");
        this.viewer = document.createElement("img");
        this.viewer.alt = "";
        this.caption = document.createElement("figcaption");
        this.caption.className = "gallery-lightbox-caption";
        figure.append(this.viewer, this.caption);
        content.append(
            this.closeButton,
            this.previousButton,
            this.nextButton,
            figure
        );
        this.lightbox.append(content);
        document.body.append(this.lightbox);
    }

    createButton(className, label, text) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.setAttribute("aria-label", label);
        button.textContent = text;
        return button;
    }

    bindEvents() {
        this.items.forEach(item => {
            item.addEventListener("click", this.handleItemClick);
            item.addEventListener("keydown", this.handleItemKeydown);
        });
        this.closeButton.addEventListener("click", () => this.close());
        this.previousButton.addEventListener("click", () => this.previous());
        this.nextButton.addEventListener("click", () => this.next());
        this.lightbox.addEventListener("click", this.handleOverlay);
        this.lightbox.addEventListener("touchstart", this.handleTouchStart, {
            passive: true
        });
        this.lightbox.addEventListener("touchend", this.handleTouchEnd, {
            passive: true
        });
        document.addEventListener("keydown", this.handleKeyboard);
    }

    handleItemClick = event => {
        const item = event.currentTarget;
        this.open(this.items.indexOf(item));
    };

    handleItemKeydown = event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        this.open(this.items.indexOf(event.currentTarget));
    };

    open(index) {
        if (!this.lightbox || !this.images.length) return;
        this.current = index;
        this.isOpen = true;
        this.state.open = true;
        this.previousFocus = document.activeElement;
        this.previousOverflow = document.body.style.overflow;
        this.update();
        this.lightbox.classList.add("open");
        this.lightbox.setAttribute("aria-hidden", "false");
        this.lightbox.removeAttribute("inert");
        document.body.classList.add("lightbox-open");
        this.closeButton.focus();
        this.events.emit("gallery:open", { index });
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.state.open = false;
        this.lightbox.classList.remove("open");
        this.lightbox.setAttribute("aria-hidden", "true");
        this.lightbox.setAttribute("inert", "");
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = this.previousOverflow;
        if (this.previousFocus?.isConnected) this.previousFocus.focus();
        this.events.emit("gallery:close");
    }

    update() {
        const image = this.images[this.current];
        if (!image) return;
        this.viewer.src = image.src;
        this.viewer.alt = image.alt;
        this.caption.textContent = image.caption;
        this.state.current = this.current;
        this.preloadAdjacent();
    }

    preloadAdjacent() {
        [this.current - 1, this.current + 1].forEach(index => {
            if (index < 0 || index >= this.images.length) return;
            const image = new Image();
            image.src = this.images[index].src;
        });
    }

    next() {
        this.current = (this.current + 1) % this.images.length;
        this.update();
    }

    previous() {
        this.current = (this.current - 1 + this.images.length) % this.images.length;
        this.update();
    }

    handleKeyboard = event => {
        if (!this.isOpen) return;

        if (event.key === "Escape") {
            event.preventDefault();
            this.close();
            return;
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            this.next();
            return;
        }
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.previous();
            return;
        }
        if (event.key !== "Tab") return;

        const focusable = [
            this.closeButton,
            this.previousButton,
            this.nextButton
        ];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    handleTouchStart = event => {
        this.touchStartX = event.changedTouches[0]?.clientX ?? null;
    };

    handleTouchEnd = event => {
        if (this.touchStartX === null) return;
        const endX = event.changedTouches[0]?.clientX;
        const distance = this.touchStartX - endX;
        this.touchStartX = null;
        if (!Number.isFinite(distance) || Math.abs(distance) < 48) return;
        if (distance > 0) this.next();
        else this.previous();
    };

    handleOverlay = event => {
        if (event.target === this.lightbox) this.close();
    };

    destroy() {
        document.removeEventListener("keydown", this.handleKeyboard);
        this.items.forEach(item => {
            item.removeEventListener("click", this.handleItemClick);
            item.removeEventListener("keydown", this.handleItemKeydown);
        });
        this.close();
        this.lightbox?.remove();
        this.lightbox = null;
    }
}
