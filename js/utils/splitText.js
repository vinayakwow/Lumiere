export default function splitText(element) {
    if (!element) return;

    const text = element.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;

    const fragment = document.createDocumentFragment();
    text.split(" ").forEach((word, index) => {
        if (index) fragment.append(document.createTextNode(" "));
        const span = document.createElement("span");
        span.className = "split-word";
        span.textContent = word;
        fragment.append(span);
    });

    element.replaceChildren(fragment);
}
