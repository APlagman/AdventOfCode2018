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

function day19(input) {
    const REGISTERS = [1, 0, 0, 0, 0, 0]

    let instructions = input.split('\n')
    const ipBinding = parseInt(instructions.shift().split(' ')[1])
    let ipVal = 0
    instructions = instructions.map(line => {
        const args = line.split(' ');
        const name = args.shift();
        return {
            name: name,
            args: args.map(val => parseInt(val))
        }
    })
    while (ipVal >= 0 && ipVal < instructions.length) {
        if (ipVal >= 17)
            console.log(REGISTERS, ipVal)
        const instruction = instructions[ipVal]
        REGISTERS[ipBinding] = ipVal
        const func = opcodeFuncsByName.get(instruction.name)
        func(REGISTERS, instruction.args[0], instruction.args[1], instruction.args[2])
        ipVal = REGISTERS[ipBinding]
        ++ipVal
    }
    console.log(REGISTERS, ipVal)

    return REGISTERS[0]
}

function sumFactors(val) {
    let sum = 0
    for (let i = 1; i <= val; ++i) {
        if ((val % i) === 0)
            sum += i
    }
    return sum
}

console.log(sumFactors(875))
console.log(sumFactors(10551275))

// #ip 2
// Every instruction using r2 replaces it with the current instruction #
// Any instruction that modifies r2 causes a jump rather than advancing to the next instruction
// addi 2 16 2  // 0      r2 = r2 (0) + 16; jumps to inst 17

/* Factor summing loop
seti 1 1 1   // 1      r1 = 1
seti 1 4 3   // 2      r3 = 1
mulr 1 3 5   // 3      r5 = r1 * r3
eqrr 5 4 5   // 4      r5 = (r5 == r4)
addr 5 2 2   // 5      r2 = r5 + r2 (5); if r5 == 1 (r1 and r3 are factors of r4) jumps to inst 7 else 6
addi 2 1 2   // 6      r2 = r2 (6) + 1; jumps to inst 8
addr 1 0 0   // 7      r0 = r0 + r1 (adds factor to sum)
addi 3 1 3   // 8      r3 = r3 + 1 (increments 2nd number for factor)
gtrr 3 4 5   // 9      r5 = (r3 > r4)
addr 2 5 2   // 10     r2 = r2 (10) + r5; if r5 == 1 (found factor or exhausted possible for 1st number) jumps to inst 12 else 11
seti 2 4 2   // 11     r2 = 2; jumps to inst 3
addi 1 1 1   // 12     r1 = r1 + 1 (increments 1st number for factor)
gtrr 1 4 5   // 13     r5 = (r1 > r4)
addr 5 2 2   // 14     r2 = r5 + r2 (14); if r5 == 1 (exhausted all factors) jumps to inst 16
seti 1 0 2   // 15     r2 = 1; jumps to inst 2
mulr 2 2 2   // 16     r2 = r2 (16) * r2; r2 is now 256; ends program
*/

/*
let r0 = 0
for (r1 = 1; r1 <= r4; ++r1) {
    for (r3 = 1; r3 <= r4; ++r3) {
        if (r1 * r3 === r4) {
            r0 += r1
        }
    }
}
*/

/* Setting up number to factor
addi 4 2 4   // 17     r4 = r4 + 2
mulr 4 4 4   // 18     r4 = r4 * r4
mulr 2 4 4   // 19     r4 = r2 (19) * r4
muli 4 11 4  // 20     r4 = r4 * 11
addi 5 1 5   // 21     r5 = r5 + 1
mulr 5 2 5   // 22     r5 = r5 * r2 (22)
addi 5 17 5  // 23     r5 = r5 + 17
addr 4 5 4   // 24     r4 = r4 + r5
addr 2 0 2   // 25     r2 = r2 (25) + r0; jumps to inst (25 + r0 + 1)
seti 0 9 2   // 26     r2 = 0; jumps to inst 1 (part 1 of the question; we are summing factors of 875)
setr 2 3 5   // 27     r5 = r2 (27)
mulr 5 2 5   // 28     r5 = r5 * r2 (28)
addr 2 5 5   // 29     r5 = r2 (29) + r5
mulr 2 5 5   // 30     r5 = r2 (30) * r5
muli 5 14 5  // 31     r5 = r5 * 14
mulr 5 2 5   // 32     r5 = r5 * r2 (32)
addr 4 5 4   // 33     r4 = r4 + r5
seti 0 9 0   // 34     r0 = 0
seti 0 6 2   // 35     r2 = 0; jumps to inst 1 (part 2 of the question; we are summing factors of 10551275)
*/

/* Initial register states for part 2
[1, 0, 0, 0, 0, 0] next inst 0 (Start)
[1, 0, 16, 0, 0, 0] next inst 17
[1, 0, 17, 0, 2, 0] next inst 18
[1, 0, 18, 0, 4, 0] next inst 19
[1, 0, 19, 0, 76, 0] next inst 20
[1, 0, 20, 0, 836, 0] next inst 21
[1, 0, 21, 0, 836, 1] next inst 22
[1, 0, 22, 0, 836, 22] next inst 23
[1, 0, 23, 0, 875, 39] next inst 24
[1, 0, 24, 0, 875, 39] next inst 25
[1, 0, 26, 0, 875, 39] next inst 27
[1, 0, 27, 0, 875, 27] next inst 28
[1, 0, 28, 0, 875, 756] next inst 29
[1, 0, 29, 0, 875, 785] next inst 30
[1, 0, 30, 0, 875, 23550] next inst 31
[1, 0, 31, 0, 875, 329700] next inst 32
[1, 0, 32, 0, 875, 10550400] next inst 33
[1, 0, 33, 0, 10551275,, 10550400] next inst 34
[0, 0, 34, 0, 10551275,, 10550400] next inst 35
[0, 0, 0, 0, 10551275,, 10550400] next inst 1
... Factor summing begins
*/