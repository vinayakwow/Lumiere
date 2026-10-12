export default class Reservation {
    constructor(app) {
        this.app = app;
        this.events = app.events;
        this.state = app.state.reservation;
        this.form = null;
        this.status = null;
        this.inputs = [];
    }

    init() {
        this.form = document.querySelector(".booking-form");
        if (!this.form) return;

        this.status = document.querySelector("#reservation-status");
        this.inputs = [...this.form.querySelectorAll("input, textarea, select")];
        this.form.addEventListener("submit", this.handleSubmit);
        this.form.addEventListener("input", this.handleInput);
        this.form.querySelector("button[type='submit']")?.removeAttribute("disabled");
    }

    handleInput = event => {
        const input = event.target;
        if (!this.inputs.includes(input)) return;
        if (input.checkValidity()) input.removeAttribute("aria-invalid");
        if (this.status && !this.status.hidden) {
            this.status.hidden = true;
            this.status.textContent = "";
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        const invalid = this.inputs.find(input => !input.checkValidity());
        if (invalid) {
            invalid.setAttribute("aria-invalid", "true");
            invalid.focus();
            invalid.reportValidity?.();
            return;
        }

        this.state.submitting = false;
        this.state.success = false;
        if (this.status) {
            this.status.textContent =
                "Online reservations are not connected on this site yet. Please contact the restaurant directly to book.";
            this.status.hidden = false;
        }
        this.events.emit("reservation:unavailable");
    };

    destroy() {
        this.form?.removeEventListener("submit", this.handleSubmit);
        this.form?.removeEventListener("input", this.handleInput);
    }
}
