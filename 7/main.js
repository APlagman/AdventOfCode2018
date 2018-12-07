const sample = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;
const sampleWorkers = 2;
const input = `Step Q must be finished before step O can begin.
Step Z must be finished before step G can begin.`;
const workers = 5;

function lines(input) { return input.split(`\n`); }

function rule(line) { return { condition: line[5], then: line[36] } };

function keys(input) {
    const keys = new Set();
    lines(input).map(line => rule(line))
    .forEach(rule => {
        keys.add(rule.condition);
        keys.add(rule.then);
    });
    return keys;
}

function links(input) {
    const rules = lines(input).map(line => rule(line));

    const conditions = new Map();
    keys(input).forEach(key => conditions.set(key, new Array()));

    rules.forEach(rule => {
        conditions.get(rule.then).push(rule.condition);
    });

    return conditions;
}

const samplePart1 = ticks(sample, 1, 0, () => 1);
const part1 = ticks(input, 1, 0, () => 1);

console.log(`${part1}`);
console.log(`Sample 1 passed: ${JSON.stringify(samplePart1) === JSON.stringify(['CABDFE', 6])}`);

function cost(ch, handicap) {
    return ch.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + handicap;
}

function doTick(workers, cb) {
    workers.forEach(worker => {
        if (worker[1] > 0)
            --worker[1];
        if (worker[1] === 0 && worker[0]) {
            if (cb)
                cb(worker[0]);
            worker[0] = null;
        }
    });
}

function getNext(conditions) {
    if (conditions.size === 0)
        return null;

    const remaining = Array.from(conditions.keys());

    remaining.sort((a,b) => {
        const diff = conditions.get(a).length - conditions.get(b).length;
        if (diff === 0)
            return a.charCodeAt(0) - b.charCodeAt(0);
        return diff;
    });

    if (conditions.get(remaining[0]).length > 0)
        return null;

    return remaining[0];
}

function ticks(input, numWorkers, handicap, cost) {
    let ticks = 0;
    let order = "";

    const conditions = links(input);

    let workers = new Array(numWorkers);
    for (let i = 0; i < numWorkers; ++i)
        workers[i] = [null, 0];

    while (conditions.size > 0) {
        let free = workers.findIndex(worker => worker[0] == null);
        let next = getNext(conditions);

        while (free >= 0 && next != null) {
            conditions.delete(next);
            workers[free] = [next, cost(next, handicap)];
            free = workers.findIndex(worker => worker[0] == null);
            next = getNext(conditions);
        }

        doTick(workers, (label) => {
            order += label;
            for (let key of conditions.keys()) {
                conditions.set(key, conditions.get(key).reduce((links, cur) => {
                    if (cur !== label)
                        links.push(cur);
                    return links;
                }, new Array()));
            }
        });
        ++ticks;
    }

    while (workers.findIndex(worker => worker[1] > 0) >= 0) {
        doTick(workers, (label) => {
            order += label;
        });
        ++ticks;
    }

    return [order, ticks];
}

const samplePart2 = ticks(sample, sampleWorkers, 0, cost);
const part2 = ticks(input, workers, 60, cost);

console.log(`${part2}`);
console.log(`Sample 2 passed: ${JSON.stringify(samplePart2) === JSON.stringify(['CABFDE', 15])}`);