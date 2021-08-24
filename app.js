// Constants for the random BigInt generator
const lowerLimit = 2n ** 68n; // https://en.wikipedia.org/wiki/Collatz_conjecture (68)
const upperLimit = 2n ** 90000n; // (90000)
const minLength = lowerLimit.toString().length;
const maxVariance = upperLimit.toString().length - minLength;

// Settings
const waitTime = 2000;
const debugMode = false;
const skipKnown = true;

const sequence = [];
let sequenceCount;
let startValue;
let startDate;

start();

function start() {
    "use strict";
    clearCmd();

    sequenceCount = 0;
    startValue = generateRandomBigInt();
    sequence.splice(0, sequence.length); // Empty the array
    
    if (debugMode) {
        sequence.push(startValue);
    }

    console.info(`Start value: ${startValue}`);

    startDate = new Date().getTime();
    let currentValue = startValue;
    while (true) {
        currentValue = currentValue % 2n ? 3n * currentValue + 1n : currentValue / 2n;

        if (debugMode) {
            sequence.push(currentValue);
        }

        if (skipKnown && currentValue <= lowerLimit) {
            console.info(`Step ${sequenceCount.toLocaleString("en-US")}: reached value that is known to reach 1`);
            console.info(`Calculation took ${((new Date().getTime() - startDate) / 1000).toLocaleString("en-US")} seconds`);
            console.debug(debugMode ? sequence : "(Sequence only available in debug mode)");

            if (!debugMode) {
                setTimeout(start, waitTime);
            }
            break;
        }

        if (++sequenceCount >= Number.MAX_SAFE_INTEGER) {
            throw new Error("Odd, it seems that the sequence won't reach 1...");
        }

        if (currentValue === 1n) {
            console.info(`Reached 1 in ${sequenceCount.toLocaleString("en-US")} steps`);
            console.info(`Calculation took ${((new Date().getTime() - startDate) / 1000).toLocaleString("en-US")} seconds`);
            console.debug(debugMode ? sequence : "(Sequence only available in debug mode)");
    
            if (!debugMode) {
                setTimeout(start, waitTime);
            }
            break;
        }
    }
}

function generateRandomBigInt() {
    "use strict";

    const variance = Math.floor(Math.random() * maxVariance);
    const resultLength = minLength + variance;

    let result = "";
    while (result.length < resultLength) {
        result += Math.random().toString().split(".")[1].replace("e-", "");
    }
    result = result.slice(0, resultLength);
    return BigInt(result);
}

/**
 * Clear the console. In separate function because does not work in strict mode
 */
function clearCmd() {
    process.stdout.write("\033c");
}