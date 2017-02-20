'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    sides[4] = 'N';
    let result = [];
    let tmp = [];
    for (let i = 0; i < 32; i++) {
        result[i] = {abbreviation : null, azimuth : 11.25 * i};
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 8; j++) {
            if (j === 0) {
                tmp.push(sides[i])
            }
            if (j === 1) {
                tmp.push(sides[i] + 'b'+ sides[i + 1])
            }
            if (j === 2) {
                if (sides[i] === 'N' || sides[i] === 'S') {
                    tmp.push(sides[i].repeat(2) + sides[i + 1])
                }
                if (sides[i] === 'W' || sides[i] === 'E') {
                    tmp.push(sides[i] + sides[i + 1] + sides[i])
                }
            }
            if (j === 3) {
                if (sides[i] === 'N' || sides[i] === 'S') {
                    tmp.push(sides[i] + sides[i + 1] + 'b' + sides[i])
                }
                if (sides[i] === 'W' || sides[i] === 'E') {
                    tmp.push(sides[i + 1] + sides[i] + 'b' + sides[i])
                }
            }
            if (j === 4) {
                if (sides[i] === 'N' || sides[i] === 'S') {
                    tmp.push(sides[i] + sides[i + 1])
                }
                if (sides[i] === 'W' || sides[i] === 'E') {
                    tmp.push(sides[i + 1] + sides[i])
                }
            }
            if (j === 5) {
                if (sides[i] === 'N' || sides[i] === 'S') {
                    tmp.push(sides[i] + sides[i + 1] + 'b' + sides[i + 1])
                }
                if (sides[i] === 'W' || sides[i] === 'E') {
                    tmp.push(sides[i + 1] + sides[i] + 'b' + sides[i + 1])
                }
            }
            if (j === 6) {
                if (sides[i] === 'N' || sides[i] === 'S') {
                    tmp.push(sides[i + 1] + sides[i] + sides[i + 1])
                }
                if (sides[i] === 'W' || sides[i] === 'E') {
                    tmp.push(sides[i + 1] + sides[i + 1] + sides[i])
                }
            }
            if (j === 7) {
                tmp.push(sides[i + 1] + 'b' + sides[i]);
            }
        }
    }
    for (var i = 0; i < result.length; i++) {
        result[i].abbreviation = tmp[i];
    }
    return result;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    throw new Error('Not implemented');
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    if (n === 1) {
        return [[0]];
    }
    var result = [];
    for (let i = 0; i < n; i++) {
        result[i] = Array.from(new Array(n))
    }
    var x = 0;
    var y = 0;
    var value = 0;
    for (let i = 0; i < n * 2 - 1; i++) {
        if (!(i & 1)) {
            if (i < n) {
                y = 0;
                x = i;
                while (x >= 0) {
                    result[x--][y++] = value++;
                }
            } else {
                x = n - 1;
                y = i - n + 1;
                while (y < n) {
                    result[x--][y++] = value++;
                }
            }
        } else {
            if (i < n) {
                y = i;
                x = 0;
                while (y >= 0) {
                    result[x++][y--] = value++;
                }
            } else {
                y = n - 1;
                x = i - n + 1;
                while (x < n) {
                    result[x++][y--] = value++;
                }
            }
        }
    }
    return result;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let doubleDomino = [];
    let tmp = dominoes.reduce((acc, curr) => {
        if (curr[0] === curr[1]) {
            doubleDomino.push(curr[0]);
            return acc;
        }
        return acc + curr + ',';
    },'')
    tmp =  tmp.slice(0, -1).split(',').sort().join('');
    if (doubleDomino.length) {
        for (var i = 0; i < doubleDomino.length; i++) {
            if (~tmp.indexOf(doubleDomino[i])) {
                doubleDomino.splice(i, 1);
                i--;
            }
        }
    }
    tmp = tmp.replace(/00|11|22|33|44|55|66/g, '');
    if (!doubleDomino.length) {
        if (tmp.length === 2 || tmp.length === 0) {
            return true;
        }
    }
    return false;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let tmp = {};
    let result = '';
    for (var i = 0; i < nums.length; i++) {
        let j = i;
        tmp[j] = {};
        tmp[i].start = nums[i];
        while (nums[i + 1] - nums[i] === 1) {
            i++
        }
        tmp[j].end = nums[i];
    }
    for (var key in tmp) {
        if (tmp[key].start === tmp[key].end) {
            result += tmp[key].start + ',';
            continue;
        }
        if (tmp[key].start === tmp[key].end - 1) {
            result += tmp[key].start + ',';
            result += tmp[key].end + ',';
            continue;
        }
        result += tmp[key].start + '-'+ tmp[key].end + ',';
    }
    return result.slice(0, -1);
}


module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
