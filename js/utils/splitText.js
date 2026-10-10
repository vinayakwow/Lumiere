/**
 * ==========================================================
 * LUMIÈRE
 * Split Text Utility
 * ==========================================================
 */

export default function splitText(element) {

    if (!element) return;

    const text = element.textContent.trim();

    const words = text.split(" ");

    element.innerHTML = words
        .map(word =>
            `<span class="split-word">${word}</span>`
        )
        .join(" ");

}