import throttle from "../utils/throttle.js";

export default class Navbar {
    constructor(app) {
        this.app = app;
        this.config = app.config.navbar;
        this.state = app.state.navbar;
        this.navbar = null;
        this.menu = null;
        this.toggle = null;
        this.links = [];
        this.sections = [];
        this.observer = null;
        this.lastScroll = window.scrollY;
        this.handleScrollThrottled = throttle(() => this.onScroll(), 16);
    }

    init() {
        this.cacheDOM();
        if (!this.navbar) return;

        this.collectSections();
        this.bindEvents();
        this.observeSections();
        this.onScroll();
    }

    cacheDOM() {
        this.navbar = document.querySelector(".navbar");
        this.menu = document.querySelector(".mobile-menu");
        this.toggle = document.querySelector(".mobile-toggle");
        this.links = [
            ...document.querySelectorAll(".desktop-nav a, .mobile-menu a")
        ];
    }

    collectSections() {
        const sectionIds = new Set(
            this.links
                .map(link => link.getAttribute("href"))
                .filter(href => href && href.startsWith("#"))
        );
        this.sections = [...sectionIds]
            .map(id => document.getElementById(id.slice(1)))
            .filter(Boolean);
    }

    bindEvents() {
        window.addEventListener("scroll", this.handleScrollThrottled, {
            passive: true
        });
        this.toggle?.addEventListener("click", this.handleToggle);
        this.links.forEach(link => {
            link.addEventListener("click", this.handleLinkClick);
        });
        document.addEventListener("keydown", this.handleKeydown);
        document.addEventListener("click", this.handleDocumentClick);
    }

    handleToggle = () => {
        if (this.state.open) {
            this.closeMenu(true);
        } else {
            this.openMenu();
        }
    };

    handleLinkClick = event => {
        const link = event.currentTarget;
        const href = link.getAttribute("href");
        const target = href?.startsWith("#")
            ? document.getElementById(href.slice(1))
            : null;

        this.closeMenu(false);
        if (!target) return;

        event.preventDefault();
        const destination = new URL(link.href);
        if (window.location.href !== destination.href) {
            window.history.pushState(null, "", destination);
        }

        target.scrollIntoView({
            behavior: this.app.state.animation.reducedMotion ? "auto" : "smooth",
            block: "start"
        });
        if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
        this.setActive(target.id);
    };

    handleDocumentClick = event => {
        if (!this.state.open) return;
        if (this.navbar?.contains(event.target) || this.menu?.contains(event.target)) {
            return;
        }
        this.closeMenu(false);
    };

    handleKeydown = event => {
        if (!this.state.open) return;

        if (event.key === "Escape") {
            event.preventDefault();
            this.closeMenu(true);
            return;
        }

        if (event.key !== "Tab" || !this.menu) return;
        const focusable = [...this.menu.querySelectorAll('a[href]:not([tabindex="-1"])')];
        if (!focusable.length) return;

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

    openMenu() {
        if (!this.menu || !this.toggle) return;
        this.state.open = true;
        this.toggle.classList.add("active");
        this.toggle.setAttribute("aria-expanded", "true");
        this.menu.classList.add("open");
        this.menu.setAttribute("aria-hidden", "false");
        this.menu.removeAttribute("inert");
        document.body.classList.add("nav-open");
        this.menu.querySelector("a[href]")?.focus();
    }

    closeMenu(restoreFocus = false) {
        this.state.open = false;
        this.toggle?.classList.remove("active");
        this.toggle?.setAttribute("aria-expanded", "false");
        this.menu?.classList.remove("open");
        this.menu?.setAttribute("aria-hidden", "true");
        this.menu?.setAttribute("inert", "");
        document.body.classList.remove("nav-open");

        if (restoreFocus) this.toggle?.focus();
    }

    onScroll() {
        const current = window.scrollY;
        this.navbar?.classList.toggle(
            "scrolled",
            current > this.config.scrollOffset
        );

        if (window.innerWidth <= 960) {
            this.navbar.style.transform = "";
            this.lastScroll = current;
            return;
        }

        if (current < this.config.scrollOffset) {
            this.navbar.style.transform = "";
        } else if (current > this.lastScroll + this.config.hideOffset) {
            this.navbar.style.transform = "translateY(-140%)";
        } else if (current < this.lastScroll - this.config.hideOffset) {
            this.navbar.style.transform = "";
        }

        this.lastScroll = current;
    }

    observeSections() {
        if (!("IntersectionObserver" in window)) return;
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) this.setActive(entry.target.id);
            });
        }, {
            rootMargin: "-10% 0px -25% 0px",
            threshold: 0.1
        });

        this.sections.forEach(section => this.observer.observe(section));
    }

    setActive(id) {
        this.links.forEach(link => {
            const active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
        this.state.activeLink = id;
    }

    destroy() {
        window.removeEventListener("scroll", this.handleScrollThrottled);
        this.toggle?.removeEventListener("click", this.handleToggle);
        this.links.forEach(link => {
            link.removeEventListener("click", this.handleLinkClick);
        });
        document.removeEventListener("keydown", this.handleKeydown);
        document.removeEventListener("click", this.handleDocumentClick);
        this.observer?.disconnect();
        this.closeMenu(false);
    }
}
