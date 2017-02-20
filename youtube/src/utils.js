export const getStyle = (elem) => {
    return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
};

export const createElem = (tagName, text, ...classNames) => {
    const tmp = document.createElement(tagName);
    text = text || '';
    if (classNames) {
        tmp.classList.add(...classNames);
    }
    const textNode = document.createTextNode(text);
    tmp.appendChild(textNode);
    return tmp;
};