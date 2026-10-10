/**
 * ==========================================================
 * LUMIÈRE
 * Navbar Module
 * ==========================================================
 */

import throttle from "../utils/throttle.js";

export default class Navbar {

    constructor(app) {

        this.app = app;

        this.config = app.config.navbar;
        this.state = app.state.navbar;

        this.navbar = null;
        this.links = [];
        this.toggle = null;
        this.lastScroll = 0;
        this.sections = [];

        this.ticking = false;

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        this.cacheDOM();

        if (!this.navbar) return;

        this.collectSections();

        this.bindEvents();

        this.observeSections();

    }

    /* ======================================================
       CACHE
    ====================================================== */

    cacheDOM() {

        this.navbar = document.querySelector(".navbar");

        this.links = [...document.querySelectorAll(".nav-links a")];

        this.toggle = document.querySelector(".menu-toggle");

    }

    /* ======================================================
       SECTIONS
    ====================================================== */

    collectSections() {

        this.sections = this.links
            .map(link => {

                const id = link.getAttribute("href");

                return document.querySelector(id);

            })
            .filter(Boolean);

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    bindEvents() {

        window.addEventListener(
            "scroll",
            throttle(() => this.onScroll(), 16)
        );

        this.toggle?.addEventListener(
            "click",
            () => this.toggleMenu()
        );

        this.links.forEach(link => {

            link.addEventListener("click", e => {

                this.navigate(e, link);

            });

        });

    }

    /* ======================================================
       SCROLL
    ====================================================== */

    onScroll() {

        const current = window.scrollY;

        this.toggleScrolledState(current);

        this.handleVisibility(current);

    }

    /* ======================================================
       GLASS EFFECT
    ====================================================== */

    toggleScrolledState(scrollY) {

        const active =
            scrollY > this.config.scrollOffset;

        this.navbar.classList.toggle(
            "scrolled",
            active
        );

        this.state.scrolled = active;

    }

    /* ======================================================
       AUTO HIDE
    ====================================================== */

    handleVisibility(scrollY) {

        if (window.innerWidth <= 992) {

            this.lastScroll = scrollY;

            return;

        }

        if (

            scrollY >
            this.lastScroll + this.config.hideOffset

        ) {

            this.navbar.style.transform =
                "translateY(-140%)";

            this.state.hidden = true;

        }

        else if (

            scrollY <
            this.lastScroll - this.config.hideOffset

        ) {

            this.navbar.style.transform =
                "";

            this.state.hidden = false;

        }

        this.lastScroll = scrollY;

    }

    /* ======================================================
       MENU
    ====================================================== */

    toggleMenu() {

        this.state.open = !this.state.open;

        this.toggle.classList.toggle(
            "active",
            this.state.open
        );

        document
            .querySelector(".nav-links")
            ?.classList.toggle(
                "open",
                this.state.open
            );

    }

    closeMenu() {

        this.state.open = false;

        this.toggle?.classList.remove("active");

        document
            .querySelector(".nav-links")
            ?.classList.remove("open");

    }

    /* ======================================================
       NAVIGATION
    ====================================================== */

    navigate(event, link) {

        event.preventDefault();

        const target = document.querySelector(

            link.getAttribute("href")

        );

        if (!target) return;

        this.closeMenu();

        target.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

    /* ======================================================
       ACTIVE LINKS
    ====================================================== */

    observeSections() {

        const observer = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;

                    this.setActive(id);

                });

            },

            {

                threshold: .45

            }

        );

        this.sections.forEach(section => {

            observer.observe(section);

        });

    }

    setActive(id) {

        this.links.forEach(link => {

            const active =

                link.getAttribute("href") === `#${id}`;

            link.classList.toggle(

                "active",

                active

            );

        });

        this.state.activeLink = id;

    }

}