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

function day21(input) {
    const lines = input.split('\n')
    const ipRegister = parseInt(lines.shift().split(' ')[1])

    const instructions = lines.map(line => {
        const args = line.split(' ');
        const name = args.shift();
        return {
            name: name,
            args: args.map(val => parseInt(val))
        }
    })

    const registers = new Array(6)

    registers.fill(0)

    let ip = 0
    let instructionsExecuted = 0

    // Part 1 - Find the first value of r3 when we reach the instruction the program can exit at
    // since the program only exits if r0 === r3
    while (ip >= 0 && ip < instructions.length && ip !== 29) {
        const instruction = instructions[ip]
        registers[ipRegister] = ip
        const func = opcodeFuncsByName.get(instruction.name)
        func(registers, instruction.args[0], instruction.args[1], instruction.args[2])
        ++instructionsExecuted
        ip = registers[ipRegister]
        ++ip
    }
    
    const r0ForLeastInstructions = registers[3]

    // Part 2 - Find last unique value of r3 when hitting the exit instruction
    // since when r3 repeats we would have already exited
    registers.fill(0)
    ip = 0
    instructionsExecuted = 5
    instructionsPerUniqueR0 = new Map()

    let continue6 = true, continue8 = true
    inst6: do {
        continue8 = true
        registers[4] = registers[3] | 65536; instructionsExecuted++
        registers[3] = 2176960; instructionsExecuted++
        inst8: do {
            registers[1] = registers[4] & 255; instructionsExecuted++
            registers[3] += registers[1]; instructionsExecuted++
            registers[3] &= 16777215; instructionsExecuted++
            registers[3] *= 65899; instructionsExecuted++
            registers[3] &= 16777215; instructionsExecuted++
            registers[1] = 256 > registers[4]; instructionsExecuted++
            instructionsExecuted++ // if (jump 15/16)
            if (registers[1]) {
                // r1 = r3 === r0
                registers[1] = (instructionsPerUniqueR0.has(registers[3])); instructionsExecuted++ 
                instructionsExecuted++ // if (jump 30/31)
                if (registers[1]) {
                    continue6 = false
                    break
                }
                instructionsPerUniqueR0.set(registers[3], instructionsExecuted)
                instructionsExecuted++ // jump 6
                continue8 = false
                break
            }
            // Optimized, but inaccurate instruction count
            registers[4] = Math.floor(registers[4] / 256)
            // instructionsExecuted++ // jump 17
            // registers[1] = 0; instructionsExecuted++
            // inst18: do {
            //     registers[5] = registers[1] + 1; instructionsExecuted++
            //     registers[5] *= 256; instructionsExecuted++
            //     registers[5] = registers[5] > registers[4]; instructionsExecuted++
            //     instructionsExecuted++ // if (jump 22/23)
            //     if (registers[5]) {
            //         instructionsExecuted++ // jump 26
            //         registers[4] = registers[1]; instructionsExecuted++
            //         instructionsExecuted++ // jump 8
            //         break
            //     }
            //     instructionsExecuted++ // jump 24
            //     registers[1] += 1; instructionsExecuted++;
            //     instructionsExecuted++ // jump 18
            // } while (true)
        } while (continue8)
    } while (continue6)

    const r0s = Array.from(instructionsPerUniqueR0.entries());
    console.log(`${r0s.length} unique r0s`)
    return [r0s.shift(), r0s.pop()] // Least and most instructions
}

const input = `#ip 2
seti 123 0 3
bani 3 456 3
eqri 3 72 3
addr 3 2 2
seti 0 0 2
seti 0 6 3
bori 3 65536 4
seti 2176960 8 3
bani 4 255 1
addr 3 1 3
bani 3 16777215 3
muli 3 65899 3
bani 3 16777215 3
gtir 256 4 1
addr 1 2 2
addi 2 1 2
seti 27 7 2
seti 0 9 1
addi 1 1 5
muli 5 256 5
gtrr 5 4 5
addr 5 2 2
addi 2 1 2
seti 25 7 2
addi 1 1 1
seti 17 2 2
setr 1 7 4
seti 7 9 2
eqrr 3 0 1
addr 1 2 2
seti 5 9 2`

console.log(`r0, instructions taken`)
console.log(day21(input))

// seti 123 0 3         // 0    r3 = 123
// bani 3 456 3         // 1    r3 = r3 & 456 = 72
// eqri 3 72 3          // 2    r3 = r3 === 72 = 1
// addr 3 2 2           // 3    r2 = r3 + r2 = 1 + 3 = 4; jumps to 5
// seti 0 0 2           // 4    r2 = 0; jumps to 1

// seti 0 6 3           // 5    r3 = 0     

// Registers: [r0, 5, 0, 0, 0, 0]
// Instructions taken so far: 5
// bori 3 65536 4       // 6    r4 = r3 | 65536
// seti 2176960 8 3     // 7    r3 = 2176960
// bani 4 255 1         // 8    r1 = r4 & 255
// addr 3 1 3           // 9    r3 = r3 + r1
// bani 3 16777215 3    // 10   r3 = r3 & 16777215
// muli 3 65899 3       // 11   r3 = r3 * 65899
// bani 3 16777215 3    // 12   r3 = r3 & 16777215
// gtir 256 4 1         // 13   r1 = 256 > r4
// addr 1 2 2           // 14   r2 = r1 + r2; jumps to 15 or 16
// addi 2 1 2           // 15   r2 = r2 + 1 = 16; jumps to 17
// seti 27 7 2          // 16   r2 = 27; jumps to 28
// seti 0 9 1           // 17   r1 = 0
// addi 1 1 5           // 18   r5 = r1 + 1 = 1
// muli 5 256 5         // 19   r5 = r5 * 256 = 256
// gtrr 5 4 5           // 20   r5 = r5 > r4
// addr 5 2 2           // 21   r2 = r5 + r2; jumps to 22 or 23
// addi 2 1 2           // 22   r2 = r2 + 1 = 23; jumps to 24
// seti 25 7 2          // 23   r2 = 25; jumps to 26
// addi 1 1 1           // 24   r1 = r1 + 1
// seti 17 2 2          // 25   r2 = 17; jumps to 18
// setr 1 7 4           // 26   r4 = r1
// seti 7 9 2           // 27   r2 = 7; jumps to 8
// eqrr 3 0 1           // 28   r1 = r3 === r0
// addr 1 2 2           // 29   r2 = r1 + r2; jumps to 30 or 31 (end)
// seti 5 9 2`          // 30   r2 = 5; jumps to 6