'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _  _ 
 *  | _| _||_||_ |_   ||_||_|| |
 *  ||_  _|  | _||_|  ||_| _||_|

 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let arr = bankAccount.split('\n');
    let result = '';
    let tmp = '';
    let count = arr[0].length / 3;
    let zero = ' _ | ||_|';
    let one = '     |  |';
    let two = ' _  _||_ ';
    let three = ' _  _| _|';
    let four = '   |_|  |';
    let five = ' _ |_  _|';
    let six = ' _ |_ |_|';
    let seven = ' _   |  |';
    let eight = ' _ |_||_|';
    let nine = ' _ |_| _|';
    let digits = [zero, one, two, three, four, five, six, seven, eight, nine];
    for (let j = 0; j < count; j++) {
        for (let i = 0; i < 3; i++) {
            tmp += arr[i].slice(0, 3);
            arr[i] = arr[i].slice(3)
        }
        result += digits.indexOf(tmp);
        tmp = '';
    }
    return result;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let i;
    let result = '';
    while (text.length) {
        result = '';
        i = columns;
        if (text.length > columns) {
            while (text[i] !== ' ') {
                i--;
            }
        }
        result += text.slice(0, i);
        text = text.slice(i + 1);
        yield result;
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    let suits = hand.join('').split('').sort().join('').slice().slice(-5);
    let values = hand.join('').split('').sort().join('').slice(0, -5);
    if (isStraight(values) && isFlash(suits)) {
        return 8;
    }
    if (isFourOfKind(values)) {
        return 7;
    }
    if (isFullHouse(values)) {
        return 6;
    }
    if (isFlash(suits)) {
        return 5;
    }
    if (isStraight(values)) {
        return 4;
    }
    if (isThreeOfKind(values)) {
        return 3;
    }
    if (isTwoPairs(values)) {
        return 2;
    }
    if (isOnePairs(values)) {
        return 1;
    }
    return 0;
}

function isStraight(values) {
    if (values.match(/01AJKQ/)) {
        return true
    }
    if (values.match(/019JKQ/)) {
        return true
    }
    if (values.match(/0189JQ/)) {
        return true
    }
    if (values.match(/01789J/)) {
        return true
    }
    if (values.match(/016789/)) {
        return true
    }
    if (values.match(/2345A/)) {
        return true
    }
    let summ = values.split('').reduce((acc, curr) => +acc + +curr);
    if ((+values[0] + +values.slice(-1))/ 2 * 5 === summ) {
        return true;
    }
    return false;
}

function isFlash(suits) {
    if (suits[0] === suits.slice(-1)) {
        return true;
    }
    return false;
}

function isFourOfKind(values) {
    if (values[0] === values[3]) {
        return true;
    }
    if (values.slice(-1) === values.slice(-4, -3)) {
        return true;
    }
    return false;
}

function isFullHouse(values) {
    if (values[0] === values[1] && values.slice(-1) === values.slice(-2, -1)) {
        if (values.slice(-3, -2) === values.slice(-2, -1) || values[2] === values[1]) {
            return true;
        }
    }
    return false;
}

function isThreeOfKind(values) {
    if (values[0] === values[2] || values.slice(-1) === values.slice(-3, -2)) {
        return true;
    }
    return false;
}

function isTwoPairs(values) {
    values = values.replace(/1/g, '');
    if (values[0] === values[1] && values.slice(-1) === values.slice(-2, -1) ||
        values[1] === values[2] && values[4] === values[3] ||
        values[0] === values[1] && values[2] === values[3]) {
        return true;
    }
    return false;
}

function isOnePairs(values) {
    values = values.replace(/1/g, '');
    if (values[0] === values[1] ||
        values[1] === values[2] ||
        values[2] === values[3] ||
        values[3] === values[4]
      ) {
        return true;
    }
    return false;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
   let cartesian = figure.split('\n');
   cartesian.pop();
   let tL = []; //top-left corners of rectangles
   for (var i = 0; i < cartesian.length; i++) {
       for (var j = 0; j < cartesian[i].length; j++) {
           if (cartesian[i][j] === '+' && (cartesian[i][j + 1] === '-' || cartesian[i][j + 1] === '+')) {
                if (cartesian[i + 1] && (cartesian[i + 1][j] === '|' || cartesian[i + 1][j] === '+')) {
                    tL.push([i, j]);
                }
           }
       }
   }
   for (var i = 0; i < tL.length; i++) {
        let cornersCoord = [ [tL[i][0], tL[i][1]] ];
        cornersCoord.push(findTopRightCorner(cornersCoord[0][1], cornersCoord[0][0], cartesian));
        cornersCoord.push(findBottomLeftCorner(cornersCoord[0][1], cornersCoord[0][0], cartesian));
        if (cornersCoord.every((item) => !!item)) {
            yield '+' + '-'.repeat(cornersCoord[1][1] - cornersCoord[0][1] - 1) + '+\n' +
            ('|' + ' '.repeat(cornersCoord[1][1] - cornersCoord[0][1] - 1) + '|\n').repeat(cornersCoord[2][0] - cornersCoord[0][0] - 1) +
            '+' + '-'.repeat(cornersCoord[1][1] - cornersCoord[0][1] - 1) + '+\n';
        }
   }
   return;
}


function findTopRightCorner(x, y, cartesian) {
    while (cartesian[y][++x]) {
        if (cartesian[y][x] === '+') {
            if (cartesian[y + 1] && (cartesian[y + 1][x] === '|' || cartesian[y + 1][x] === '+')) {
                return [y, x];
            }
        }
    }
    return false;
}

function findBottomLeftCorner(x, y, cartesian) {
    while (cartesian[++y]) {
        if (cartesian[y] && cartesian[y][x] === '+') {
            if (cartesian[y][x + 1] === '-' || cartesian[y][x + 1] === '+') {
                return [y, x];
            }
        }
    }
    return false;
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
