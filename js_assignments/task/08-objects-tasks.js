'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype.getArea = function() {
    return this.height * this.width;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    let result = JSON.parse(json);
    result.__proto__ = proto;
    return result;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const cssSelectorBuilder = {

    element: function (value) {
        return new MyCSS().element(value);
    },

    id: function (value) {
        return new MyCSS().id(value);
    },

    class: function (value) {
        return new MyCSS().class(value);
    },

    attr: function (value) {
        return new MyCSS().attr(value);
    },

    pseudoClass: function (value) {
        return new MyCSS().pseudoClass(value);
    },

    pseudoElement: function (value) {
        return new MyCSS().pseudoElement(value);
    },

    combine: function (selector1, combinator, selector2) {
        return new MyCSS().combine(selector1, combinator, selector2);
    }
};

class MyCSS {
    constructor() {
        this._element = '';
        this._id = '';
        this._class = [];
        this._attr = [];
        this._pseudoClass = [];
        this._pseudoElement = '';
        this.errorForWrongOrder = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
        this.errorForDoubledSingleSelector = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    }
    element(value) {
        if ([this._id, this._class, this._attr, this._pseudoClass, this._pseudoElement].some((item) => !!item.length)) {
            throw new Error(this.errorForWrongOrder);
        }
        if (!this._element) {
            this._element = value;
        } else {
            throw new Error(this.errorForDoubledSingleSelector);
        }
        return this;
    }
    id(value) {
        if ([this._class, this._attr, this._pseudoClass, this._pseudoElement].some((item) => !!item.length)) {
            throw new Error(this.errorForWrongOrder);
        }
        if (!this._id) {
            this._id = value;
        } else {
            throw new Error(this.errorForDoubledSingleSelector);
        }
        return this;
    }
    class(value) {
        if ([this._attr, this._pseudoClass, this._pseudoElement].some((item) => !!item.length)) {
            throw new Error(this.errorForWrongOrder);
        }
        this._class.push(value);
        return this;
    }
    attr(value) {
        if ([this._pseudoClass, this._pseudoElement].some((item) => !!item.length)) {
            throw new Error(this.errorForWrongOrder);
        }
        this._attr.push(value);
        return this;
    }
    pseudoClass(value) {
        if ([this._pseudoElement].some((item) => !!item.length)) {
            throw new Error(this.errorForWrongOrder);
        }
        this._pseudoClass.push(value);
        return this;
    }
    pseudoElement(value) {
        if (!this._pseudoElement) {
            this._pseudoElement = value;
        } else {
            throw new Error(this.errorForDoubledSingleSelector);
        }
        return this;
    }
    stringify() {
        let result = '';
        if (this._element) {
            result += this._element;
        }
        if (this._id) {
            result += '#' + this._id;
        }
        if (this._class) {
            this._class.forEach((item) => result+= ('.' + item));
        }
        if (this._attr){
            this._attr.forEach((item) => result+= ('[' + item + ']'));
        }
        if (this._pseudoClass) {
            this._pseudoClass.forEach((item) => result+= (':' + item));
        }
        if (this._pseudoElement) {
            result = result + '::' + this._pseudoElement;
        }
        return result;
    }
    combine(selector1, combinator, selector2) {
            return {
                stringify: function() {
                    return selector1.stringify() + ' ' + combinator + ' ' + selector2.stringify();
                }
            }
        }
}


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};