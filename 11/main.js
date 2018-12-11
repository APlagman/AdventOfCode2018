const input = `6392`;
const sample = `18`;
const sample2 = `42`;

function day11(input) {
    const serial = parseInt(input);

    function rackID(x) { return x + 10 };
    function powerLevel(x, y) {
        let power = rackID(x + 1);
        power *= (y + 1);
        power += serial;
        power *= rackID(x + 1);
        power = Math.floor(power / 100);
        power %= 10;
        power -= 5;
        return power;
    }

    // Calculate power for all squares
    const grid = [];
    for (let y = 0; y < 300; ++y) {
        for (let x = 0; x < 300; ++x) {
            grid.push(powerLevel(x, y));
        }
    }

    // Find square of any size w/ maximum power
    let best = [null, null, null, -1000000]; // Seems good enough
    let best3by3 = [null, null, -1000000];
    let partials = new Array(grid.length);
    partials.fill(0);
    for (let size = 1; size <= 300; ++size) {
        // All squares of size [dim,dim]
        for (let y = 0; y < (300 - (size - 1)); ++y) {
            for (let x = 0; x < 300 - (size - 1); ++x) {
                // Use partial sums to optimize
                let power = partials[y * 300 + x];
                // Right side of new square
                for (let dy = 0; dy < size - 1; ++dy) {
                    power += grid[(y + dy) * 300 + (x + size - 1)];
                }
                // Bottom of new square
                for (let dx = 0; dx < size; ++dx) {
                    power += grid[(y + size - 1) * 300 + (x + dx)];
                }
                if (power > best[3]) {
                    best = [x + 1, y + 1, size, power];
                }
                if (size === 3 && power > best3by3[2])
                    best3by3 = [x + 1, y + 1, power];
                partials[y * 300 + x] = power;
            }
        }
    }
        
    return [best, best3by3];
}

console.log(`serial, [ x, y, size, best ], [ x, y, best3by3 ]`);
console.log(sample, day11(sample));
console.log(sample2, day11(sample2));
console.log(input, day11(input));