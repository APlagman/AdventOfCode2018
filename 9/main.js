const input = `425 players; last marble is worth 7084800 points`;
const sample = [`9 players; last marble is worth 25 points`,
`10 players; last marble is worth 1618 points`,
`13 players; last marble is worth 7999 points`,
`17 players; last marble is worth 1104 points`,
`21 players; last marble is worth 6111 points`,
`30 players; last marble is worth 5807 points`];
const sampleCheck = [32, 8317, 146373, 2764, 54718, 37305];

function parse(line) {
    return [parseInt(line.split(' ')[0]), parseInt(line.split(' ')[6])];
}

function highScore(line) {
    const parsed = parse(line);
    const scores = new Array(parsed[0]);
    scores.fill(0);
    const lastMarble = parsed[1];

    let currentMarble = { val: 0, next: null, prev: null };
    currentMarble.next = currentMarble;
    currentMarble.prev = currentMarble;
    let currentPlayer = 0;

    for (let nextMarble = 1; nextMarble <= lastMarble; ++nextMarble) {
        if (nextMarble % 23 === 0) {
            scores[currentPlayer] += nextMarble;

            let counterClockwise7 = currentMarble.prev.prev.prev.prev.prev.prev.prev;

            scores[currentPlayer] += counterClockwise7.val;
            
            const prev = counterClockwise7.prev;
            prev.next = counterClockwise7.next;
            counterClockwise7.next = prev;

            currentMarble = prev.next;
        }
        else {
            const clockwise1 = currentMarble.next;
            const clockwise2 = clockwise1.next;
            clockwise1.next = { val: nextMarble, next: clockwise2, prev: clockwise1 };
            currentMarble = clockwise1.next;
            clockwise2.prev = clockwise1.next;
        }

        ++currentPlayer;
        currentPlayer %= scores.length;
    }

    return scores;
}

for (let i = 0; i < sample.length; ++i) {
    const highestScore = highScore(sample[i]).reduce((max, next) => Math.max(max, next), 0);
    console.log(`Sample ${i}: ${highestScore}, ${sampleCheck[i]}`);
}
const highestScore = highScore(input).reduce((max, next) => Math.max(max, next), 0);
console.log(highestScore);