'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    var coordinats = [];
    for (var i = 0; i < puzzle.length; i++) {
        for (var j = 0; j < puzzle[i].length; j++) {
            if(puzzle[i][j] === searchStr[0]) {
                coordinats.push({
                    y: j,
                    x: i
                });
            }
        }
    }
    for (var i = 0; i < coordinats.length; i++) {
        var stack = [coordinats[i]];
        var firstHash = `${coordinats[i].x} ${coordinats[i].y}`;
        var mapCoordinat = {
            [firstHash]: true
        };
        while(stack.length) {
            if (stack.length === searchStr.length) {
                return true;
            }
            var lastChild = stack[stack.length - 1];
            if (!lastChild.right &&
                !mapCoordinat[`${lastChild.x + 1} ${lastChild.y}`] &&
                checkChild(puzzle, searchStr[stack.length], lastChild.x + 1, lastChild.y)) {
                lastChild.right = true;
                mapCoordinat[`${lastChild.x + 1} ${lastChild.y}`] = true;
                stack.push({
                    x: lastChild.x + 1,
                    y: lastChild.y
                });
                continue;
            }
            if (!lastChild.left &&
                !mapCoordinat[`${lastChild.x - 1} ${lastChild.y}`] &&
                checkChild(puzzle, searchStr[stack.length], lastChild.x - 1, lastChild.y)) {
                lastChild.left = true;
                mapCoordinat[`${lastChild.x - 1} ${lastChild.y}`] = true;
                stack.push({
                    x: lastChild.x - 1,
                    y: lastChild.y
                });
                continue;
            }
            if (!lastChild.bottom &&
                !mapCoordinat[`${lastChild.x} ${lastChild.y + 1}`] &&
                checkChild(puzzle, searchStr[stack.length], lastChild.x, lastChild.y + 1)) {
                lastChild.bottom = true;
                mapCoordinat[`${lastChild.x} ${lastChild.y + 1}`] = true;
                stack.push({
                    x: lastChild.x,
                    y: lastChild.y + 1
                });
                continue;
            }
            if (!lastChild.top &&
                !mapCoordinat[`${lastChild.x} ${lastChild.y - 1}`] &&
                checkChild(puzzle, searchStr[stack.length], lastChild.x, lastChild.y - 1)) {
                lastChild.top = true;
                mapCoordinat[`${lastChild.x} ${lastChild.y - 1}`] = true;
                stack.push({
                    x: lastChild.x,
                    y: lastChild.y - 1
                });
                continue;
            }
            stack.pop();
            mapCoordinat[`${lastChild.x} ${lastChild.y}`] = false;
        }
    }
    return false;
}

function checkChild(puzzle, nextLetter, x, y) {
    var row = puzzle[x];
    if(!row) {
        return false;
    }
    if(row[y] === nextLetter) {
            return true;
    }
    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    if (chars.length === 1) {
        yield chars;
    }
    if (chars.length > 1) {
        let radix = chars.length;
        let iterations = factor(radix);
        let counter = 0;
        for (var i = 0; i < iterations; i++) {
            let pattern = counter.toString(radix);
            if (pattern.length < radix) {
                pattern = '0' + pattern;
            }
            while (checkStrForRepeatinSymbols(pattern, radix)) {
                counter++;
                pattern = counter.toString(radix);
                if (pattern.length < radix) {
                    pattern = '0' + pattern;
                }
            }
            let result = '';
            for (var j = 0; j < pattern.length; j++) {
                result += chars[pattern[j]];
            }
            yield result;
            counter++;
        }
    }
}

function checkStrForRepeatinSymbols(str, radix) {
    if (str.length < radix) {
        return true;
    }
    let tmp = str.split('').sort().join('');
    for (var i = 0; i < tmp.length; i++) {
        if (tmp[i] == tmp[i + 1]) {
            return true;
        }
    }
    return false;
}

function factor(a) {
    if (a === 1) {
        return 1
    }
     return a * factor(a - 1);
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let result = 0;
    while (quotes.length !== 0) {
        let max = Math.max(...quotes);
        let index = quotes.indexOf(max);
        if (index === 0) {
            break;
        }
        let beforeMax = quotes.splice(0, index + 1);
        let summ = beforeMax.slice(0, -1).reduce((acc, curr) => acc + curr ,0);
        result =  result + (max * index - summ)
    }
    return result;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
        throw new Error('Not implemented');
    },

    decode: function(code) {
        throw new Error('Not implemented');
    },


}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};