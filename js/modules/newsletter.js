export default class Newsletter {
    constructor() {
        this.form = null;
        this.status = null;
    }

    init() {
        this.form = document.querySelector(".newsletter-form");
        this.status = document.querySelector("#newsletter-status");
        this.form?.addEventListener("submit", this.handleSubmit);
        this.form?.querySelector("button[type='submit']")?.removeAttribute("disabled");
    }

    handleSubmit = event => {
        event.preventDefault();
        if (!this.status) return;
        this.status.textContent =
            "Newsletter sign-up is not connected to a mailing service yet.";
        this.status.hidden = false;
    };

    destroy() {
        this.form?.removeEventListener("submit", this.handleSubmit);
    }
}
