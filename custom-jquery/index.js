window.$ = function (selector) {
    return new MyQuery(selector);
}

class MyQuery {
    constructor(selector) {
        let findingNodes = Array.from(document.querySelectorAll(selector));
        for (let i = 0; i < findingNodes.length; i++) {
            this[i] = findingNodes[i];
        }
        this.length = findingNodes.length;
    }
    addClass(selector) {
        if (typeof selector === 'function') {
            for (let i = 0; i < this.length; i++) {
                let cssClass = selector(i, this[i].className);
                if (cssClass !== undefined) {
                    cssClass = cssClass.split(' ');
                    for (let j = 0; j < cssClass.length; j++) {
                        this[i].classList.add(cssClass[j]);
                    }
                }
            }
        } else if(typeof selector === 'string') {
            const cssClass = selector.split(' ');
            for (let i = 0; i < this.length; i++) {
                for (let j = 0; j < cssClass.length; j++) {
                    this[i].classList.add(cssClass[j]);
                }
            }
        }
        return this;
    }
    html(htmlStr) {
        if (!arguments.length) {
            return this[0].innerHTML;
        }
        for (let i = 0; i < this.length; i++) {
            this[i].innerHTML = htmlStr;
        }
        return this;
    }
    attr(attribute) {
        if (arguments.length === 1) {
            if (attribute === 'class') {
                return this[0].className;
            }
            return this[0].attribute;
        }
        for (let i = 0; i < this.length; i++) {
            this[i].setAttribute(attribute, arguments[1])
        }
        return this;
    }
    children(sel) {
        const childrens = this[0].children;
        if (!sel) {
            return childrens;
        }
        return Array.from(childrens).filter((item) => item.matches(sel));
    }
    css(styleStr) {
        if (typeof styleStr === 'string') {
            return this[0].style[styleStr];
        }
        for (let i = 0; i < this.length; i++) {
            for (let key in styleStr) {
                this[i].style[key] = styleStr[key];
            }
        }
        return this;
    }
    each(func) {
        for (let i = 0; i < this.length; i++) {
            if (func.call(this[i], i, this[i]) === false) {
                break;
            }
        }
        return this;
    }
    append(content) {
        if (typeof content === 'string') {
            const tag = content.match(/<\w{0,}>/)[0].slice(1, -1);
            const element = document.createElement(tag);
            const text = document.createTextNode(content.slice(2 + tag.length, -3 - tag.length));
            element.appendChild(text);
            for (let i = 0; i < this.length; i++) {
                let tmp = element.cloneNode(true);
                this[i].appendChild(tmp);
            }
        } else {
            for (let j = 0; j < this.length; j++) {
                let tmp = content.cloneNode(true);
                this[j].appendChild(tmp);
            }
        }
        return this;
    }
    data(key, value) {
        if (key && value) {
            for (var i = 0; i < this.length; i++) {
                this[i].dataset[key] = value;
            }
        }
        if (typeof key === 'string' && !value) {
            return this[0].dataset[key];
        }
        if (typeof key === 'object' && !value) {
            for (let prop in key) {
                for (let i = 0; i < this.length; i++) {
                    this[i].dataset[prop] = key[prop];
                }
            }
        }
        if (!key && !value) {
            return this[0]. dataset;
        }
        return this;
    }
    one(event, handler) {
        function trueHandler() {
            handler.apply(this);
            this.removeEventListener(event, trueHandler);
        }
        for (let i = 0; i < this.length; i++) {
                this[i].addEventListener(event, trueHandler);
            }
        return this;
    }
    on(event, selector, handler) {
        if (event && selector && !handler) {
            for (var i = 0; i < this.length; i++) {
                this[i].addEventListener(event, selector);
            }
        } else if (typeof event === 'string' && typeof selector === 'string' && typeof handler === 'function') {
            function trueHandler(e) {
                if (e.target.classList.contains(selector.slice(1))) {
                    handler.apply(this);
                }
                return;
            }
            this[0].addEventListener(event, trueHandler);
        }
        return this;
    }
}