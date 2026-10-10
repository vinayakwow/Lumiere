/**
 * ==========================================================
 * LUMIÈRE
 * Reservation Engine
 * ==========================================================
 */

export default class Reservation {

    constructor(app) {

        this.app = app;

        this.events = app.events;
        this.state = app.state.reservation;

        this.form = null;

        this.submitButton = null;

        this.inputs = [];

        this.loading = false;

    }

    /* ======================================================
       INIT
    ====================================================== */

    init() {

        this.cacheDOM();

        if (!this.form) return;

        this.bindEvents();

    }

    /* ======================================================
       CACHE
    ====================================================== */

    cacheDOM() {

        this.form = document.querySelector(

            ".reservation form"

        );

        this.submitButton =

            this.form?.querySelector(

                "button[type='submit']"

            );

        this.inputs = [

            ...this.form.querySelectorAll(

                "input, textarea, select"

            )

        ];

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    bindEvents() {

        this.form.addEventListener(

            "submit",

            this.handleSubmit

        );

        this.inputs.forEach(input => {

            input.addEventListener(

                "input",

                () => this.validateField(input)

            );

        });

    }

    /* ======================================================
       SUBMIT
    ====================================================== */

    handleSubmit = async event => {

        event.preventDefault();

        if (this.loading) return;

        if (!this.validate()) return;

        this.loading = true;

        this.state.submitting = true;

        this.setLoading(true);

        this.events.emit(

            "reservation:submit:start"

        );

        try {

            await this.fakeRequest();

            this.success();

        }

        catch (error) {

            this.error(error);

        }

    }

    /* ======================================================
       VALIDATION
    ====================================================== */

    validate() {

        let valid = true;

        this.inputs.forEach(input => {

            if (!this.validateField(input)) {

                valid = false;

            }

        });

        return valid;

    }

    validateField(input) {

        if (

            input.hasAttribute("required") &&

            !input.value.trim()

        ) {

            input.classList.add(

                "invalid"

            );

            return false;

        }

        input.classList.remove(

            "invalid"

        );

        return true;

    }

    /* ======================================================
       REQUEST
    ====================================================== */

    async fakeRequest() {

        return new Promise(resolve => {

            setTimeout(

                resolve,

                1800

            );

        });

    }

    /* ======================================================
       SUCCESS
    ====================================================== */

    success() {

        this.loading = false;

        this.state.submitting = false;

        this.state.success = true;

        this.setLoading(false);

        this.form.reset();

        this.events.emit(

            "reservation:success"

        );

    }

    /* ======================================================
       ERROR
    ====================================================== */

    error(error) {

        console.error(error);

        this.loading = false;

        this.state.submitting = false;

        this.setLoading(false);

        this.events.emit(

            "reservation:error",

            {

                error

            }

        );

    }

    /* ======================================================
       BUTTON
    ====================================================== */

    setLoading(active) {

        if (!this.submitButton) return;

        this.submitButton.disabled =

            active;

        this.submitButton.textContent =

            active

                ? "Reserving..."

                : "Reserve Table";

    }

    /* ======================================================
       UPDATE
    ====================================================== */

    update() {

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        this.form?.removeEventListener(

            "submit",

            this.handleSubmit

        );

    }

}