/**
 * Embed given string as JavaScript in the user-DOM space.
 * @param fn
 */
export function embed(fn: (text: string) => void) {
    const script = document.createElement("script");
    script.text = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
}

/**
 * Convert the given HTML-string to a DOM-node.
 * @param html
 */
export function htmlToElement(html: string): ChildNode {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild as ChildNode;
}
