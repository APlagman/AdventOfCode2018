const opcodeFuncsByName = new Map();

opcodeFuncsByName.set("addr", (registers, a, b, c) => registers[c] = registers[a] + registers[b]);
opcodeFuncsByName.set("addi", (registers, a, b, c) => registers[c] = registers[a] + b);

opcodeFuncsByName.set("mulr", (registers, a, b, c) => registers[c] = registers[a] * registers[b]);
opcodeFuncsByName.set("muli", (registers, a, b, c) => registers[c] = registers[a] * b);

opcodeFuncsByName.set("banr", (registers, a, b, c) => registers[c] = registers[a] & registers[b]);
opcodeFuncsByName.set("bani", (registers, a, b, c) => registers[c] = registers[a] & b);

opcodeFuncsByName.set("borr", (registers, a, b, c) => registers[c] = registers[a] | registers[b]);
opcodeFuncsByName.set("bori", (registers, a, b, c) => registers[c] = registers[a] | b);

opcodeFuncsByName.set("setr", (registers, a, b, c) => registers[c] = registers[a]);
opcodeFuncsByName.set("seti", (registers, a, b, c) => registers[c] = a);

opcodeFuncsByName.set("gtir", (registers, a, b, c) => registers[c] = (a > registers[b] ? 1 : 0));
opcodeFuncsByName.set("gtri", (registers, a, b, c) => registers[c] = (registers[a] > b ? 1 : 0));
opcodeFuncsByName.set("gtrr", (registers, a, b, c) => registers[c] = (registers[a] > registers[b] ? 1 : 0));

opcodeFuncsByName.set("eqir", (registers, a, b, c) => registers[c] = (a === registers[b] ? 1 : 0));
opcodeFuncsByName.set("eqri", (registers, a, b, c) => registers[c] = (registers[a] === b ? 1 : 0));
opcodeFuncsByName.set("eqrr", (registers, a, b, c) => registers[c] = (registers[a] === registers[b] ? 1 : 0));

function getPotentialOpcodes(registers, instruction, expected) {
    const opcode = instruction[0];
    const args = instruction.slice(1);
    let potentialOpcodes = new Set();
    opcodeFuncsByName.forEach((func, name) => {
        const result = Array.from(registers);
        func(result, args[0], args[1], args[2]);
        const numMatching = result.reduce((count, val, i) => count + (val === expected[i]), 0);
        if (numMatching === registers.length) {
            potentialOpcodes.add(name);
        }
    });
    return { code: opcode, names: potentialOpcodes };
}

function mapOpcodes(samplePotential) {
    let opcodeLookup = new Map();
    for (let i = 0; i < 16; ++i)
        opcodeLookup.set(i, new Set());
        
    // Use the sample data to collect potential names for each opcode number
    samplePotential.forEach(result => {
        result.lookup.names.forEach(name => {
            opcodeLookup.get(result.lookup.code).add(name);
        });
    });

    const namesDetermined = new Set();

    while (Array.from(opcodeLookup.values()).some(set => set.size !== 1)) {
        for (let [code, potential] of opcodeLookup.entries()) {
            // Assumes there is no guess-work required
            if (potential.size !== 1)
                continue;

            for (let name of potential) {
                if (namesDetermined.has(name))
                    continue;

                // Found an opcode with only 1 potential name that hasn't been seen yet

                // Mark said name as seen
                namesDetermined.add(name);

                // Ensure no other opcode considers said name anymore
                for (let [otherCode, otherPotential] of opcodeLookup.entries()) {
                    if (code !== otherCode)
                        otherPotential.delete(name);
                }
            }
        }
    }
    
    // Turn sets of single element into that element
    for (key of opcodeLookup.keys()) {
        opcodeLookup.set(key, Array.from(opcodeLookup.get(key))[0])
    }

    return opcodeLookup;
}

function day16(input, testProgram) {
    const samplePotential = input.map(sample => {
        return {
            sample: sample, // For debugging
            lookup: getPotentialOpcodes.apply(this, sample)
        };
    });
    const behaveLikeThreeOrMore = samplePotential.reduce((count, result) => {
        const matchesThree = (result.lookup.names.size >= 3);
        return count + matchesThree;
    }, 0);
    const registers = [0, 0, 0, 0];
    if (testProgram != null) {
        const opcodeLookup = mapOpcodes(samplePotential);

        testProgram.forEach(instruction => {
            const opcode = instruction[0];
            const args = instruction.slice(1);
            const func = opcodeFuncsByName.get(opcodeLookup.get(opcode));
            func(registers, args[0], args[1], args[2]);
        });
    }
    return [behaveLikeThreeOrMore, registers];
}

const sample = [[[3, 2, 1, 1], [9, 2, 1, 2], [3, 2, 2, 1]]];

let str = `Sample
${day16(sample)}`;

const then = Date.now();

const input = `Before: [0, 3, 0, 2]
13 0 0 3
After:  [0, 3, 0, 0]

Before: [0, 2, 2, 3]
4 1 3 0
After:  [0, 2, 2, 3]

Before: [0, 1, 3, 2]
6 1 3 3
After:  [0, 1, 3, 0]

Before: [2, 2, 1, 1]
0 2 3 0
After:  [2, 2, 1, 1]

Before: [2, 3, 2, 1]
12 3 2 0
After:  [1, 3, 2, 1]

Before: [3, 3, 2, 1]
12 3 2 1
After:  [3, 1, 2, 1]

Before: [1, 1, 2, 2]
10 0 2 3
After:  [1, 1, 2, 0]

Before: [3, 3, 2, 2]
7 2 1 2
After:  [3, 3, 1, 2]

Before: [3, 0, 2, 2]
1 0 3 1
After:  [3, 1, 2, 2]

Before: [1, 0, 2, 1]
10 0 2 3
After:  [1, 0, 2, 0]

Before: [0, 2, 3, 2]
9 0 2 0
After:  [0, 2, 3, 2]

Before: [2, 1, 0, 3]
3 3 1 3
After:  [2, 1, 0, 0]

Before: [0, 3, 2, 0]
13 0 0 1
After:  [0, 0, 2, 0]

Before: [0, 3, 0, 3]
13 0 0 1
After:  [0, 0, 0, 3]

Before: [1, 1, 2, 0]
10 0 2 3
After:  [1, 1, 2, 0]

Before: [1, 0, 2, 0]
10 0 2 1
After:  [1, 0, 2, 0]

Before: [3, 0, 2, 2]
1 0 3 2
After:  [3, 0, 1, 2]

Before: [1, 2, 1, 3]
4 2 3 3
After:  [1, 2, 1, 0]

Before: [0, 3, 1, 1]
13 0 0 1
After:  [0, 0, 1, 1]

Before: [2, 0, 1, 1]
1 0 2 0
After:  [1, 0, 1, 1]

Before: [3, 3, 2, 0]
7 2 1 0
After:  [1, 3, 2, 0]

Before: [2, 1, 2, 3]
15 1 2 3
After:  [2, 1, 2, 0]

Before: [2, 1, 2, 3]
4 2 3 0
After:  [0, 1, 2, 3]

Before: [0, 1, 2, 2]
5 3 2 1
After:  [0, 4, 2, 2]

Before: [3, 1, 2, 1]
11 0 2 1
After:  [3, 1, 2, 1]

Before: [0, 3, 0, 1]
9 0 3 1
After:  [0, 0, 0, 1]

Before: [1, 3, 1, 3]
0 2 0 1
After:  [1, 2, 1, 3]

Before: [0, 3, 3, 2]
2 3 3 2
After:  [0, 3, 0, 2]

Before: [1, 1, 3, 2]
2 3 3 0
After:  [0, 1, 3, 2]

Before: [3, 2, 2, 1]
12 3 2 1
After:  [3, 1, 2, 1]

Before: [1, 1, 1, 1]
0 2 0 2
After:  [1, 1, 2, 1]

Before: [1, 2, 2, 2]
5 2 2 1
After:  [1, 4, 2, 2]

Before: [2, 0, 3, 3]
8 1 0 0
After:  [0, 0, 3, 3]

Before: [1, 3, 2, 2]
10 0 2 3
After:  [1, 3, 2, 0]

Before: [1, 0, 1, 3]
0 2 0 3
After:  [1, 0, 1, 2]

Before: [1, 3, 0, 3]
14 0 2 1
After:  [1, 0, 0, 3]

Before: [0, 3, 2, 2]
2 3 3 3
After:  [0, 3, 2, 0]

Before: [1, 2, 2, 0]
5 2 2 3
After:  [1, 2, 2, 4]

Before: [0, 1, 1, 0]
9 0 1 0
After:  [0, 1, 1, 0]

Before: [3, 0, 1, 1]
8 1 0 0
After:  [0, 0, 1, 1]

Before: [2, 1, 2, 1]
12 3 2 2
After:  [2, 1, 1, 1]

Before: [0, 1, 2, 3]
15 1 2 2
After:  [0, 1, 0, 3]

Before: [3, 1, 2, 1]
15 1 2 0
After:  [0, 1, 2, 1]

Before: [2, 0, 0, 1]
8 1 0 1
After:  [2, 0, 0, 1]

Before: [3, 1, 3, 1]
3 2 1 3
After:  [3, 1, 3, 0]

Before: [1, 0, 2, 0]
3 2 2 1
After:  [1, 1, 2, 0]

Before: [2, 1, 2, 1]
12 3 2 0
After:  [1, 1, 2, 1]

Before: [2, 3, 2, 3]
3 3 2 3
After:  [2, 3, 2, 0]

Before: [3, 1, 2, 1]
5 2 2 3
After:  [3, 1, 2, 4]

Before: [2, 0, 1, 1]
0 2 3 1
After:  [2, 2, 1, 1]

Before: [1, 2, 2, 0]
10 0 2 0
After:  [0, 2, 2, 0]

Before: [0, 3, 1, 3]
13 0 0 2
After:  [0, 3, 0, 3]

Before: [3, 1, 2, 0]
15 1 2 3
After:  [3, 1, 2, 0]

Before: [3, 3, 1, 1]
0 2 3 2
After:  [3, 3, 2, 1]

Before: [2, 3, 2, 1]
12 3 2 1
After:  [2, 1, 2, 1]

Before: [2, 1, 0, 2]
2 3 3 0
After:  [0, 1, 0, 2]

Before: [2, 2, 2, 3]
3 2 1 2
After:  [2, 2, 1, 3]

Before: [2, 3, 1, 1]
7 0 1 3
After:  [2, 3, 1, 1]

Before: [3, 0, 1, 1]
0 2 3 2
After:  [3, 0, 2, 1]

Before: [1, 3, 2, 0]
5 2 2 2
After:  [1, 3, 4, 0]

Before: [3, 0, 0, 1]
8 2 0 1
After:  [3, 0, 0, 1]

Before: [1, 2, 0, 3]
14 0 2 0
After:  [0, 2, 0, 3]

Before: [0, 0, 2, 1]
12 3 2 2
After:  [0, 0, 1, 1]

Before: [0, 3, 0, 3]
9 0 3 1
After:  [0, 0, 0, 3]

Before: [1, 2, 0, 0]
14 0 2 3
After:  [1, 2, 0, 0]

Before: [3, 1, 2, 1]
12 3 2 0
After:  [1, 1, 2, 1]

Before: [3, 0, 2, 0]
11 0 2 3
After:  [3, 0, 2, 1]

Before: [0, 0, 2, 2]
13 0 0 3
After:  [0, 0, 2, 0]

Before: [2, 3, 1, 3]
7 0 1 1
After:  [2, 1, 1, 3]

Before: [2, 1, 3, 3]
4 1 3 2
After:  [2, 1, 0, 3]

Before: [3, 3, 0, 1]
2 3 3 1
After:  [3, 0, 0, 1]

Before: [0, 1, 2, 1]
9 0 1 0
After:  [0, 1, 2, 1]

Before: [3, 0, 2, 1]
12 3 2 3
After:  [3, 0, 2, 1]

Before: [1, 2, 0, 0]
14 0 2 1
After:  [1, 0, 0, 0]

Before: [3, 1, 3, 2]
6 1 3 3
After:  [3, 1, 3, 0]

Before: [1, 1, 1, 1]
0 2 3 1
After:  [1, 2, 1, 1]

Before: [1, 0, 2, 1]
2 3 3 3
After:  [1, 0, 2, 0]

Before: [0, 0, 3, 2]
2 3 3 0
After:  [0, 0, 3, 2]

Before: [1, 1, 2, 3]
10 0 2 3
After:  [1, 1, 2, 0]

Before: [3, 2, 1, 1]
0 2 3 3
After:  [3, 2, 1, 2]

Before: [1, 2, 2, 3]
10 0 2 1
After:  [1, 0, 2, 3]

Before: [1, 1, 2, 3]
15 1 2 0
After:  [0, 1, 2, 3]

Before: [2, 0, 2, 1]
12 3 2 2
After:  [2, 0, 1, 1]

Before: [3, 2, 2, 2]
1 0 3 3
After:  [3, 2, 2, 1]

Before: [3, 0, 0, 1]
8 1 0 2
After:  [3, 0, 0, 1]

Before: [0, 0, 1, 1]
13 0 0 0
After:  [0, 0, 1, 1]

Before: [3, 2, 2, 0]
11 0 2 3
After:  [3, 2, 2, 1]

Before: [3, 1, 2, 1]
15 1 2 1
After:  [3, 0, 2, 1]

Before: [1, 0, 0, 3]
14 0 2 3
After:  [1, 0, 0, 0]

Before: [0, 3, 2, 1]
12 3 2 3
After:  [0, 3, 2, 1]

Before: [0, 3, 0, 2]
2 3 3 2
After:  [0, 3, 0, 2]

Before: [1, 2, 2, 0]
10 0 2 1
After:  [1, 0, 2, 0]

Before: [1, 1, 0, 1]
14 0 2 0
After:  [0, 1, 0, 1]

Before: [2, 3, 3, 3]
7 0 1 1
After:  [2, 1, 3, 3]

Before: [3, 2, 2, 3]
4 1 3 3
After:  [3, 2, 2, 0]

Before: [2, 3, 0, 3]
7 0 1 2
After:  [2, 3, 1, 3]

Before: [2, 2, 2, 1]
12 3 2 1
After:  [2, 1, 2, 1]

Before: [0, 1, 1, 1]
9 0 2 0
After:  [0, 1, 1, 1]

Before: [3, 0, 3, 2]
1 0 3 1
After:  [3, 1, 3, 2]

Before: [2, 3, 1, 0]
1 0 2 2
After:  [2, 3, 1, 0]

Before: [2, 0, 2, 1]
3 2 0 1
After:  [2, 1, 2, 1]

Before: [1, 3, 2, 2]
10 0 2 0
After:  [0, 3, 2, 2]

Before: [2, 0, 2, 3]
8 1 0 1
After:  [2, 0, 2, 3]

Before: [2, 3, 3, 0]
7 0 1 3
After:  [2, 3, 3, 1]

Before: [3, 2, 0, 3]
8 2 0 2
After:  [3, 2, 0, 3]

Before: [1, 3, 2, 3]
10 0 2 3
After:  [1, 3, 2, 0]

Before: [0, 1, 0, 3]
4 1 3 1
After:  [0, 0, 0, 3]

Before: [2, 3, 1, 1]
1 0 2 1
After:  [2, 1, 1, 1]

Before: [2, 0, 1, 1]
0 2 3 3
After:  [2, 0, 1, 2]

Before: [3, 1, 2, 1]
11 0 2 2
After:  [3, 1, 1, 1]

Before: [3, 1, 2, 3]
11 0 2 0
After:  [1, 1, 2, 3]

Before: [3, 1, 2, 0]
7 2 0 0
After:  [1, 1, 2, 0]

Before: [2, 0, 2, 2]
5 0 2 1
After:  [2, 4, 2, 2]

Before: [3, 1, 2, 3]
15 1 2 3
After:  [3, 1, 2, 0]

Before: [0, 0, 2, 2]
9 0 3 1
After:  [0, 0, 2, 2]

Before: [2, 1, 0, 3]
11 0 1 0
After:  [1, 1, 0, 3]

Before: [1, 1, 2, 0]
15 1 2 1
After:  [1, 0, 2, 0]

Before: [1, 1, 0, 0]
14 0 2 1
After:  [1, 0, 0, 0]

Before: [3, 1, 0, 1]
2 3 3 2
After:  [3, 1, 0, 1]

Before: [3, 2, 2, 3]
4 1 3 2
After:  [3, 2, 0, 3]

Before: [0, 1, 1, 2]
6 1 3 2
After:  [0, 1, 0, 2]

Before: [0, 2, 2, 2]
13 0 0 0
After:  [0, 2, 2, 2]

Before: [1, 3, 3, 1]
2 3 3 2
After:  [1, 3, 0, 1]

Before: [0, 1, 1, 1]
0 2 3 3
After:  [0, 1, 1, 2]

Before: [2, 1, 2, 1]
15 1 2 1
After:  [2, 0, 2, 1]

Before: [2, 1, 2, 1]
3 2 0 0
After:  [1, 1, 2, 1]

Before: [0, 0, 1, 1]
9 0 3 0
After:  [0, 0, 1, 1]

Before: [1, 1, 2, 2]
6 1 3 1
After:  [1, 0, 2, 2]

Before: [2, 3, 3, 2]
7 0 1 0
After:  [1, 3, 3, 2]

Before: [2, 0, 2, 3]
8 1 0 3
After:  [2, 0, 2, 0]

Before: [1, 0, 0, 2]
14 0 2 3
After:  [1, 0, 0, 0]

Before: [1, 2, 2, 3]
4 2 3 1
After:  [1, 0, 2, 3]

Before: [1, 0, 3, 2]
2 3 3 3
After:  [1, 0, 3, 0]

Before: [2, 1, 1, 0]
1 0 2 1
After:  [2, 1, 1, 0]

Before: [0, 2, 1, 3]
4 2 3 1
After:  [0, 0, 1, 3]

Before: [0, 3, 2, 2]
5 2 2 1
After:  [0, 4, 2, 2]

Before: [2, 1, 3, 1]
3 2 3 1
After:  [2, 0, 3, 1]

Before: [2, 0, 2, 2]
8 1 0 0
After:  [0, 0, 2, 2]

Before: [2, 3, 3, 0]
7 0 1 0
After:  [1, 3, 3, 0]

Before: [0, 1, 2, 2]
13 0 0 3
After:  [0, 1, 2, 0]

Before: [2, 1, 1, 1]
11 0 1 3
After:  [2, 1, 1, 1]

Before: [1, 1, 0, 2]
14 0 2 0
After:  [0, 1, 0, 2]

Before: [1, 1, 0, 2]
14 0 2 2
After:  [1, 1, 0, 2]

Before: [3, 0, 1, 1]
8 1 0 1
After:  [3, 0, 1, 1]

Before: [1, 0, 0, 1]
14 0 2 1
After:  [1, 0, 0, 1]

Before: [3, 1, 3, 2]
6 1 3 2
After:  [3, 1, 0, 2]

Before: [2, 3, 1, 3]
1 0 2 0
After:  [1, 3, 1, 3]

Before: [3, 2, 3, 2]
1 0 3 2
After:  [3, 2, 1, 2]

Before: [1, 0, 2, 2]
10 0 2 0
After:  [0, 0, 2, 2]

Before: [1, 3, 1, 3]
0 2 0 0
After:  [2, 3, 1, 3]

Before: [3, 0, 0, 1]
8 1 0 0
After:  [0, 0, 0, 1]

Before: [0, 1, 2, 3]
13 0 0 0
After:  [0, 1, 2, 3]

Before: [0, 0, 2, 0]
13 0 0 0
After:  [0, 0, 2, 0]

Before: [0, 0, 2, 1]
9 0 2 0
After:  [0, 0, 2, 1]

Before: [1, 3, 2, 1]
10 0 2 3
After:  [1, 3, 2, 0]

Before: [3, 1, 2, 2]
15 1 2 2
After:  [3, 1, 0, 2]

Before: [0, 1, 3, 3]
9 0 3 3
After:  [0, 1, 3, 0]

Before: [3, 3, 2, 1]
12 3 2 0
After:  [1, 3, 2, 1]

Before: [0, 0, 1, 1]
0 2 3 3
After:  [0, 0, 1, 2]

Before: [2, 0, 2, 3]
4 2 3 0
After:  [0, 0, 2, 3]

Before: [0, 0, 1, 1]
13 0 0 1
After:  [0, 0, 1, 1]

Before: [2, 2, 0, 3]
3 3 3 3
After:  [2, 2, 0, 1]

Before: [2, 3, 1, 3]
1 0 2 3
After:  [2, 3, 1, 1]

Before: [1, 2, 2, 2]
10 0 2 3
After:  [1, 2, 2, 0]

Before: [0, 1, 0, 3]
13 0 0 1
After:  [0, 0, 0, 3]

Before: [2, 3, 2, 0]
7 2 1 2
After:  [2, 3, 1, 0]

Before: [3, 1, 2, 2]
5 3 2 3
After:  [3, 1, 2, 4]

Before: [1, 1, 2, 1]
10 0 2 0
After:  [0, 1, 2, 1]

Before: [1, 2, 2, 1]
12 3 2 1
After:  [1, 1, 2, 1]

Before: [0, 2, 2, 1]
12 3 2 3
After:  [0, 2, 2, 1]

Before: [0, 3, 1, 3]
9 0 2 0
After:  [0, 3, 1, 3]

Before: [2, 2, 1, 3]
4 2 3 2
After:  [2, 2, 0, 3]

Before: [2, 1, 1, 1]
2 2 3 3
After:  [2, 1, 1, 0]

Before: [3, 2, 2, 3]
7 2 0 0
After:  [1, 2, 2, 3]

Before: [1, 1, 1, 3]
3 3 2 2
After:  [1, 1, 0, 3]

Before: [0, 1, 1, 0]
13 0 0 1
After:  [0, 0, 1, 0]

Before: [0, 3, 2, 3]
3 3 3 2
After:  [0, 3, 1, 3]

Before: [0, 0, 2, 2]
9 0 2 1
After:  [0, 0, 2, 2]

Before: [1, 3, 2, 2]
10 0 2 2
After:  [1, 3, 0, 2]

Before: [2, 1, 2, 0]
15 1 2 0
After:  [0, 1, 2, 0]

Before: [2, 1, 0, 2]
11 0 1 0
After:  [1, 1, 0, 2]

Before: [0, 2, 2, 2]
5 3 2 3
After:  [0, 2, 2, 4]

Before: [3, 3, 2, 2]
7 2 0 0
After:  [1, 3, 2, 2]

Before: [2, 1, 2, 1]
12 3 2 1
After:  [2, 1, 2, 1]

Before: [1, 2, 2, 3]
3 2 2 1
After:  [1, 1, 2, 3]

Before: [1, 3, 2, 3]
7 2 1 0
After:  [1, 3, 2, 3]

Before: [2, 1, 2, 0]
15 1 2 2
After:  [2, 1, 0, 0]

Before: [3, 2, 1, 3]
4 1 3 1
After:  [3, 0, 1, 3]

Before: [1, 1, 2, 1]
12 3 2 1
After:  [1, 1, 2, 1]

Before: [3, 2, 2, 2]
5 2 2 2
After:  [3, 2, 4, 2]

Before: [0, 0, 2, 1]
12 3 2 3
After:  [0, 0, 2, 1]

Before: [2, 1, 2, 2]
11 0 1 1
After:  [2, 1, 2, 2]

Before: [1, 2, 2, 0]
5 1 2 2
After:  [1, 2, 4, 0]

Before: [0, 2, 2, 1]
12 3 2 0
After:  [1, 2, 2, 1]

Before: [1, 0, 2, 1]
10 0 2 0
After:  [0, 0, 2, 1]

Before: [0, 1, 1, 3]
4 2 3 1
After:  [0, 0, 1, 3]

Before: [0, 1, 1, 2]
6 1 3 0
After:  [0, 1, 1, 2]

Before: [0, 2, 3, 2]
13 0 0 3
After:  [0, 2, 3, 0]

Before: [1, 1, 1, 1]
0 2 3 2
After:  [1, 1, 2, 1]

Before: [2, 1, 2, 2]
5 3 2 3
After:  [2, 1, 2, 4]

Before: [3, 1, 3, 3]
3 3 0 3
After:  [3, 1, 3, 1]

Before: [1, 0, 2, 1]
12 3 2 1
After:  [1, 1, 2, 1]

Before: [1, 0, 2, 2]
10 0 2 3
After:  [1, 0, 2, 0]

Before: [3, 2, 0, 2]
1 0 3 0
After:  [1, 2, 0, 2]

Before: [0, 1, 3, 2]
9 0 3 1
After:  [0, 0, 3, 2]

Before: [3, 1, 3, 3]
3 3 3 3
After:  [3, 1, 3, 1]

Before: [1, 2, 3, 3]
4 1 3 0
After:  [0, 2, 3, 3]

Before: [1, 0, 0, 2]
14 0 2 0
After:  [0, 0, 0, 2]

Before: [0, 1, 3, 3]
4 1 3 0
After:  [0, 1, 3, 3]

Before: [0, 2, 2, 3]
5 2 2 3
After:  [0, 2, 2, 4]

Before: [1, 1, 1, 1]
0 2 0 3
After:  [1, 1, 1, 2]

Before: [1, 1, 2, 1]
10 0 2 2
After:  [1, 1, 0, 1]

Before: [1, 3, 0, 0]
14 0 2 3
After:  [1, 3, 0, 0]

Before: [3, 3, 2, 1]
7 2 0 2
After:  [3, 3, 1, 1]

Before: [2, 1, 3, 1]
11 0 1 0
After:  [1, 1, 3, 1]

Before: [2, 1, 2, 3]
3 3 3 2
After:  [2, 1, 1, 3]

Before: [2, 3, 2, 2]
5 3 2 3
After:  [2, 3, 2, 4]

Before: [3, 3, 0, 3]
8 2 0 3
After:  [3, 3, 0, 0]

Before: [3, 1, 3, 3]
4 1 3 1
After:  [3, 0, 3, 3]

Before: [3, 1, 0, 2]
1 0 3 3
After:  [3, 1, 0, 1]

Before: [2, 0, 1, 2]
8 1 0 3
After:  [2, 0, 1, 0]

Before: [2, 3, 2, 1]
12 3 2 2
After:  [2, 3, 1, 1]

Before: [2, 1, 2, 1]
12 3 2 3
After:  [2, 1, 2, 1]

Before: [2, 2, 2, 3]
5 1 2 2
After:  [2, 2, 4, 3]

Before: [1, 3, 1, 2]
0 2 0 0
After:  [2, 3, 1, 2]

Before: [1, 1, 0, 1]
14 0 2 2
After:  [1, 1, 0, 1]

Before: [0, 1, 1, 3]
4 2 3 3
After:  [0, 1, 1, 0]

Before: [1, 2, 1, 1]
0 2 3 0
After:  [2, 2, 1, 1]

Before: [2, 1, 2, 3]
11 0 1 1
After:  [2, 1, 2, 3]

Before: [1, 1, 1, 0]
0 2 0 2
After:  [1, 1, 2, 0]

Before: [3, 3, 2, 2]
7 2 1 0
After:  [1, 3, 2, 2]

Before: [1, 1, 2, 3]
10 0 2 2
After:  [1, 1, 0, 3]

Before: [0, 0, 3, 3]
9 0 3 0
After:  [0, 0, 3, 3]

Before: [2, 0, 2, 1]
12 3 2 0
After:  [1, 0, 2, 1]

Before: [0, 3, 2, 2]
13 0 0 2
After:  [0, 3, 0, 2]

Before: [0, 1, 3, 2]
2 3 3 1
After:  [0, 0, 3, 2]

Before: [2, 0, 1, 1]
2 2 3 1
After:  [2, 0, 1, 1]

Before: [1, 1, 2, 1]
10 0 2 1
After:  [1, 0, 2, 1]

Before: [2, 3, 3, 1]
7 0 1 0
After:  [1, 3, 3, 1]

Before: [1, 1, 2, 0]
15 1 2 2
After:  [1, 1, 0, 0]

Before: [0, 1, 3, 2]
6 1 3 0
After:  [0, 1, 3, 2]

Before: [2, 3, 1, 0]
1 0 2 3
After:  [2, 3, 1, 1]

Before: [1, 2, 0, 1]
2 3 3 2
After:  [1, 2, 0, 1]

Before: [0, 3, 0, 3]
3 3 3 2
After:  [0, 3, 1, 3]

Before: [1, 1, 1, 2]
0 2 0 0
After:  [2, 1, 1, 2]

Before: [0, 2, 1, 1]
0 2 3 1
After:  [0, 2, 1, 1]

Before: [2, 1, 1, 1]
0 2 3 1
After:  [2, 2, 1, 1]

Before: [1, 1, 0, 3]
14 0 2 2
After:  [1, 1, 0, 3]

Before: [0, 0, 0, 3]
13 0 0 0
After:  [0, 0, 0, 3]

Before: [2, 2, 2, 1]
12 3 2 2
After:  [2, 2, 1, 1]

Before: [0, 2, 1, 1]
9 0 1 0
After:  [0, 2, 1, 1]

Before: [0, 2, 3, 3]
9 0 2 0
After:  [0, 2, 3, 3]

Before: [3, 3, 0, 3]
8 2 0 1
After:  [3, 0, 0, 3]

Before: [3, 2, 1, 2]
1 0 3 0
After:  [1, 2, 1, 2]

Before: [0, 3, 1, 2]
9 0 2 1
After:  [0, 0, 1, 2]

Before: [2, 2, 2, 2]
5 0 2 3
After:  [2, 2, 2, 4]

Before: [0, 2, 0, 2]
9 0 1 1
After:  [0, 0, 0, 2]

Before: [0, 0, 2, 2]
5 3 2 2
After:  [0, 0, 4, 2]

Before: [0, 1, 2, 3]
4 2 3 2
After:  [0, 1, 0, 3]

Before: [1, 3, 1, 0]
0 2 0 2
After:  [1, 3, 2, 0]

Before: [2, 2, 2, 0]
5 1 2 2
After:  [2, 2, 4, 0]

Before: [1, 3, 2, 2]
10 0 2 1
After:  [1, 0, 2, 2]

Before: [3, 0, 2, 1]
11 0 2 0
After:  [1, 0, 2, 1]

Before: [3, 1, 3, 1]
3 2 1 2
After:  [3, 1, 0, 1]

Before: [3, 3, 0, 2]
1 0 3 1
After:  [3, 1, 0, 2]

Before: [1, 3, 1, 2]
2 3 3 0
After:  [0, 3, 1, 2]

Before: [1, 2, 2, 1]
10 0 2 0
After:  [0, 2, 2, 1]

Before: [1, 2, 1, 0]
0 2 0 3
After:  [1, 2, 1, 2]

Before: [3, 0, 2, 1]
8 1 0 1
After:  [3, 0, 2, 1]

Before: [0, 0, 0, 3]
13 0 0 2
After:  [0, 0, 0, 3]

Before: [1, 2, 0, 1]
2 3 3 3
After:  [1, 2, 0, 0]

Before: [1, 2, 1, 1]
0 2 3 1
After:  [1, 2, 1, 1]

Before: [0, 2, 2, 2]
13 0 0 1
After:  [0, 0, 2, 2]

Before: [3, 3, 0, 1]
8 2 0 1
After:  [3, 0, 0, 1]

Before: [2, 3, 2, 3]
5 2 2 1
After:  [2, 4, 2, 3]

Before: [3, 1, 0, 0]
8 2 0 2
After:  [3, 1, 0, 0]

Before: [2, 1, 3, 2]
6 1 3 1
After:  [2, 0, 3, 2]

Before: [1, 1, 1, 3]
0 2 0 1
After:  [1, 2, 1, 3]

Before: [0, 0, 3, 1]
13 0 0 0
After:  [0, 0, 3, 1]

Before: [2, 1, 2, 2]
5 0 2 0
After:  [4, 1, 2, 2]

Before: [3, 3, 0, 2]
8 2 0 3
After:  [3, 3, 0, 0]

Before: [2, 3, 3, 3]
7 0 1 0
After:  [1, 3, 3, 3]

Before: [1, 2, 2, 1]
10 0 2 2
After:  [1, 2, 0, 1]

Before: [2, 1, 2, 2]
6 1 3 0
After:  [0, 1, 2, 2]

Before: [2, 3, 2, 2]
7 0 1 0
After:  [1, 3, 2, 2]

Before: [0, 1, 2, 2]
15 1 2 1
After:  [0, 0, 2, 2]

Before: [3, 1, 1, 2]
1 0 3 1
After:  [3, 1, 1, 2]

Before: [3, 1, 2, 3]
4 1 3 2
After:  [3, 1, 0, 3]

Before: [1, 1, 1, 3]
0 2 0 0
After:  [2, 1, 1, 3]

Before: [3, 2, 2, 2]
11 0 2 0
After:  [1, 2, 2, 2]

Before: [3, 3, 3, 2]
1 0 3 1
After:  [3, 1, 3, 2]

Before: [0, 1, 2, 1]
9 0 2 1
After:  [0, 0, 2, 1]

Before: [1, 2, 0, 2]
14 0 2 3
After:  [1, 2, 0, 0]

Before: [3, 2, 1, 1]
0 2 3 0
After:  [2, 2, 1, 1]

Before: [3, 3, 0, 2]
8 2 0 0
After:  [0, 3, 0, 2]

Before: [0, 1, 3, 3]
9 0 1 1
After:  [0, 0, 3, 3]

Before: [1, 1, 2, 3]
4 1 3 1
After:  [1, 0, 2, 3]

Before: [1, 1, 2, 1]
15 1 2 2
After:  [1, 1, 0, 1]

Before: [0, 1, 1, 2]
6 1 3 3
After:  [0, 1, 1, 0]

Before: [0, 2, 1, 0]
13 0 0 1
After:  [0, 0, 1, 0]

Before: [1, 0, 1, 1]
0 2 0 2
After:  [1, 0, 2, 1]

Before: [0, 2, 1, 3]
13 0 0 2
After:  [0, 2, 0, 3]

Before: [0, 2, 2, 0]
13 0 0 2
After:  [0, 2, 0, 0]

Before: [0, 3, 0, 1]
9 0 1 2
After:  [0, 3, 0, 1]

Before: [3, 1, 1, 2]
6 1 3 1
After:  [3, 0, 1, 2]

Before: [0, 2, 2, 3]
9 0 1 2
After:  [0, 2, 0, 3]

Before: [0, 2, 0, 3]
9 0 1 2
After:  [0, 2, 0, 3]

Before: [2, 1, 3, 2]
6 1 3 3
After:  [2, 1, 3, 0]

Before: [1, 0, 1, 3]
4 2 3 1
After:  [1, 0, 1, 3]

Before: [1, 2, 2, 3]
10 0 2 3
After:  [1, 2, 2, 0]

Before: [0, 3, 2, 1]
12 3 2 0
After:  [1, 3, 2, 1]

Before: [0, 0, 2, 2]
13 0 0 2
After:  [0, 0, 0, 2]

Before: [0, 2, 3, 3]
9 0 2 3
After:  [0, 2, 3, 0]

Before: [3, 0, 1, 1]
0 2 3 3
After:  [3, 0, 1, 2]

Before: [2, 2, 2, 1]
12 3 2 0
After:  [1, 2, 2, 1]

Before: [1, 2, 2, 3]
4 1 3 1
After:  [1, 0, 2, 3]

Before: [0, 3, 2, 1]
5 2 2 2
After:  [0, 3, 4, 1]

Before: [1, 3, 2, 0]
7 2 1 1
After:  [1, 1, 2, 0]

Before: [1, 1, 0, 2]
2 3 3 1
After:  [1, 0, 0, 2]

Before: [1, 3, 1, 2]
0 2 0 3
After:  [1, 3, 1, 2]

Before: [3, 3, 1, 2]
1 0 3 0
After:  [1, 3, 1, 2]

Before: [0, 0, 2, 1]
12 3 2 1
After:  [0, 1, 2, 1]

Before: [1, 1, 2, 3]
15 1 2 2
After:  [1, 1, 0, 3]

Before: [0, 1, 0, 2]
6 1 3 2
After:  [0, 1, 0, 2]

Before: [2, 3, 2, 2]
5 0 2 0
After:  [4, 3, 2, 2]

Before: [1, 2, 3, 3]
4 1 3 3
After:  [1, 2, 3, 0]

Before: [0, 1, 1, 0]
13 0 0 0
After:  [0, 1, 1, 0]

Before: [0, 1, 0, 1]
13 0 0 1
After:  [0, 0, 0, 1]

Before: [3, 3, 2, 3]
5 2 2 2
After:  [3, 3, 4, 3]

Before: [2, 3, 2, 3]
7 2 1 1
After:  [2, 1, 2, 3]

Before: [0, 3, 2, 2]
7 2 1 3
After:  [0, 3, 2, 1]

Before: [1, 3, 2, 0]
10 0 2 2
After:  [1, 3, 0, 0]

Before: [1, 1, 1, 3]
3 3 1 1
After:  [1, 0, 1, 3]

Before: [3, 2, 2, 0]
7 2 0 0
After:  [1, 2, 2, 0]

Before: [1, 2, 2, 2]
10 0 2 1
After:  [1, 0, 2, 2]

Before: [1, 0, 1, 1]
0 2 3 0
After:  [2, 0, 1, 1]

Before: [2, 2, 3, 2]
2 3 3 2
After:  [2, 2, 0, 2]

Before: [2, 3, 2, 2]
5 0 2 1
After:  [2, 4, 2, 2]

Before: [3, 1, 2, 1]
5 2 2 0
After:  [4, 1, 2, 1]

Before: [3, 3, 2, 1]
11 0 2 2
After:  [3, 3, 1, 1]

Before: [3, 3, 2, 3]
7 2 0 1
After:  [3, 1, 2, 3]

Before: [0, 2, 2, 1]
9 0 3 2
After:  [0, 2, 0, 1]

Before: [0, 1, 2, 3]
15 1 2 3
After:  [0, 1, 2, 0]

Before: [2, 1, 3, 1]
11 0 1 3
After:  [2, 1, 3, 1]

Before: [3, 1, 2, 0]
11 0 2 1
After:  [3, 1, 2, 0]

Before: [1, 3, 2, 0]
10 0 2 3
After:  [1, 3, 2, 0]

Before: [3, 0, 0, 2]
8 2 0 1
After:  [3, 0, 0, 2]

Before: [0, 2, 2, 1]
12 3 2 1
After:  [0, 1, 2, 1]

Before: [0, 1, 2, 1]
15 1 2 0
After:  [0, 1, 2, 1]

Before: [3, 1, 1, 1]
2 3 3 2
After:  [3, 1, 0, 1]

Before: [1, 1, 1, 2]
6 1 3 1
After:  [1, 0, 1, 2]

Before: [2, 1, 1, 1]
2 2 3 2
After:  [2, 1, 0, 1]

Before: [1, 2, 2, 1]
12 3 2 0
After:  [1, 2, 2, 1]

Before: [0, 1, 2, 1]
13 0 0 1
After:  [0, 0, 2, 1]

Before: [1, 3, 2, 1]
12 3 2 0
After:  [1, 3, 2, 1]

Before: [1, 3, 1, 2]
0 2 0 1
After:  [1, 2, 1, 2]

Before: [3, 1, 2, 0]
15 1 2 2
After:  [3, 1, 0, 0]

Before: [3, 3, 1, 1]
0 2 3 3
After:  [3, 3, 1, 2]

Before: [3, 2, 2, 0]
5 2 2 0
After:  [4, 2, 2, 0]

Before: [1, 0, 0, 2]
2 3 3 2
After:  [1, 0, 0, 2]

Before: [1, 0, 2, 3]
10 0 2 2
After:  [1, 0, 0, 3]

Before: [2, 0, 2, 0]
8 1 0 2
After:  [2, 0, 0, 0]

Before: [0, 2, 2, 3]
4 2 3 2
After:  [0, 2, 0, 3]

Before: [1, 2, 1, 1]
0 2 0 3
After:  [1, 2, 1, 2]

Before: [2, 1, 1, 1]
1 0 2 2
After:  [2, 1, 1, 1]

Before: [3, 1, 0, 2]
1 0 3 1
After:  [3, 1, 0, 2]

Before: [0, 3, 2, 2]
13 0 0 3
After:  [0, 3, 2, 0]

Before: [0, 1, 2, 2]
9 0 3 2
After:  [0, 1, 0, 2]

Before: [1, 0, 0, 3]
14 0 2 2
After:  [1, 0, 0, 3]

Before: [2, 3, 3, 3]
3 3 3 1
After:  [2, 1, 3, 3]

Before: [0, 2, 2, 3]
3 0 0 2
After:  [0, 2, 1, 3]

Before: [0, 2, 2, 2]
5 2 2 3
After:  [0, 2, 2, 4]

Before: [1, 2, 1, 3]
4 2 3 0
After:  [0, 2, 1, 3]

Before: [2, 1, 0, 2]
6 1 3 1
After:  [2, 0, 0, 2]

Before: [0, 1, 2, 3]
5 2 2 3
After:  [0, 1, 2, 4]

Before: [3, 1, 2, 2]
1 0 3 2
After:  [3, 1, 1, 2]

Before: [1, 3, 2, 0]
10 0 2 0
After:  [0, 3, 2, 0]

Before: [1, 2, 1, 2]
0 2 0 3
After:  [1, 2, 1, 2]

Before: [2, 2, 2, 3]
3 2 0 0
After:  [1, 2, 2, 3]

Before: [3, 1, 2, 3]
4 2 3 0
After:  [0, 1, 2, 3]

Before: [2, 3, 2, 0]
5 2 2 0
After:  [4, 3, 2, 0]

Before: [1, 1, 2, 1]
12 3 2 0
After:  [1, 1, 2, 1]

Before: [1, 1, 2, 2]
15 1 2 1
After:  [1, 0, 2, 2]

Before: [0, 1, 2, 3]
15 1 2 1
After:  [0, 0, 2, 3]

Before: [2, 0, 0, 1]
2 3 3 1
After:  [2, 0, 0, 1]

Before: [2, 2, 2, 0]
5 2 2 3
After:  [2, 2, 2, 4]

Before: [2, 0, 0, 3]
8 1 0 1
After:  [2, 0, 0, 3]

Before: [2, 3, 2, 3]
4 2 3 1
After:  [2, 0, 2, 3]

Before: [3, 2, 2, 1]
12 3 2 3
After:  [3, 2, 2, 1]

Before: [1, 1, 2, 2]
6 1 3 3
After:  [1, 1, 2, 0]

Before: [3, 1, 1, 1]
0 2 3 1
After:  [3, 2, 1, 1]

Before: [2, 0, 2, 2]
5 3 2 0
After:  [4, 0, 2, 2]

Before: [2, 1, 0, 1]
2 3 3 2
After:  [2, 1, 0, 1]

Before: [1, 2, 2, 0]
10 0 2 3
After:  [1, 2, 2, 0]

Before: [3, 1, 2, 2]
15 1 2 1
After:  [3, 0, 2, 2]

Before: [0, 3, 1, 1]
0 2 3 2
After:  [0, 3, 2, 1]

Before: [1, 3, 1, 0]
0 2 0 1
After:  [1, 2, 1, 0]

Before: [2, 3, 1, 1]
2 2 3 0
After:  [0, 3, 1, 1]

Before: [1, 1, 2, 3]
10 0 2 0
After:  [0, 1, 2, 3]

Before: [1, 3, 2, 0]
7 2 1 3
After:  [1, 3, 2, 1]

Before: [3, 2, 3, 3]
3 3 3 0
After:  [1, 2, 3, 3]

Before: [3, 2, 1, 2]
1 0 3 3
After:  [3, 2, 1, 1]

Before: [2, 3, 0, 2]
7 0 1 3
After:  [2, 3, 0, 1]

Before: [2, 2, 1, 2]
1 0 2 1
After:  [2, 1, 1, 2]

Before: [0, 3, 2, 2]
7 2 1 0
After:  [1, 3, 2, 2]

Before: [1, 2, 2, 1]
12 3 2 3
After:  [1, 2, 2, 1]

Before: [1, 1, 1, 2]
0 2 0 3
After:  [1, 1, 1, 2]

Before: [2, 2, 1, 2]
1 0 2 2
After:  [2, 2, 1, 2]

Before: [1, 3, 2, 1]
12 3 2 2
After:  [1, 3, 1, 1]

Before: [1, 2, 0, 2]
2 3 3 2
After:  [1, 2, 0, 2]

Before: [0, 3, 2, 1]
9 0 2 1
After:  [0, 0, 2, 1]

Before: [1, 0, 2, 1]
10 0 2 1
After:  [1, 0, 2, 1]

Before: [0, 1, 2, 0]
13 0 0 2
After:  [0, 1, 0, 0]

Before: [0, 0, 3, 1]
9 0 3 0
After:  [0, 0, 3, 1]

Before: [1, 3, 2, 0]
5 2 2 1
After:  [1, 4, 2, 0]

Before: [3, 2, 2, 3]
3 3 1 3
After:  [3, 2, 2, 0]

Before: [3, 3, 2, 1]
11 0 2 1
After:  [3, 1, 2, 1]

Before: [2, 2, 2, 1]
3 2 0 0
After:  [1, 2, 2, 1]

Before: [1, 1, 2, 1]
12 3 2 3
After:  [1, 1, 2, 1]

Before: [3, 3, 2, 3]
11 0 2 0
After:  [1, 3, 2, 3]

Before: [2, 1, 0, 1]
11 0 1 1
After:  [2, 1, 0, 1]

Before: [0, 0, 2, 1]
12 3 2 0
After:  [1, 0, 2, 1]

Before: [1, 3, 0, 2]
14 0 2 1
After:  [1, 0, 0, 2]

Before: [1, 1, 2, 0]
10 0 2 0
After:  [0, 1, 2, 0]

Before: [0, 2, 3, 0]
13 0 0 1
After:  [0, 0, 3, 0]

Before: [1, 1, 1, 1]
2 3 3 0
After:  [0, 1, 1, 1]

Before: [1, 2, 0, 2]
14 0 2 2
After:  [1, 2, 0, 2]

Before: [2, 1, 0, 0]
11 0 1 2
After:  [2, 1, 1, 0]

Before: [1, 1, 2, 0]
10 0 2 1
After:  [1, 0, 2, 0]

Before: [1, 0, 1, 0]
0 2 0 1
After:  [1, 2, 1, 0]

Before: [1, 0, 2, 0]
10 0 2 0
After:  [0, 0, 2, 0]

Before: [1, 1, 0, 2]
6 1 3 1
After:  [1, 0, 0, 2]

Before: [0, 3, 3, 1]
3 2 3 3
After:  [0, 3, 3, 0]

Before: [2, 0, 2, 1]
8 1 0 0
After:  [0, 0, 2, 1]

Before: [3, 1, 2, 2]
11 0 2 2
After:  [3, 1, 1, 2]

Before: [0, 2, 0, 2]
9 0 1 2
After:  [0, 2, 0, 2]

Before: [2, 1, 2, 2]
5 3 2 0
After:  [4, 1, 2, 2]

Before: [0, 1, 1, 1]
0 2 3 1
After:  [0, 2, 1, 1]

Before: [0, 2, 1, 1]
9 0 2 1
After:  [0, 0, 1, 1]

Before: [3, 2, 2, 0]
11 0 2 2
After:  [3, 2, 1, 0]

Before: [0, 3, 2, 2]
5 2 2 0
After:  [4, 3, 2, 2]

Before: [0, 1, 0, 2]
3 0 0 2
After:  [0, 1, 1, 2]

Before: [2, 3, 0, 0]
7 0 1 3
After:  [2, 3, 0, 1]

Before: [2, 3, 1, 0]
7 0 1 0
After:  [1, 3, 1, 0]

Before: [0, 1, 2, 0]
9 0 2 1
After:  [0, 0, 2, 0]

Before: [1, 0, 1, 2]
0 2 0 0
After:  [2, 0, 1, 2]

Before: [1, 3, 0, 2]
14 0 2 3
After:  [1, 3, 0, 0]

Before: [0, 1, 2, 1]
15 1 2 1
After:  [0, 0, 2, 1]

Before: [2, 1, 2, 1]
11 0 1 2
After:  [2, 1, 1, 1]

Before: [1, 1, 1, 2]
6 1 3 0
After:  [0, 1, 1, 2]

Before: [0, 2, 2, 1]
13 0 0 1
After:  [0, 0, 2, 1]

Before: [1, 2, 1, 2]
0 2 0 1
After:  [1, 2, 1, 2]

Before: [2, 3, 3, 0]
7 0 1 1
After:  [2, 1, 3, 0]

Before: [0, 1, 1, 3]
4 1 3 0
After:  [0, 1, 1, 3]

Before: [2, 1, 3, 3]
11 0 1 3
After:  [2, 1, 3, 1]

Before: [3, 3, 2, 2]
1 0 3 1
After:  [3, 1, 2, 2]

Before: [1, 3, 0, 0]
14 0 2 0
After:  [0, 3, 0, 0]

Before: [0, 2, 0, 0]
3 0 0 1
After:  [0, 1, 0, 0]

Before: [3, 1, 3, 2]
1 0 3 1
After:  [3, 1, 3, 2]

Before: [0, 2, 0, 2]
13 0 0 2
After:  [0, 2, 0, 2]

Before: [3, 0, 2, 0]
8 1 0 3
After:  [3, 0, 2, 0]

Before: [3, 0, 2, 1]
11 0 2 2
After:  [3, 0, 1, 1]

Before: [0, 3, 0, 3]
13 0 0 2
After:  [0, 3, 0, 3]

Before: [3, 0, 2, 3]
7 2 0 0
After:  [1, 0, 2, 3]

Before: [3, 3, 0, 2]
1 0 3 0
After:  [1, 3, 0, 2]

Before: [0, 0, 3, 1]
3 2 3 3
After:  [0, 0, 3, 0]

Before: [1, 3, 2, 1]
10 0 2 1
After:  [1, 0, 2, 1]

Before: [0, 0, 0, 0]
13 0 0 1
After:  [0, 0, 0, 0]

Before: [0, 1, 2, 2]
13 0 0 0
After:  [0, 1, 2, 2]

Before: [0, 2, 0, 3]
9 0 1 0
After:  [0, 2, 0, 3]

Before: [0, 1, 0, 0]
13 0 0 0
After:  [0, 1, 0, 0]

Before: [2, 0, 0, 1]
2 3 3 3
After:  [2, 0, 0, 0]

Before: [2, 3, 2, 3]
7 0 1 0
After:  [1, 3, 2, 3]

Before: [2, 1, 2, 2]
6 1 3 3
After:  [2, 1, 2, 0]

Before: [2, 1, 1, 2]
11 0 1 0
After:  [1, 1, 1, 2]

Before: [1, 2, 0, 3]
14 0 2 3
After:  [1, 2, 0, 0]

Before: [3, 0, 1, 1]
0 2 3 1
After:  [3, 2, 1, 1]

Before: [2, 0, 2, 0]
3 2 2 2
After:  [2, 0, 1, 0]

Before: [1, 0, 1, 2]
0 2 0 1
After:  [1, 2, 1, 2]

Before: [0, 0, 2, 1]
9 0 2 2
After:  [0, 0, 0, 1]

Before: [2, 1, 1, 1]
11 0 1 2
After:  [2, 1, 1, 1]

Before: [1, 2, 3, 3]
3 3 2 0
After:  [1, 2, 3, 3]

Before: [2, 3, 2, 0]
3 2 0 3
After:  [2, 3, 2, 1]

Before: [1, 3, 2, 1]
12 3 2 3
After:  [1, 3, 2, 1]

Before: [1, 1, 2, 1]
5 2 2 1
After:  [1, 4, 2, 1]

Before: [1, 1, 3, 2]
6 1 3 2
After:  [1, 1, 0, 2]

Before: [0, 1, 2, 1]
12 3 2 0
After:  [1, 1, 2, 1]

Before: [3, 3, 1, 2]
1 0 3 3
After:  [3, 3, 1, 1]

Before: [0, 0, 1, 1]
0 2 3 0
After:  [2, 0, 1, 1]

Before: [1, 0, 2, 1]
12 3 2 2
After:  [1, 0, 1, 1]

Before: [1, 2, 2, 0]
10 0 2 2
After:  [1, 2, 0, 0]

Before: [3, 3, 2, 2]
1 0 3 3
After:  [3, 3, 2, 1]

Before: [2, 1, 2, 2]
6 1 3 2
After:  [2, 1, 0, 2]

Before: [2, 1, 2, 3]
3 3 2 3
After:  [2, 1, 2, 0]

Before: [1, 0, 0, 1]
14 0 2 0
After:  [0, 0, 0, 1]

Before: [1, 3, 0, 0]
14 0 2 1
After:  [1, 0, 0, 0]

Before: [3, 2, 0, 1]
8 2 0 0
After:  [0, 2, 0, 1]

Before: [0, 1, 2, 0]
15 1 2 0
After:  [0, 1, 2, 0]

Before: [1, 0, 2, 0]
10 0 2 2
After:  [1, 0, 0, 0]

Before: [2, 1, 3, 0]
11 0 1 1
After:  [2, 1, 3, 0]

Before: [2, 3, 1, 1]
1 0 2 3
After:  [2, 3, 1, 1]

Before: [3, 0, 1, 3]
8 1 0 0
After:  [0, 0, 1, 3]

Before: [1, 1, 1, 1]
0 2 0 1
After:  [1, 2, 1, 1]

Before: [3, 2, 2, 3]
5 2 2 3
After:  [3, 2, 2, 4]

Before: [1, 0, 2, 3]
4 2 3 3
After:  [1, 0, 2, 0]

Before: [2, 1, 1, 0]
1 0 2 0
After:  [1, 1, 1, 0]

Before: [2, 1, 1, 1]
1 0 2 1
After:  [2, 1, 1, 1]

Before: [0, 3, 2, 1]
13 0 0 3
After:  [0, 3, 2, 0]

Before: [0, 3, 2, 1]
12 3 2 2
After:  [0, 3, 1, 1]

Before: [2, 2, 1, 2]
1 0 2 3
After:  [2, 2, 1, 1]

Before: [2, 1, 3, 2]
11 0 1 1
After:  [2, 1, 3, 2]

Before: [0, 0, 1, 2]
13 0 0 1
After:  [0, 0, 1, 2]

Before: [1, 2, 2, 1]
12 3 2 2
After:  [1, 2, 1, 1]

Before: [0, 1, 2, 2]
6 1 3 3
After:  [0, 1, 2, 0]

Before: [3, 0, 1, 2]
1 0 3 3
After:  [3, 0, 1, 1]

Before: [3, 3, 2, 0]
3 2 2 0
After:  [1, 3, 2, 0]

Before: [2, 1, 2, 1]
11 0 1 0
After:  [1, 1, 2, 1]

Before: [2, 1, 0, 2]
6 1 3 3
After:  [2, 1, 0, 0]

Before: [3, 2, 0, 2]
8 2 0 2
After:  [3, 2, 0, 2]

Before: [2, 0, 3, 1]
2 3 3 0
After:  [0, 0, 3, 1]

Before: [1, 3, 2, 2]
5 3 2 0
After:  [4, 3, 2, 2]

Before: [2, 1, 2, 3]
5 0 2 3
After:  [2, 1, 2, 4]

Before: [1, 1, 2, 3]
4 2 3 3
After:  [1, 1, 2, 0]

Before: [0, 0, 3, 0]
13 0 0 0
After:  [0, 0, 3, 0]

Before: [0, 3, 2, 3]
7 2 1 0
After:  [1, 3, 2, 3]

Before: [3, 1, 2, 1]
12 3 2 1
After:  [3, 1, 2, 1]

Before: [2, 1, 2, 0]
15 1 2 1
After:  [2, 0, 2, 0]

Before: [1, 2, 2, 3]
10 0 2 2
After:  [1, 2, 0, 3]

Before: [0, 3, 3, 0]
3 0 0 2
After:  [0, 3, 1, 0]

Before: [1, 0, 2, 1]
12 3 2 0
After:  [1, 0, 2, 1]

Before: [2, 1, 3, 2]
6 1 3 2
After:  [2, 1, 0, 2]

Before: [1, 1, 2, 3]
5 2 2 1
After:  [1, 4, 2, 3]

Before: [2, 3, 0, 3]
7 0 1 3
After:  [2, 3, 0, 1]

Before: [1, 1, 0, 3]
14 0 2 1
After:  [1, 0, 0, 3]

Before: [0, 3, 2, 0]
13 0 0 0
After:  [0, 3, 2, 0]

Before: [0, 3, 2, 3]
7 2 1 1
After:  [0, 1, 2, 3]

Before: [0, 3, 3, 0]
3 0 0 1
After:  [0, 1, 3, 0]

Before: [0, 1, 1, 2]
9 0 2 3
After:  [0, 1, 1, 0]

Before: [1, 1, 2, 3]
15 1 2 3
After:  [1, 1, 2, 0]

Before: [2, 3, 2, 0]
7 2 1 1
After:  [2, 1, 2, 0]

Before: [3, 0, 1, 0]
8 1 0 0
After:  [0, 0, 1, 0]

Before: [3, 3, 2, 1]
12 3 2 2
After:  [3, 3, 1, 1]

Before: [1, 2, 0, 3]
14 0 2 1
After:  [1, 0, 0, 3]

Before: [2, 1, 1, 3]
4 1 3 1
After:  [2, 0, 1, 3]

Before: [0, 2, 3, 1]
13 0 0 1
After:  [0, 0, 3, 1]

Before: [3, 1, 0, 2]
6 1 3 3
After:  [3, 1, 0, 0]

Before: [2, 2, 2, 2]
2 3 3 3
After:  [2, 2, 2, 0]

Before: [0, 1, 3, 3]
9 0 2 3
After:  [0, 1, 3, 0]

Before: [2, 1, 2, 2]
15 1 2 0
After:  [0, 1, 2, 2]

Before: [0, 2, 2, 2]
5 2 2 0
After:  [4, 2, 2, 2]

Before: [3, 2, 0, 2]
8 2 0 0
After:  [0, 2, 0, 2]

Before: [1, 1, 3, 2]
6 1 3 1
After:  [1, 0, 3, 2]

Before: [3, 1, 1, 3]
4 1 3 1
After:  [3, 0, 1, 3]

Before: [3, 1, 0, 2]
8 2 0 0
After:  [0, 1, 0, 2]

Before: [3, 0, 2, 1]
12 3 2 1
After:  [3, 1, 2, 1]

Before: [0, 1, 1, 1]
13 0 0 1
After:  [0, 0, 1, 1]

Before: [0, 1, 2, 3]
4 1 3 0
After:  [0, 1, 2, 3]

Before: [2, 1, 1, 1]
1 0 2 3
After:  [2, 1, 1, 1]

Before: [0, 1, 3, 2]
6 1 3 1
After:  [0, 0, 3, 2]

Before: [3, 2, 2, 0]
5 1 2 3
After:  [3, 2, 2, 4]

Before: [1, 0, 0, 1]
14 0 2 3
After:  [1, 0, 0, 0]

Before: [0, 0, 3, 2]
13 0 0 3
After:  [0, 0, 3, 0]

Before: [1, 0, 0, 2]
14 0 2 2
After:  [1, 0, 0, 2]

Before: [3, 2, 3, 3]
3 3 2 3
After:  [3, 2, 3, 1]

Before: [2, 3, 2, 1]
5 2 2 0
After:  [4, 3, 2, 1]

Before: [3, 1, 2, 0]
15 1 2 1
After:  [3, 0, 2, 0]

Before: [1, 1, 1, 2]
6 1 3 2
After:  [1, 1, 0, 2]

Before: [3, 2, 0, 0]
8 2 0 3
After:  [3, 2, 0, 0]

Before: [2, 1, 1, 3]
11 0 1 1
After:  [2, 1, 1, 3]

Before: [3, 2, 3, 2]
1 0 3 1
After:  [3, 1, 3, 2]

Before: [1, 1, 0, 2]
6 1 3 2
After:  [1, 1, 0, 2]

Before: [0, 2, 3, 2]
13 0 0 0
After:  [0, 2, 3, 2]

Before: [3, 2, 2, 2]
7 2 0 0
After:  [1, 2, 2, 2]

Before: [2, 1, 1, 3]
1 0 2 3
After:  [2, 1, 1, 1]

Before: [0, 2, 2, 3]
13 0 0 1
After:  [0, 0, 2, 3]

Before: [1, 1, 2, 1]
15 1 2 1
After:  [1, 0, 2, 1]

Before: [2, 0, 1, 1]
8 1 0 0
After:  [0, 0, 1, 1]

Before: [0, 3, 0, 2]
9 0 3 1
After:  [0, 0, 0, 2]

Before: [0, 1, 0, 3]
3 3 3 3
After:  [0, 1, 0, 1]

Before: [2, 2, 0, 3]
4 1 3 2
After:  [2, 2, 0, 3]

Before: [0, 0, 0, 1]
13 0 0 2
After:  [0, 0, 0, 1]

Before: [3, 3, 2, 2]
2 3 3 3
After:  [3, 3, 2, 0]

Before: [0, 1, 3, 2]
6 1 3 2
After:  [0, 1, 0, 2]

Before: [0, 1, 2, 1]
12 3 2 1
After:  [0, 1, 2, 1]

Before: [3, 3, 3, 1]
2 3 3 2
After:  [3, 3, 0, 1]

Before: [0, 3, 2, 3]
9 0 2 3
After:  [0, 3, 2, 0]

Before: [3, 0, 0, 3]
8 2 0 2
After:  [3, 0, 0, 3]

Before: [3, 0, 2, 2]
11 0 2 0
After:  [1, 0, 2, 2]

Before: [0, 1, 1, 3]
3 3 1 1
After:  [0, 0, 1, 3]

Before: [3, 0, 1, 0]
8 1 0 1
After:  [3, 0, 1, 0]

Before: [1, 1, 0, 1]
14 0 2 1
After:  [1, 0, 0, 1]

Before: [1, 0, 0, 0]
14 0 2 3
After:  [1, 0, 0, 0]

Before: [3, 1, 2, 2]
6 1 3 1
After:  [3, 0, 2, 2]

Before: [3, 0, 0, 1]
8 1 0 1
After:  [3, 0, 0, 1]

Before: [3, 1, 2, 2]
15 1 2 3
After:  [3, 1, 2, 0]

Before: [2, 0, 0, 0]
8 1 0 3
After:  [2, 0, 0, 0]

Before: [3, 3, 2, 0]
11 0 2 1
After:  [3, 1, 2, 0]

Before: [1, 2, 2, 2]
10 0 2 2
After:  [1, 2, 0, 2]

Before: [0, 2, 1, 1]
0 2 3 0
After:  [2, 2, 1, 1]

Before: [1, 3, 2, 2]
7 2 1 1
After:  [1, 1, 2, 2]

Before: [1, 2, 0, 2]
14 0 2 1
After:  [1, 0, 0, 2]

Before: [1, 1, 2, 3]
4 2 3 0
After:  [0, 1, 2, 3]

Before: [3, 3, 1, 1]
0 2 3 0
After:  [2, 3, 1, 1]

Before: [0, 0, 2, 3]
13 0 0 2
After:  [0, 0, 0, 3]

Before: [3, 2, 2, 2]
7 2 0 2
After:  [3, 2, 1, 2]

Before: [2, 1, 1, 2]
6 1 3 2
After:  [2, 1, 0, 2]

Before: [2, 2, 2, 3]
5 2 2 1
After:  [2, 4, 2, 3]

Before: [0, 1, 0, 3]
9 0 3 1
After:  [0, 0, 0, 3]

Before: [2, 3, 1, 3]
7 0 1 0
After:  [1, 3, 1, 3]

Before: [0, 0, 1, 3]
4 2 3 0
After:  [0, 0, 1, 3]

Before: [0, 0, 2, 3]
9 0 2 2
After:  [0, 0, 0, 3]

Before: [2, 1, 2, 1]
11 0 1 1
After:  [2, 1, 2, 1]

Before: [1, 3, 1, 1]
0 2 3 2
After:  [1, 3, 2, 1]

Before: [0, 1, 0, 2]
6 1 3 1
After:  [0, 0, 0, 2]

Before: [2, 1, 1, 3]
4 1 3 0
After:  [0, 1, 1, 3]

Before: [1, 2, 1, 2]
0 2 0 0
After:  [2, 2, 1, 2]

Before: [1, 0, 2, 3]
10 0 2 3
After:  [1, 0, 2, 0]

Before: [2, 3, 2, 1]
2 3 3 1
After:  [2, 0, 2, 1]

Before: [1, 3, 2, 0]
10 0 2 1
After:  [1, 0, 2, 0]

Before: [2, 0, 3, 2]
8 1 0 2
After:  [2, 0, 0, 2]

Before: [0, 2, 1, 1]
9 0 1 1
After:  [0, 0, 1, 1]

Before: [3, 1, 2, 2]
6 1 3 0
After:  [0, 1, 2, 2]

Before: [1, 1, 2, 1]
10 0 2 3
After:  [1, 1, 2, 0]

Before: [2, 2, 2, 1]
2 3 3 3
After:  [2, 2, 2, 0]

Before: [1, 1, 2, 0]
15 1 2 0
After:  [0, 1, 2, 0]

Before: [1, 1, 0, 0]
14 0 2 3
After:  [1, 1, 0, 0]

Before: [1, 2, 2, 2]
10 0 2 0
After:  [0, 2, 2, 2]

Before: [1, 2, 1, 3]
4 1 3 1
After:  [1, 0, 1, 3]

Before: [1, 3, 0, 2]
14 0 2 0
After:  [0, 3, 0, 2]

Before: [0, 1, 3, 2]
9 0 2 1
After:  [0, 0, 3, 2]

Before: [1, 0, 1, 3]
0 2 0 1
After:  [1, 2, 1, 3]

Before: [2, 1, 2, 3]
4 2 3 1
After:  [2, 0, 2, 3]

Before: [0, 2, 3, 2]
9 0 3 1
After:  [0, 0, 3, 2]

Before: [3, 0, 1, 3]
8 1 0 3
After:  [3, 0, 1, 0]

Before: [2, 1, 1, 2]
11 0 1 2
After:  [2, 1, 1, 2]

Before: [2, 3, 0, 2]
7 0 1 2
After:  [2, 3, 1, 2]

Before: [0, 3, 1, 0]
13 0 0 3
After:  [0, 3, 1, 0]

Before: [2, 1, 1, 3]
1 0 2 1
After:  [2, 1, 1, 3]

Before: [2, 1, 1, 2]
6 1 3 1
After:  [2, 0, 1, 2]

Before: [0, 1, 2, 0]
5 2 2 3
After:  [0, 1, 2, 4]

Before: [0, 2, 1, 3]
3 3 2 0
After:  [0, 2, 1, 3]

Before: [0, 0, 1, 3]
4 2 3 1
After:  [0, 0, 1, 3]

Before: [1, 3, 2, 1]
10 0 2 0
After:  [0, 3, 2, 1]

Before: [1, 2, 1, 1]
0 2 0 2
After:  [1, 2, 2, 1]

Before: [3, 1, 0, 2]
6 1 3 0
After:  [0, 1, 0, 2]

Before: [3, 1, 2, 1]
12 3 2 3
After:  [3, 1, 2, 1]

Before: [1, 1, 2, 2]
15 1 2 0
After:  [0, 1, 2, 2]

Before: [1, 0, 2, 3]
10 0 2 1
After:  [1, 0, 2, 3]

Before: [0, 3, 2, 1]
7 2 1 1
After:  [0, 1, 2, 1]

Before: [0, 0, 2, 1]
2 3 3 0
After:  [0, 0, 2, 1]

Before: [1, 0, 1, 0]
0 2 0 2
After:  [1, 0, 2, 0]

Before: [3, 0, 0, 0]
8 1 0 3
After:  [3, 0, 0, 0]

Before: [2, 2, 2, 1]
12 3 2 3
After:  [2, 2, 2, 1]

Before: [2, 0, 2, 0]
8 1 0 1
After:  [2, 0, 2, 0]

Before: [3, 2, 0, 3]
3 3 0 3
After:  [3, 2, 0, 1]

Before: [2, 0, 1, 0]
1 0 2 2
After:  [2, 0, 1, 0]

Before: [1, 0, 2, 2]
3 2 2 0
After:  [1, 0, 2, 2]

Before: [3, 2, 2, 1]
12 3 2 2
After:  [3, 2, 1, 1]

Before: [0, 1, 1, 3]
3 3 3 2
After:  [0, 1, 1, 3]

Before: [3, 0, 2, 2]
5 2 2 3
After:  [3, 0, 2, 4]

Before: [2, 1, 2, 3]
11 0 1 2
After:  [2, 1, 1, 3]

Before: [0, 2, 2, 2]
5 2 2 1
After:  [0, 4, 2, 2]

Before: [3, 1, 2, 1]
2 3 3 3
After:  [3, 1, 2, 0]

Before: [3, 1, 1, 2]
6 1 3 0
After:  [0, 1, 1, 2]

Before: [0, 0, 0, 3]
3 0 0 3
After:  [0, 0, 0, 1]

Before: [2, 1, 0, 3]
3 3 3 0
After:  [1, 1, 0, 3]

Before: [2, 1, 3, 3]
3 3 3 1
After:  [2, 1, 3, 3]

Before: [3, 3, 1, 1]
2 2 3 3
After:  [3, 3, 1, 0]

Before: [0, 0, 2, 1]
13 0 0 3
After:  [0, 0, 2, 0]

Before: [1, 0, 2, 1]
12 3 2 3
After:  [1, 0, 2, 1]

Before: [0, 0, 1, 2]
2 3 3 1
After:  [0, 0, 1, 2]

Before: [3, 1, 2, 1]
12 3 2 2
After:  [3, 1, 1, 1]

Before: [1, 0, 2, 1]
10 0 2 2
After:  [1, 0, 0, 1]

Before: [3, 1, 2, 2]
1 0 3 1
After:  [3, 1, 2, 2]

Before: [3, 2, 3, 2]
1 0 3 0
After:  [1, 2, 3, 2]

Before: [0, 2, 2, 1]
12 3 2 2
After:  [0, 2, 1, 1]

Before: [1, 1, 2, 2]
10 0 2 2
After:  [1, 1, 0, 2]

Before: [1, 3, 2, 3]
10 0 2 2
After:  [1, 3, 0, 3]

Before: [3, 3, 2, 1]
7 2 0 1
After:  [3, 1, 2, 1]

Before: [2, 1, 0, 2]
6 1 3 2
After:  [2, 1, 0, 2]

Before: [3, 1, 0, 1]
2 3 3 1
After:  [3, 0, 0, 1]

Before: [0, 0, 3, 2]
13 0 0 0
After:  [0, 0, 3, 2]

Before: [3, 3, 2, 3]
11 0 2 2
After:  [3, 3, 1, 3]

Before: [0, 1, 0, 2]
6 1 3 0
After:  [0, 1, 0, 2]

Before: [1, 2, 2, 3]
10 0 2 0
After:  [0, 2, 2, 3]

Before: [3, 1, 3, 2]
6 1 3 0
After:  [0, 1, 3, 2]

Before: [2, 1, 0, 2]
11 0 1 2
After:  [2, 1, 1, 2]

Before: [3, 0, 0, 3]
8 2 0 3
After:  [3, 0, 0, 0]

Before: [2, 1, 1, 3]
11 0 1 2
After:  [2, 1, 1, 3]

Before: [3, 0, 2, 0]
7 2 0 1
After:  [3, 1, 2, 0]

Before: [2, 3, 1, 1]
1 0 2 0
After:  [1, 3, 1, 1]

Before: [3, 1, 0, 3]
4 1 3 0
After:  [0, 1, 0, 3]

Before: [2, 3, 2, 1]
12 3 2 3
After:  [2, 3, 2, 1]

Before: [0, 1, 3, 2]
13 0 0 0
After:  [0, 1, 3, 2]

Before: [1, 1, 1, 2]
2 3 3 3
After:  [1, 1, 1, 0]

Before: [3, 1, 2, 3]
4 2 3 2
After:  [3, 1, 0, 3]

Before: [2, 1, 0, 0]
11 0 1 0
After:  [1, 1, 0, 0]

Before: [1, 3, 0, 2]
14 0 2 2
After:  [1, 3, 0, 2]

Before: [2, 1, 2, 2]
15 1 2 2
After:  [2, 1, 0, 2]

Before: [2, 1, 1, 2]
11 0 1 1
After:  [2, 1, 1, 2]

Before: [1, 0, 2, 2]
10 0 2 1
After:  [1, 0, 2, 2]

Before: [0, 3, 2, 0]
7 2 1 1
After:  [0, 1, 2, 0]

Before: [2, 0, 2, 3]
3 2 2 1
After:  [2, 1, 2, 3]

Before: [2, 0, 0, 0]
8 1 0 2
After:  [2, 0, 0, 0]

Before: [3, 1, 2, 2]
1 0 3 0
After:  [1, 1, 2, 2]

Before: [3, 3, 2, 2]
11 0 2 3
After:  [3, 3, 2, 1]

Before: [0, 2, 0, 3]
13 0 0 1
After:  [0, 0, 0, 3]

Before: [3, 2, 2, 2]
5 1 2 1
After:  [3, 4, 2, 2]

Before: [0, 1, 3, 2]
13 0 0 3
After:  [0, 1, 3, 0]

Before: [2, 0, 1, 1]
1 0 2 1
After:  [2, 1, 1, 1]

Before: [2, 3, 0, 2]
7 0 1 0
After:  [1, 3, 0, 2]

Before: [0, 3, 2, 3]
4 2 3 0
After:  [0, 3, 2, 3]

Before: [0, 1, 3, 3]
3 3 2 3
After:  [0, 1, 3, 1]

Before: [1, 3, 0, 3]
3 3 3 2
After:  [1, 3, 1, 3]

Before: [0, 1, 3, 3]
13 0 0 3
After:  [0, 1, 3, 0]

Before: [1, 3, 0, 3]
14 0 2 2
After:  [1, 3, 0, 3]

Before: [0, 1, 0, 2]
6 1 3 3
After:  [0, 1, 0, 0]

Before: [0, 3, 3, 3]
9 0 3 3
After:  [0, 3, 3, 0]

Before: [0, 3, 2, 2]
7 2 1 2
After:  [0, 3, 1, 2]

Before: [1, 1, 2, 0]
15 1 2 3
After:  [1, 1, 2, 0]

Before: [1, 3, 2, 3]
10 0 2 0
After:  [0, 3, 2, 3]

Before: [2, 1, 2, 1]
15 1 2 3
After:  [2, 1, 2, 0]

Before: [3, 1, 2, 1]
15 1 2 2
After:  [3, 1, 0, 1]

Before: [1, 1, 2, 3]
5 2 2 2
After:  [1, 1, 4, 3]

Before: [3, 0, 2, 2]
8 1 0 1
After:  [3, 0, 2, 2]

Before: [3, 0, 2, 3]
4 2 3 2
After:  [3, 0, 0, 3]

Before: [0, 2, 2, 3]
9 0 2 0
After:  [0, 2, 2, 3]

Before: [3, 1, 2, 2]
6 1 3 3
After:  [3, 1, 2, 0]

Before: [3, 0, 2, 2]
7 2 0 2
After:  [3, 0, 1, 2]

Before: [1, 2, 2, 2]
5 3 2 1
After:  [1, 4, 2, 2]

Before: [0, 3, 1, 3]
9 0 3 0
After:  [0, 3, 1, 3]

Before: [0, 3, 0, 1]
2 3 3 3
After:  [0, 3, 0, 0]

Before: [0, 0, 0, 2]
13 0 0 0
After:  [0, 0, 0, 2]

Before: [2, 1, 1, 2]
11 0 1 3
After:  [2, 1, 1, 1]

Before: [2, 3, 3, 3]
7 0 1 3
After:  [2, 3, 3, 1]

Before: [0, 3, 3, 2]
9 0 3 2
After:  [0, 3, 0, 2]

Before: [3, 1, 2, 0]
11 0 2 3
After:  [3, 1, 2, 1]

Before: [3, 1, 2, 2]
11 0 2 3
After:  [3, 1, 2, 1]

Before: [2, 2, 1, 1]
2 3 3 0
After:  [0, 2, 1, 1]

Before: [3, 1, 2, 0]
11 0 2 2
After:  [3, 1, 1, 0]

Before: [0, 0, 3, 1]
13 0 0 3
After:  [0, 0, 3, 0]

Before: [3, 1, 2, 3]
15 1 2 2
After:  [3, 1, 0, 3]

Before: [3, 0, 3, 3]
8 1 0 0
After:  [0, 0, 3, 3]

Before: [1, 3, 0, 1]
14 0 2 2
After:  [1, 3, 0, 1]

Before: [2, 1, 2, 2]
15 1 2 3
After:  [2, 1, 2, 0]

Before: [3, 0, 1, 2]
2 3 3 0
After:  [0, 0, 1, 2]

Before: [3, 2, 2, 0]
5 2 2 1
After:  [3, 4, 2, 0]

Before: [1, 0, 1, 1]
2 2 3 3
After:  [1, 0, 1, 0]

Before: [0, 2, 3, 0]
9 0 1 1
After:  [0, 0, 3, 0]

Before: [0, 2, 1, 1]
9 0 1 3
After:  [0, 2, 1, 0]

Before: [1, 3, 1, 3]
0 2 0 3
After:  [1, 3, 1, 2]

Before: [3, 3, 2, 2]
5 3 2 0
After:  [4, 3, 2, 2]

Before: [1, 2, 0, 1]
14 0 2 1
After:  [1, 0, 0, 1]

Before: [1, 2, 1, 1]
0 2 3 3
After:  [1, 2, 1, 2]

Before: [0, 3, 1, 3]
13 0 0 0
After:  [0, 3, 1, 3]

Before: [1, 2, 0, 1]
14 0 2 0
After:  [0, 2, 0, 1]

Before: [1, 2, 0, 1]
14 0 2 2
After:  [1, 2, 0, 1]

Before: [2, 3, 3, 1]
7 0 1 3
After:  [2, 3, 3, 1]

Before: [1, 1, 1, 2]
0 2 0 2
After:  [1, 1, 2, 2]

Before: [1, 0, 3, 1]
2 3 3 0
After:  [0, 0, 3, 1]

Before: [1, 3, 0, 3]
14 0 2 3
After:  [1, 3, 0, 0]

Before: [0, 2, 2, 1]
3 0 0 1
After:  [0, 1, 2, 1]

Before: [2, 1, 2, 0]
11 0 1 3
After:  [2, 1, 2, 1]

Before: [0, 0, 0, 1]
2 3 3 0
After:  [0, 0, 0, 1]

Before: [2, 2, 1, 1]
1 0 2 0
After:  [1, 2, 1, 1]

Before: [2, 1, 1, 3]
11 0 1 3
After:  [2, 1, 1, 1]

Before: [0, 3, 1, 1]
9 0 1 2
After:  [0, 3, 0, 1]

Before: [2, 1, 2, 3]
15 1 2 2
After:  [2, 1, 0, 3]

Before: [0, 2, 1, 2]
9 0 3 0
After:  [0, 2, 1, 2]

Before: [0, 1, 2, 0]
15 1 2 1
After:  [0, 0, 2, 0]

Before: [1, 1, 0, 3]
14 0 2 3
After:  [1, 1, 0, 0]

Before: [2, 0, 2, 1]
12 3 2 3
After:  [2, 0, 2, 1]

Before: [0, 2, 3, 3]
9 0 1 2
After:  [0, 2, 0, 3]

Before: [1, 1, 0, 3]
4 1 3 3
After:  [1, 1, 0, 0]

Before: [0, 2, 2, 3]
4 1 3 1
After:  [0, 0, 2, 3]

Before: [0, 2, 0, 3]
9 0 1 1
After:  [0, 0, 0, 3]

Before: [3, 0, 2, 3]
11 0 2 0
After:  [1, 0, 2, 3]

Before: [0, 1, 2, 1]
12 3 2 2
After:  [0, 1, 1, 1]

Before: [3, 0, 2, 1]
11 0 2 3
After:  [3, 0, 2, 1]

Before: [3, 1, 2, 2]
7 2 0 0
After:  [1, 1, 2, 2]

Before: [2, 0, 1, 2]
1 0 2 1
After:  [2, 1, 1, 2]

Before: [3, 0, 2, 1]
12 3 2 0
After:  [1, 0, 2, 1]

Before: [3, 1, 0, 3]
3 3 3 3
After:  [3, 1, 0, 1]

Before: [1, 1, 2, 2]
15 1 2 2
After:  [1, 1, 0, 2]

Before: [1, 2, 2, 1]
10 0 2 1
After:  [1, 0, 2, 1]

Before: [1, 1, 2, 2]
10 0 2 0
After:  [0, 1, 2, 2]

Before: [3, 1, 3, 2]
6 1 3 1
After:  [3, 0, 3, 2]

Before: [0, 3, 0, 2]
9 0 1 2
After:  [0, 3, 0, 2]

Before: [0, 2, 3, 1]
9 0 1 2
After:  [0, 2, 0, 1]

Before: [3, 3, 0, 2]
2 3 3 3
After:  [3, 3, 0, 0]`
.split('\n')
.reduce((array, line, i, lines) => {
    if (i % 4 === 0) {
        array.push([line, lines[i + 1], lines[i + 2]].join('\n'))
    }
    return array;
}, [])
.map(text =>
    text.split('\n').
    slice(0, 3)
    .map((line, i) => {
        if (i === 1)
            return line.split(' ').map(val => parseInt(val));
        return line.slice(9, -1).split(', ').map(val => parseInt(val));
    })
);
const testProgram = `10 3 3 3
10 0 0 2
9 0 0 1
5 1 1 1
15 3 2 3
9 3 1 3
0 0 3 0
12 0 1 2
10 2 2 0
10 1 1 3
11 0 3 0
9 0 2 0
0 2 0 2
12 2 0 1
10 2 3 2
10 0 1 3
10 2 0 0
4 3 2 3
9 3 2 3
0 3 1 1
12 1 2 3
9 3 0 1
5 1 3 1
7 0 1 2
9 2 3 2
0 3 2 3
9 2 0 1
5 1 1 1
10 3 3 2
1 0 2 1
9 1 2 1
0 3 1 3
10 0 3 1
1 0 2 0
9 0 3 0
0 3 0 3
12 3 0 1
9 2 0 2
5 2 2 2
10 3 3 0
9 0 0 3
5 3 1 3
7 2 0 3
9 3 3 3
9 3 1 3
0 3 1 1
12 1 3 0
10 2 2 1
10 1 2 3
10 0 0 2
10 2 3 1
9 1 2 1
9 1 1 1
0 0 1 0
10 2 2 2
10 0 2 1
5 3 1 1
9 1 2 1
0 1 0 0
10 3 0 1
10 0 3 2
9 1 0 3
5 3 2 3
6 1 3 2
9 2 2 2
0 0 2 0
9 3 0 1
5 1 0 1
9 1 0 2
5 2 0 2
10 1 2 3
5 3 1 1
9 1 3 1
0 1 0 0
12 0 1 1
10 3 0 2
10 3 2 0
10 3 2 3
15 0 2 2
9 2 2 2
0 1 2 1
12 1 2 2
10 3 1 1
10 0 2 0
10 2 2 3
6 1 3 0
9 0 2 0
9 0 2 0
0 2 0 2
12 2 2 3
10 0 3 2
10 3 2 0
1 2 0 1
9 1 1 1
0 1 3 3
12 3 1 2
10 1 0 1
10 1 2 3
9 3 0 0
5 0 0 0
0 1 3 1
9 1 2 1
0 2 1 2
12 2 1 1
9 3 0 0
5 0 2 0
9 1 0 2
5 2 1 2
10 3 1 3
6 3 0 2
9 2 1 2
0 1 2 1
12 1 0 3
10 3 1 1
10 1 3 2
7 0 1 0
9 0 3 0
0 3 0 3
10 0 3 1
10 1 0 0
9 2 0 2
5 2 3 2
9 0 2 0
9 0 1 0
0 3 0 3
12 3 3 1
10 1 2 0
10 2 1 2
9 0 0 3
5 3 2 3
12 0 2 2
9 2 2 2
0 1 2 1
10 2 0 2
14 0 3 2
9 2 3 2
0 1 2 1
10 3 2 2
10 2 2 0
10 0 3 3
1 0 2 2
9 2 1 2
0 2 1 1
12 1 2 0
10 2 3 3
10 2 0 2
10 3 1 1
8 2 3 2
9 2 1 2
9 2 3 2
0 2 0 0
12 0 3 1
10 3 1 2
10 3 3 3
9 2 0 0
5 0 2 0
1 0 2 0
9 0 2 0
0 1 0 1
12 1 0 3
10 3 1 0
9 3 0 1
5 1 3 1
15 0 2 2
9 2 3 2
0 2 3 3
9 3 0 1
5 1 1 1
10 1 0 0
10 0 2 2
9 1 2 2
9 2 2 2
0 2 3 3
12 3 3 0
10 2 3 3
10 3 0 1
10 0 1 2
2 2 3 3
9 3 1 3
9 3 1 3
0 0 3 0
12 0 1 1
10 3 1 0
10 3 0 3
9 1 0 2
5 2 2 2
7 2 0 0
9 0 3 0
0 1 0 1
12 1 2 3
10 2 3 0
9 1 0 1
5 1 3 1
10 1 2 2
7 0 1 2
9 2 2 2
9 2 3 2
0 2 3 3
12 3 1 0
10 1 0 1
10 2 0 2
9 3 0 3
5 3 2 3
14 1 3 3
9 3 2 3
9 3 1 3
0 3 0 0
12 0 1 1
9 3 0 0
5 0 1 0
9 2 0 3
5 3 0 3
4 3 2 3
9 3 2 3
0 3 1 1
12 1 3 2
10 3 3 1
10 2 0 0
10 2 3 3
7 0 1 3
9 3 3 3
0 3 2 2
12 2 2 0
10 0 2 2
10 1 1 3
5 3 1 1
9 1 1 1
0 1 0 0
12 0 1 1
9 1 0 2
5 2 2 2
10 0 0 3
10 3 0 0
4 3 2 3
9 3 1 3
9 3 3 3
0 1 3 1
12 1 3 0
10 2 2 3
9 2 0 2
5 2 0 2
10 0 0 1
2 2 3 2
9 2 2 2
0 0 2 0
12 0 2 1
10 0 0 0
10 0 1 2
2 2 3 0
9 0 1 0
0 0 1 1
10 3 2 0
10 2 3 2
9 3 0 3
5 3 0 3
4 3 2 0
9 0 2 0
0 1 0 1
12 1 2 0
10 0 2 2
10 2 2 3
9 0 0 1
5 1 1 1
2 2 3 1
9 1 1 1
0 1 0 0
10 2 0 2
9 1 0 1
5 1 2 1
8 1 3 2
9 2 2 2
9 2 1 2
0 2 0 0
12 0 2 2
9 2 0 0
5 0 2 0
9 3 0 3
5 3 1 3
11 0 3 1
9 1 3 1
0 2 1 2
12 2 2 0
9 0 0 2
5 2 1 2
10 0 1 1
5 3 1 3
9 3 3 3
0 0 3 0
12 0 3 1
9 3 0 2
5 2 3 2
10 2 3 0
10 3 2 3
1 0 2 3
9 3 3 3
9 3 2 3
0 1 3 1
12 1 2 3
10 3 0 0
10 2 2 1
13 1 2 2
9 2 2 2
9 2 1 2
0 3 2 3
10 0 2 1
10 1 3 0
10 0 1 2
9 0 2 2
9 2 2 2
0 2 3 3
12 3 3 0
10 1 1 3
10 1 2 1
9 3 0 2
5 2 3 2
9 3 2 1
9 1 2 1
9 1 2 1
0 0 1 0
12 0 1 1
10 0 3 2
10 2 0 3
10 1 1 0
2 2 3 2
9 2 2 2
0 1 2 1
12 1 2 3
10 3 2 0
10 2 0 2
10 3 1 1
7 2 0 0
9 0 1 0
0 3 0 3
12 3 2 0
10 1 2 3
10 3 2 2
5 3 1 1
9 1 1 1
0 1 0 0
12 0 3 3
10 1 2 0
9 0 0 1
5 1 2 1
10 2 0 2
12 0 2 0
9 0 3 0
0 0 3 3
10 2 2 0
10 1 1 2
10 3 0 1
7 0 1 1
9 1 3 1
9 1 2 1
0 3 1 3
12 3 1 2
10 3 0 0
10 3 3 1
10 2 2 3
6 0 3 0
9 0 2 0
0 0 2 2
10 2 0 1
9 0 0 0
5 0 0 0
10 0 0 3
10 3 0 0
9 0 1 0
9 0 2 0
0 2 0 2
10 2 0 3
9 3 0 0
5 0 0 0
8 1 3 1
9 1 3 1
9 1 3 1
0 1 2 2
12 2 0 3
10 3 1 2
9 3 0 1
5 1 3 1
10 2 2 0
1 0 2 2
9 2 3 2
0 2 3 3
12 3 0 1
10 2 2 2
10 1 0 3
11 0 3 2
9 2 1 2
0 1 2 1
10 0 2 2
11 0 3 0
9 0 2 0
9 0 2 0
0 0 1 1
12 1 0 2
9 2 0 1
5 1 0 1
9 0 0 0
5 0 1 0
10 0 0 3
5 0 1 3
9 3 2 3
0 3 2 2
12 2 0 0
9 2 0 2
5 2 3 2
10 1 3 1
10 0 2 3
9 1 2 1
9 1 2 1
0 1 0 0
9 0 0 1
5 1 3 1
10 2 2 2
4 3 2 1
9 1 2 1
9 1 3 1
0 0 1 0
12 0 2 2
9 1 0 0
5 0 2 0
9 0 0 1
5 1 0 1
8 0 3 3
9 3 1 3
0 2 3 2
12 2 2 1
9 2 0 3
5 3 1 3
10 3 2 0
10 3 1 2
9 3 2 0
9 0 2 0
9 0 1 0
0 1 0 1
12 1 0 2
10 0 3 1
10 2 3 0
11 0 3 3
9 3 2 3
0 3 2 2
10 2 2 1
10 1 3 3
11 0 3 0
9 0 1 0
0 2 0 2
12 2 2 1
10 2 0 0
10 3 1 3
10 3 3 2
13 0 2 2
9 2 3 2
0 2 1 1
12 1 2 2
10 3 2 1
9 0 0 3
5 3 1 3
10 1 1 0
5 3 1 1
9 1 1 1
0 1 2 2
12 2 0 3
10 2 3 0
9 0 0 1
5 1 1 1
10 3 2 2
13 0 2 0
9 0 1 0
0 3 0 3
12 3 1 2
9 3 0 0
5 0 2 0
10 2 3 1
10 2 1 3
8 1 3 0
9 0 3 0
0 2 0 2
10 2 3 0
10 1 1 3
11 0 3 3
9 3 3 3
0 3 2 2
12 2 2 0
10 3 3 2
10 0 2 3
10 3 0 1
2 3 2 2
9 2 2 2
0 0 2 0
12 0 0 3
10 2 0 2
10 2 2 0
7 0 1 1
9 1 2 1
0 3 1 3
12 3 2 1
10 3 2 3
10 3 1 2
13 0 2 3
9 3 1 3
9 3 2 3
0 3 1 1
10 3 3 0
9 3 0 3
5 3 2 3
10 0 3 2
1 2 0 0
9 0 3 0
0 1 0 1
10 2 0 0
10 2 2 2
3 0 3 3
9 3 3 3
9 3 3 3
0 3 1 1
12 1 1 0
10 0 1 1
10 1 1 2
10 3 3 3
10 2 3 2
9 2 3 2
0 0 2 0
10 0 1 2
15 3 2 2
9 2 1 2
0 2 0 0
12 0 0 1
10 1 1 0
10 0 3 3
9 0 0 2
5 2 2 2
12 0 2 2
9 2 3 2
0 1 2 1
12 1 0 0
10 2 2 1
10 3 1 2
8 1 3 3
9 3 3 3
0 3 0 0
10 3 2 1
10 1 3 3
10 0 3 2
9 3 2 2
9 2 1 2
9 2 1 2
0 2 0 0
10 1 3 1
10 0 1 2
10 2 0 3
14 1 3 3
9 3 3 3
9 3 1 3
0 3 0 0
12 0 2 2
10 2 2 3
10 1 2 0
14 1 3 0
9 0 2 0
9 0 1 0
0 0 2 2
10 0 1 0
10 1 2 3
0 3 3 3
9 3 2 3
0 2 3 2
10 0 3 1
10 1 0 3
5 3 1 3
9 3 1 3
9 3 2 3
0 3 2 2
12 2 1 3
10 1 3 0
10 3 2 2
9 0 0 1
5 1 1 1
9 1 2 2
9 2 3 2
9 2 2 2
0 2 3 3
12 3 2 2
10 2 1 0
10 2 2 3
8 0 3 3
9 3 2 3
0 2 3 2
12 2 0 0
10 1 3 3
10 2 3 1
10 0 1 2
9 3 2 3
9 3 3 3
0 3 0 0
12 0 1 1
10 0 3 3
9 0 0 0
5 0 3 0
10 2 2 2
4 3 2 2
9 2 3 2
0 2 1 1
10 2 2 2
10 0 0 0
4 3 2 0
9 0 2 0
9 0 2 0
0 0 1 1
12 1 3 0
9 0 0 1
5 1 3 1
4 3 2 3
9 3 1 3
0 0 3 0
12 0 2 3
10 3 2 2
10 0 2 1
9 2 0 0
5 0 2 0
10 2 1 0
9 0 2 0
0 0 3 3
12 3 3 1
10 2 0 0
10 1 0 3
1 0 2 2
9 2 1 2
9 2 2 2
0 1 2 1
12 1 0 0
10 0 0 2
10 3 0 3
9 0 0 1
5 1 2 1
15 3 2 1
9 1 2 1
0 1 0 0
12 0 3 1
10 1 0 0
9 3 0 2
5 2 3 2
9 3 0 3
5 3 0 3
0 0 0 0
9 0 1 0
0 0 1 1
12 1 3 0
10 2 1 1
10 1 0 3
13 1 2 1
9 1 2 1
9 1 2 1
0 1 0 0
12 0 1 3
10 2 0 1
10 2 1 2
10 3 2 0
6 0 1 2
9 2 1 2
0 3 2 3
10 2 1 2
10 1 1 1
13 2 0 0
9 0 1 0
9 0 1 0
0 0 3 3
12 3 1 0
10 0 1 3
10 3 2 1
8 2 3 2
9 2 3 2
0 2 0 0
12 0 1 1
10 3 2 2
10 2 3 0
10 1 3 3
1 0 2 3
9 3 2 3
9 3 2 3
0 1 3 1
12 1 0 2
10 1 0 1
10 1 0 3
14 1 0 0
9 0 3 0
9 0 3 0
0 0 2 2
12 2 1 1
10 2 0 0
10 2 3 2
10 0 0 3
4 3 2 0
9 0 2 0
0 1 0 1
12 1 3 3
10 2 1 0
10 1 2 1
14 1 0 2
9 2 3 2
0 2 3 3
10 0 0 0
10 0 3 2
9 1 2 2
9 2 3 2
0 3 2 3
12 3 1 2
10 2 0 0
10 2 2 3
9 2 0 1
5 1 0 1
3 0 3 1
9 1 2 1
0 1 2 2
10 0 1 1
10 1 1 0
5 0 1 1
9 1 1 1
0 2 1 2
12 2 3 0
10 2 1 2
10 1 2 1
10 0 2 3
4 3 2 3
9 3 3 3
9 3 1 3
0 0 3 0
12 0 3 3
10 1 3 2
9 2 0 0
5 0 0 0
10 3 2 1
15 1 2 1
9 1 1 1
0 3 1 3
10 3 0 2
10 2 1 1
9 2 0 0
5 0 3 0
13 1 0 0
9 0 2 0
9 0 3 0
0 0 3 3
10 0 1 2
10 1 2 1
9 2 0 0
5 0 1 0
9 0 2 2
9 2 1 2
0 2 3 3
9 2 0 0
5 0 3 0
10 0 1 2
9 1 0 1
5 1 0 1
1 2 0 0
9 0 2 0
0 0 3 3
10 3 2 0
10 2 1 1
10 1 3 2
10 2 0 2
9 2 3 2
0 3 2 3
12 3 1 2
10 2 1 3
8 1 3 0
9 0 2 0
0 0 2 2
12 2 3 0
10 2 0 2
10 3 3 3
10 3 0 1
7 2 1 3
9 3 2 3
0 3 0 0
12 0 1 2
10 1 3 3
9 0 0 0
5 0 2 0
7 0 1 0
9 0 2 0
9 0 3 0
0 2 0 2
10 2 3 3
10 1 1 1
10 2 2 0
14 1 0 1
9 1 3 1
9 1 2 1
0 2 1 2
12 2 1 1
10 0 0 2
10 0 0 0
10 1 1 3
9 3 2 2
9 2 1 2
0 2 1 1
10 1 2 0
10 0 1 2
0 3 3 3
9 3 3 3
0 3 1 1
10 2 0 2
10 0 1 3
10 3 1 0
8 2 3 2
9 2 2 2
9 2 2 2
0 1 2 1
10 2 1 3
10 1 3 0
9 1 0 2
5 2 2 2
12 0 2 0
9 0 1 0
0 1 0 1
12 1 1 2
10 2 0 0
9 2 0 1
5 1 0 1
3 0 3 0
9 0 2 0
0 2 0 2
12 2 1 1
10 0 1 3
10 1 3 0
10 2 1 2
4 3 2 0
9 0 2 0
9 0 2 0
0 1 0 1
12 1 1 0
10 3 0 2
10 1 2 1
10 1 2 3
0 3 3 3
9 3 3 3
9 3 2 3
0 0 3 0
12 0 1 3
10 3 3 0
10 2 2 2
10 2 1 1
13 2 0 1
9 1 2 1
0 1 3 3
12 3 0 2
10 3 0 3
10 2 1 1
13 1 0 3
9 3 2 3
0 3 2 2
12 2 2 1
10 2 2 0
10 1 0 3
9 3 0 2
5 2 0 2
11 0 3 3
9 3 3 3
0 3 1 1
10 0 1 3
10 3 2 2
13 0 2 2
9 2 1 2
0 1 2 1
12 1 3 3
10 2 3 1
9 3 0 0
5 0 3 0
10 2 3 2
13 2 0 2
9 2 1 2
0 2 3 3
12 3 3 0
10 2 0 2
10 0 1 3
4 3 2 2
9 2 1 2
0 0 2 0
12 0 2 2
10 2 2 3
10 0 1 1
10 2 3 0
3 0 3 3
9 3 2 3
0 3 2 2
12 2 0 1
10 3 1 3
10 2 0 2
9 1 0 0
5 0 1 0
12 0 2 2
9 2 1 2
9 2 2 2
0 2 1 1
12 1 0 3
10 3 2 2
9 3 0 0
5 0 2 0
10 2 1 1
13 1 2 1
9 1 1 1
0 3 1 3
9 0 0 0
5 0 3 0
9 2 0 1
5 1 3 1
10 0 2 2
1 2 0 2
9 2 2 2
9 2 1 2
0 2 3 3
12 3 0 1
10 2 3 0
10 0 0 2
10 2 1 3
3 0 3 2
9 2 3 2
0 1 2 1
10 1 1 3
9 2 0 2
5 2 1 2
11 0 3 0
9 0 2 0
0 0 1 1
12 1 1 0`
.split('\n')
.map(line => line.split(' ').map(val => parseInt(val)));

str = str + `
Actual
${day16(input, testProgram)}
${Date.now() - then}ms for actual input`;

console.log(str);