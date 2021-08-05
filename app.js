// Constants for the random BigInt generator
const lowerLimit = 2n ** 68n; // https://en.wikipedia.org/wiki/Collatz_conjecture (68)
const upperLimit = 2n ** 9000n; // (9000)
const difference = upperLimit - lowerLimit;
const diffLength = difference.toString().length;
const divisor = BigInt(`1${"0".repeat(diffLength)}`);

// Settings
const waitTime = 0;
const debugMode = false;

const sequence = [];
let sequenceCount;
let startValue;
let startDate;

start();

function start() {
    process.stdout.write("\033c"); // Clear the console. Does not work in strict mode.

    sequenceCount = 0;
    startValue = generateRandomBigInt();
    sequence.splice(0, sequence.length); // Empty the array
    
    if (debugMode) {
        sequence.push(startValue);
    }

    console.info(`Start value: ${startValue}`);

    startDate = new Date().getTime();
    collatz(startValue);
}

function collatz(n) {
    "use strict";

    const nextValue = n % 2n ? 3n * n + 1n : n / 2n;

    if (debugMode) {
        sequence.push(nextValue);
    }

    if (++sequenceCount >= Number.MAX_SAFE_INTEGER) {
        throw new Error("Odd, it seems that the sequence won't reach 1...");
    }

    if (nextValue === 1n) {
        console.info(`Reached 1 in ${sequenceCount} steps`);
        console.info(`Calculation took ${(new Date().getTime() - startDate) / 1000} seconds`);
        console.debug(debugMode ? sequence : "(Sequence only available in debug mode)");

        return setTimeout(start, 10000);
    }

    setTimeout(collatz.bind(null, nextValue), waitTime);
}

function generateRandomBigInt() {
    "use strict";

    let multiplier = "";
    while (multiplier.length < diffLength) {
        multiplier += Math.random().toString().split(".")[1];
    }
    multiplier = multiplier.slice(0, diffLength);
    const randomDiff = difference * BigInt(multiplier) / divisor;
    return lowerLimit + randomDiff;
}