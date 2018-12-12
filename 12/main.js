const initial = `.##..#.#..##..##..##...#####.#.....#..#..##.###.#.####......#.......#..###.#.#.##.#.#.###...##.###.#`;

const input = `.##.# => #
##.#. => #
##... => #
#.... => .
.#..# => .
#.##. => .
.##.. => .
.#.## => .
###.. => .
..##. => #
##### => #
#...# => #
.#... => #
###.# => #
#.### => #
##..# => .
.###. => #
...## => .
..#.# => .
##.## => #
....# => .
#.#.# => #
#.#.. => .
.#### => .
...#. => #
..### => .
..#.. => #
..... => .
####. => .
#..## => #
.#.#. => .
#..#. => #`;

function day12(initialStateText, inputText, numGenerations) {
    let currentState = new Map();

    // Setup initial state
    initialStateText.split('')
    .map(ch => (ch === '#') ? true : false)
    .forEach((val, i) => {
        currentState.set(i, val);
    });

    // Setup rules
    let rulesForUpdate = new Map();
    inputText.split('\n')
    .map(line => {
        const args = line.split(' => ');
        return {
            rule: args[0],
            next: ((args[1] === '#') ? true : false)
        };
    })
    .forEach(rule => {
        rulesForUpdate.set(rule.rule, rule.next);
    });

    // Orders pots map by index
    function potsOrderedByIndex(pots) {
        const entries = [];
        for (const entry of pots)
            entries.push([entry[0], entry[1]]);
        entries.sort((a,b) => a[0] - b[0]);
        return entries;
    }

    function toString(pots) {
        return potsOrderedByIndex(pots).reduce((str,val) => {
                return str + (val[1] ? "#" : ".");
        }, "");
    }

    function firstPotWithPlant(pots) {
        return potsOrderedByIndex(pots).find(val => val[1] === true)[0];
    }

    // Determines key to lookup rule in `rules` for position `key`
    function buildNeighborString(pots, key) {
        let str = "";
        for (let offset = -2; offset <= 2; ++offset) {
            if (pots.has(key + offset))
                str += ((pots.get(key + offset)) ? '#' : '.');
            else
                str += '.';
        }
        return str;
    }

    let shiftedPerGeneration = 0;
    let stateHistory = [currentState];

    for (var currentGenerationIndex = 0; currentGenerationIndex < numGenerations; ++currentGenerationIndex) {
        // Copy current state
        let nextState = new Map();
        for (const entry of currentState) {
            nextState.set(entry[0], entry[1]);
        }

        // Update each pot
        let minIndex = 1000000, maxIndex = -1000000000;
        for (const key of currentState.keys()) {
            if (key < minIndex)
                minIndex = key;
            if (key > maxIndex)
                maxIndex = key;
            nextState.set(key, rulesForUpdate.get(buildNeighborString(currentState, key)));
        }

        // Add neighboring pots if needed
        for (let key of [minIndex - 2, minIndex - 1, maxIndex + 1, maxIndex + 2]) {
            if (buildNeighborString(currentState, key) !== '.....') {
                nextState.set(key, rulesForUpdate.get(buildNeighborString(currentState, key)));
            }
        }

        // Check to see if the pot state has become stable and is just shifting horizontally
        let indexOfFirstStableState = stateHistory.findIndex(gen => {
            return toString(gen).replace(/^\.+|\.+$/g,'') === toString(nextState).replace(/^\.+|\.+$/g,'');
        });

        currentState = nextState;
        stateHistory.push(currentState);

        if (indexOfFirstStableState > -1) {
            shiftedPerGeneration = firstPotWithPlant(currentState) - firstPotWithPlant(stateHistory[indexOfFirstStableState]);
            break;
        }

    }

    const generationsRemaining = (numGenerations - currentGenerationIndex - 1);
    let sumOfIndicesWithPlants = 0;
    for (const entry of currentState) {
        if (entry[1]) {
            sumOfIndicesWithPlants += entry[0] + shiftedPerGeneration * generationsRemaining;
        }
    }
    return sumOfIndicesWithPlants;
}

const sampleInitial = `#..#.#..##......###...###`;
const sampleInput = `...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`;

for (let gen of [20, 50000000000]) {
    console.log(day12(sampleInitial, sampleInput, gen));
    console.log(day12(initial, input, gen));
}