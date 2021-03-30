
/**
 * Rounds a given floating point number to the specified number of decimals
 * @param value Initial numerical value to round
 * @param decimals Number of decimals
 * @returns Rounded number
 */
function round(value:number, decimals:number) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}


/**
 * Turns any number into a three-digit value with a magnitude suffix
 * @param value Initial float to convert
 * @returns String with exactly 3 digits and optional suffix
 */
function valMinify(value:number) {

    let suffix;

    // Suffixes and according sizes
    const suffixes = {
        0: {symbol: "", size: 1},
        k: {symbol: "k", size: 1000},
        M: {symbol: "M", size: 1000000},
        B: {symbol: "B", size: 1000000000}
    };

    // Get correct suffix object 
    if (value >= 1000000000) {
        suffix = suffixes.B
    } else if (value >= 1000000) {
        suffix = suffixes.M
    } else if (value >= 1000) {
        suffix = suffixes.k
    } else {
        suffix = suffixes[0]
    }

    // Move decimal point according to suffix
    const reducedValue = value / suffix.size;

    // Get the digit count left of the decimal point
    let reducedLength = String(Math.floor(reducedValue)).length;
    if (reducedLength > 3) {
        reducedLength = 3;
    }

    // Reduce to total of three digits
    const outputValue = round(reducedValue, 3 - reducedLength);

    return String(outputValue) + suffix.symbol;

}