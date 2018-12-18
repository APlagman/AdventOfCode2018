function update(acres, x, y, result, width, height) {
    let open = 0, trees = 0, lumber = 0;
    for (let dy = -1; dy <= 1; ++dy) {
        for (let dx = -1; dx <= 1; ++dx) {
            if (dx === 0 && dy === 0)
                continue;
            if ((y + dy) < 0 || (x + dx) < 0 || (y + dy) >= height || (x + dx) >= width)
                continue;
            switch (acres[y + dy][x + dx]) {
                case '.':
                    ++open;
                    break;
                case '|':
                    ++trees;
                    break;
                case '#':
                    ++lumber;
                    break;
            }
        }
    }
    if (acres[y][x] === '.' && trees >= 3) {
        result[y][x] = '|';
    }
    else if (acres[y][x] === '|' && lumber >= 3) {
        result[y][x] = '#';
    }
    else if (acres[y][x] === '#' && lumber >= 1 && trees >= 1) {
        result[y][x] = '#';
    }
    else if (acres[y][x] === '#') {
        result[y][x] = '.';
    }
}

function copy(array, width, height) {
    const result = new Array(height);
    for (let y = 0; y < height; ++y) {
        result[y] = new Array(width);
        for (let x = 0; x < width; ++x)
            result[y][x] = array[y][x];
    }
    return result;
}

function to_s(array) {
    return array.reduce((str, line) => {
        return str + line.join('');
    }, "");
}

function day18(input, numIterations) {
    let acres = input.split('\n').map(line => line.split(''));
    const height = acres.length;
    const width = acres[0].length;

    const states = new Map();

    for (var previousIterations = 0; previousIterations < numIterations; ++previousIterations) {
        states.set(to_s(acres), previousIterations);
        const after = copy(acres, width, height);

        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                update(acres, x, y, after, width, height);
            }
        }

        acres = after;

        const key = to_s(acres);
        if (states.has(key)) {
            const iterationsBeforeMatch = states.get(key);
            const finishedIterations = previousIterations + 1;
            const iterationsRemaining = numIterations - finishedIterations;
            const loopLength = finishedIterations - iterationsBeforeMatch;
            const iterationsBeforeFinalState = iterationsBeforeMatch + (iterationsRemaining % loopLength);

            const finalState = Array.from(states.entries()).find(kvp => kvp[1] === iterationsBeforeFinalState)[0];

            let wood = 0, lumber = 0;
            finalState.split('').forEach(ch => {
                if (ch === '|')
                    ++wood;
                else if (ch === '#')
                    ++lumber;
            });
            return wood * lumber;
        }
    }

    let wood = 0, lumber = 0;
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            if (acres[y][x] === '|')
                ++wood;
            else if (acres[y][x] === '#')
                ++lumber;
        }
    }
    return wood * lumber;
}

const input = 
`........#.##..#|#|.#.....|......#..#.|..##..||.#..
#|##.|||.|..|||......|.##.#|#|....||#.#...#...#..#
..##...#|#..|#.|..#||#...|#....|#...#|#.|.||...|..
.....#|||.|.#...###|....|#..#.#.#.|..#||#|....|#.|
....|.....#.||.#..#...#|....|||..#....##...|..|.#|
||...|###..|..|||..|#.##|.####.#...|.||.|....|.##.
..#.#.###..||......#|#|.|....#|.#|.|...#....#...#|
.|..||||||...#.##..|.#||.#|##|..#.#..##..#...|#...
.|.....||...#.#|.##|..|.##||..#.#..|..#.#.#..|.#|.
||...|#........#.|..##|.|..#...#...#|#|..||.|....#
#||.|.|..|.......##....|..#||#.#|.|||......|..||..
.....#.|||.....|.#.#.......#.|..#.|.....|.|.#...#.
...#.##.#.||#.#|.#.##..#.||#.#.#|#.||.||.|......#.
|.|...#|.|####|.|..#.#|....|......|....|...||#||..
.#...#.#......|...#.....|.....|.#|...##|||...#.|#.
||##.#...#.|...##..##.||#...#|...|##.##...#||..#|.
|.|#.||..|##.|.#.|..#..|.##.#.......#...|....||...
.|.......#..##...|.|..|#.#....|#|..##|#|.##|.|.|#.
.|....|.#|||#.#..#..|||.....||...#|.#..|..#.#...#.
...#..###.#|.##||.#.|.||###..|..|#.|#..||......||.
..##.......##|.....#...|#|..##|.#.|||.|#....|##...
#...#|##|......##|...|#..#.|..##..#..#.|##.##|#..#
|.#|.....|..#...|....|...#....#|..#.....||...|#|.|
##...#.....#.....|#|.......|....####.#..##.|.##...
.....|...|#|#..|#|.|..##.|..|....##..||.#...|..|.|
.|..|....##.||||.##|.#...|..|#|.#.|####.|..|##.#..
#.........|##.#|..##|...|........|..|....|..#...##
.#.|...#...#...|.|...|..|.#.|....#..|.|..|..#|....
.....#.....#|.#....|....##...##....###....#.|...|.
||.....|.|.##|.##||.#|#.##|.#..|#####|...|...||#.#
...#||....#.....##.|##|.##|#.##.#|.|.....#........
..##.....||..#..#.|..##...#.|.|.|.|...|.#.|..|....
|##..|..........##..#|...|......||.#....#....|..#.
...#..|.#.|...|.##|.##..##..|.|....#||#|##..||||..
#...##......|..|#...#.#.|#||..#...|.#...|..###.||.
|#.......|#.|##|....|.....#..||.|#|#...#|....|..#|
.|.....#|##.|.#...#..#||#.....|....#||.#|.##.##.#|
|#..###..#..|#.....##...||.|.|.#.#|.||..||.||#|#..
||||#....|#..|.|...|...||....|...#....#.##...#|...
...||##||#......|#.#..#..|.....|...#..#|...#...|||
.|#.|.|....|...#.....|#....|..#.#...#...||..##|..|
||#.|##.|...|.##......##|#..#..#.#.#.....|#|##.##.
|.#.....||.....#.#...|...|..|#|..|..#...|....|...|
###..#.#......#|..#....#......|##.##....|||.|..#|.
..#.|.#...#..|#####|.....##.|.|#......|..||.#|....
.#||.|.##..#.|..##......|..|.|#..|.....#.....|#|..
|##.#......#.#.#.#|||#|....#...#.|.........|||.#..
|......||.|..#.|#||...||.#.#.##..#..#.#....#.#..#|
#.|..##.....#..|...|#...#...|.......|.|..|#|......
##...#....#..#..#....|...#|#.||.|...|.#..###|##|.|`;
console.log(day18(input, 10), day18(input, 1000000000));