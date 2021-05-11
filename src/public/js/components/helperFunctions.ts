/**
 * Rounds a given floating point number to the specified number of decimals
 * @param value Initial numerical value to round
 * @param decimals Number of decimals
 * @returns Rounded number
 */
function round(value: number, decimals: number) {
    return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}


/**
 * Turns any number into a three-digit value with a magnitude suffix
 * @param value Initial float to convert
 * @returns String with exactly 3 digits and optional suffix
 */
function valMinify(value: number) {

    let suffix;

    // Suffixes and according sizes
    const suffixes = {
        0: {
            symbol: "",
            size: 1
        },
        k: {
            symbol: "k",
            size: 1000
        },
        M: {
            symbol: "M",
            size: 1000000
        },
        B: {
            symbol: "B",
            size: 1000000000
        }
    };

    // Get correct suffix object 
    if (value >= 1000000000) {
        suffix = suffixes.B;
    } else if (value >= 1000000) {
        suffix = suffixes.M;
    } else if (value >= 1000) {
        suffix = suffixes.k;
    } else {
        suffix = suffixes[0];
    }

    // Move decimal point according to suffix
    const reducedValue = value / suffix.size;

    // Get the digit count left of the decimal point
    let reducedLength = String(Math.floor(reducedValue)).length;
    if (reducedLength > 3) {
        reducedLength = 3;
    }

    // Reduce to total of three digits
    const outputValue = this.round(reducedValue, 3 - reducedLength);

    return String(outputValue) + suffix.symbol;

}


/**
 * Generates an array of random integers
 * @param min Lower bound
 * @param max Upper bound
 * @param count Number of elements
 * @param end Last value
 * @returns Array
 */
function randomSpark (min:number, max:number, count:number, end:number) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(d3.randomInt(min,max)());
    }
    data.push(end);
    return data;
}


/**
 * Returns the calling function or class from the backtrace stack
 * @param depth The backtrace depth, defaults to 1 (=> direct caller)
 * @returns Function or class name and file of the caller
 */
function getCaller(depth = 1, filename = true) {
    const stack = new Error().stack.split("\n");
    const caller = stack[depth + 1];
    const iStart = caller.search("/public/js/");
    const iEnd = caller.search(":[0-9]+:[0-9]+");
    const name = caller.split("@")[0];
    const file = caller.substr(iStart, iEnd);
    if (filename) {
        return name + "@" + file;
    }
    return name;
}


/**
 * Checks whether an object is empty
 * @param testObj The object to test
 * @returns Boolean
 */
function emptyObj(testObj:Record<string, unknown>) {
    // Return true if the var is not an object
    if (typeof(testObj) === "undefined" || testObj === null) {
        return true;
    }
    if (Object.keys(testObj).length === 0) {
        return true;
    } else {
        return false;
    }
}


/**
 * Calculates the cumulative sum of an array, call with arr.map(cumulativeSum(0))
 * @param array The initial array
 * @param field The filed to accumulate
 * @returns Array
 */
 async function cumulativeSum(array:any[], field = "val") {
    const values = array.map(d => d[field]);
    const sums = values.map((sum => value => sum += value)(0));
    const retArr = array.map((d, i) => {
        const val = {};
        val[field] = sums[i];
        const obj = Object.assign(d, val);
        return obj;
    });
    return retArr;
}

/**
 * Returns the sum of an array of objects
 * @param array The initial array
 * @param field The filed to accumulate
 * @returns Total sum
 */
async function objSum(array:any[], field = "val") {
    const values = array.map(d => d[field]);
    const reducer = (accumulator:number, currentValue:number) => accumulator + currentValue;
    const sum = await values.reduce(reducer);
    return sum;
}

export { round, valMinify, randomSpark, getCaller, emptyObj, cumulativeSum, objSum };