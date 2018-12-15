const sample = `#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######`;
const input = `################################
#####################...########
##########.##########..#########
##########.##########...########
#######....########..G.G########
######.....######..........#####
#######....######G.........#####
#######...G#####...........#####
#######..#.####............#####
########....###..G.......E######
######....####.............#####
######.G###............G......##
######..##G...#####............#
#######......#######.E........##
#######..G..#########.........##
######..#.G.#########G........##
#####.......#########G...E.E...#
#####.G.....#########....E.....#
###...###...#########..E.......#
####.###.....#######E....E...E##
####.##.......#####....#.....###
##..G.#..G............####....##
##..............##########..E###
#....#.G........#.##########.###
#.........G.......##########.###
##......GG##G.....##############
#........#####....##############
#..###.########...##############
#..#############..##############
##.#############################
##.#############################
################################`;

function parseGrid(input, elfAttackPower, units) {
    return input.split('\n')
    .map((line, y) => {
        return line.split('').map((char, x) => {
            let pos = { occupied: false, wall: false };
            if (char === 'E') {
                units.push({ x: x, y: y, goblin: false, hp: 200, attackPower: elfAttackPower });
                pos.occupied = true;
            }
            else if (char === 'G') {
                units.push({ x: x, y: y, goblin: true, hp: 200, attackPower: 3 });
                pos.occupied = true;
            }
            else if (char === '#')
                pos.wall = true;
            return pos;
        });
    });
}

function getEnemies(units, unit) {
    return units.reduce((enemies, cur) => {
        if (!(cur.x === unit.x && cur.y === unit.y) && cur.goblin !== unit.goblin)
            enemies.push(cur);
        return enemies;
    }, []);
}

function getAdjacentWalkable(grid, unit) {
    let adj = [];
    for (const delta of [[1,0],[-1,0],[0,-1],[0,1]]) { // No diagonals
        const pos = [unit.x + delta[0], unit.y + delta[1]];
        if (pos[0] >= 0 && pos[1] >= 0 && pos[1] < grid.length && pos[0] < grid[0].length) {
            if (!grid[pos[1]][pos[0]].wall)
                adj.push(pos);
        }
    }
    return adj;
}

function pathfind(grid, start, destinationPosition) {
    // A*
    function buildReversePath(bestPrev, current) {
        let result = [];
        while (bestPrev.has(key(current))) {
            current = extract(bestPrev.get(key(current)));
            result.push(current);
        }
        result.pop(); // Remove start
        return result;
    }

    function key(cell) {
        return cell.y * 10000 + cell.x;
    }

    function extract(key) {
        return { x: key % 10000, y: Math.floor(key / 10000 ) };
    }

    function distance(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    const goal = { x: destinationPosition[0], y: destinationPosition[1] };

    let result = {
        distance: 0,
        path: null
    };

    let seen = new Set();
    let remaining = new Set();
    remaining.add(key(start));
    let bestPreviousCell = new Map();
    let costFromStart = new Map();

    costFromStart.set(key(start), 0);

    let traversalCost = new Map();

    traversalCost.set(key(start), distance(start, goal));

    while (remaining.size > 0) {
        const openPositions = Array.from(remaining.keys()).map(key => extract(key));
        // Minimize cost, then assumed distance to goal, then read-order
        openPositions.sort((a, b) => {
            const costDiff = traversalCost.get(key(a)) - traversalCost.get(key(b));
            if (costDiff !== 0)
                return costDiff;
            const distDiff = distance(a, goal) - distance(b, goal);
            if (distDiff !== 0)
                return distDiff;
            if (a.y === b.y)
                return a.x - b.x;
            return a.y - b.y;
        });

        openPositions.reverse();
        const current = openPositions.pop();
        remaining.delete(key(current));

        if (current.x === goal.x && current.y === goal.y) {
            const finalPathInReverse = buildReversePath(bestPreviousCell, current);
            result.distance = finalPathInReverse.length + 1;
            result.path = finalPathInReverse.reverse();
            break; // Done
        }
        
        seen.add(key(current));

        for (const delta of [[1,0],[-1,0],[0,-1],[0,1]]) { // No diagonals
            const neighbor = { x: current.x + delta[0], y: current.y + delta[1] };
            
            if (seen.has(key(neighbor)))
                continue;

            const neighborCell = grid[neighbor.y][neighbor.x];
            if (neighborCell.wall || (neighborCell.occupied && (neighbor.x !== goal.x || neighbor.y !== goal.y))) {
                continue; // Unreachable
            }

            const costOfNeighbor = costFromStart.get(key(current)) + distance(current, neighbor);

            if (!remaining.has(key(neighbor)))
                remaining.add(key(neighbor));
            else if (costOfNeighbor >= (costFromStart.has(key(neighbor)) ? costFromStart.get(key(neighbor)) : Infinity)) {
                continue; // Not optimal
            }

            bestPreviousCell.set(key(neighbor), key(current));
            costFromStart.set(key(neighbor), costOfNeighbor);
            traversalCost.set(key(neighbor), costFromStart.get(key(neighbor)) + distance(neighbor, goal));
        }
    }

    return result;
}

function gridToString(grid, units) {
    return grid.reduce((str, line, y) => {
        str = line.reduce((str, cell, x) => {
            if (cell.wall)
                return str + "#";
            if (cell.occupied) {
                const occupying = units.find(unit => unit.x === x && unit.y === y);
                return str + (occupying.goblin ? 'G' : 'E');
            }
            return str + '.';
        }, str) + "\n";
        return str;
    }, "");
}
    
function round(n, grid, units) {
    units.sort((a, b) => {
        if (a.y === b.y)
            return a.x - b.x;
        return a.y - b.y;
    });

    console.log(n);
    console.log(gridToString(grid, units));

    for (let currentUnit = 0; currentUnit < units.length; ++currentUnit) {
        const enemies = getEnemies(units, units[currentUnit]);
        if (enemies.length === 0)
            return { finished: false, units: units }; // End combat

        const potentialTargets = enemies.reduce((targets, enemy) => {
            const targetOpenAdjacent = getAdjacentWalkable(grid, enemy)
            .reduce((targetOpen, targetAdjacent) => {
                const tile = grid[targetAdjacent[1]][targetAdjacent[0]];
                if (!tile.wall && !tile.occupied) {
                    targetOpen.push(targetAdjacent);
                }
                return targetOpen;
            }, []);

            if (targetOpenAdjacent.length > 0)
                targets.push(enemy);
                
            return targets;
        }, []);

        let adjacentEnemy = enemies.find(enemy =>
            getAdjacentWalkable(grid, units[currentUnit]).some(pos =>
                enemy.x === pos[0] && enemy.y === pos[1]
            )
        );
        
        if (potentialTargets.length === 0 && adjacentEnemy == null)
            continue; // End turn

        if (adjacentEnemy == null) {
            const reachableEnemies = potentialTargets.reduce((list, target) => {
                const pathAndDistance = pathfind(grid, units[currentUnit], [target.x, target.y]);
                const result = {
                    position: [ target.x, target.y],
                    target: target,
                    distance: pathAndDistance.distance,
                    path: pathAndDistance.path
                };
                if (result.distance > 0 && result.path.length > 0)
                    list.push(result);
                return list;
            }, []);

            if (reachableEnemies.length === 0)
                continue; // End turn

            reachableEnemies.sort((a,b) => {
                const distanceDifference = a.distance - b.distance;
                if (distanceDifference === 0) {
                    if (a.position[1] === b.position[1])
                        return a.position[0] - b.position[0];
                    return a.position[1] - b.position[1];
                }
                return distanceDifference;
            });
    
            // Move
            grid[units[currentUnit].y][units[currentUnit].x].occupied = false;

            const pathOptions = getAdjacentWalkable(grid, units[currentUnit])
                .map(position => {
                    return {
                        position: position, 
                        pathAndDistance: pathfind(grid, { x: position[0], y: position[1] },
                            reachableEnemies[0].position)
                        };
                    })
                .reduce((options, potential) => {
                    if (!grid[potential.position[1]][potential.position[0]].occupied && potential.pathAndDistance.distance > 0)
                        options.push(potential);
                    return options;
                }, []);

            pathOptions.sort((a,b) => {
                if (a.pathAndDistance.distance === b.pathAndDistance.distance) {
                    if (a.position[1] === b.position[1])
                        return a.position[0] - b.position[0];
                    return a.position[1] - b.position[1];
                }
                return a.pathAndDistance.distance - b.pathAndDistance.distance;
            });

            units[currentUnit].x = pathOptions[0].position[0];
            units[currentUnit].y = pathOptions[0].position[1];

            grid[units[currentUnit].y][units[currentUnit].x].occupied = true;
        
            if (pathfind(grid, units[currentUnit], reachableEnemies[0].position).distance === 1) {
                adjacentEnemy = reachableEnemies[0].target;
            }
        }
        
        if (adjacentEnemy) {
            // Attack
            const attackableEnemies = getAdjacentWalkable(grid, units[currentUnit])
            .reduce((attackable, adjacentPosition) => {
                const adjacentTarget = enemies.find(target => target.x === adjacentPosition[0] && target.y === adjacentPosition[1]);
                if (adjacentTarget)
                    attackable.push(adjacentTarget);
                return attackable;
            }, []);

            attackableEnemies.sort((a, b) => {
                if (a.hp === b.hp) {
                    if (a.y === b.y)
                        return a.x - b.x;
                    return a.y - b.y;
                }
                return a.hp - b.hp;
            });

            const opponent = attackableEnemies[0];

            opponent.hp -= units[currentUnit].attackPower;

            if (opponent.hp <= 0) {
                const indexOfUnitKilled = units.findIndex(unit => unit.hp <= 0);

                if (indexOfUnitKilled < currentUnit)
                    --currentUnit; // Previous unit was dead one

                grid[opponent.y][opponent.x].occupied = false;

                units = units.reduce((units, unit) => {
                    if (unit.x !== opponent.x || unit.y !== opponent.y)
                        units.push(unit);
                    return units;
                }, []);
            }
        }
    }
    return { finished: true, units: units };
}

function battle(input, attackPower) {
    let units = [];
    const grid = parseGrid(input, attackPower, units)

    const startElves = units.reduce((count, cur) => count + ((!cur.goblin) ? 1 : 0), 0);

    let roundsCompleted = 0;
    do {
        var finishedAndUnits = round(roundsCompleted, grid, units);
        if (finishedAndUnits.finished)
            ++roundsCompleted;
        units = finishedAndUnits.units;
    } while (finishedAndUnits.finished);

    const totalHP = units.reduce((sum, unit) => sum + unit.hp, 0);

    const endElves = units.reduce((count, cur) => count + ((!cur.goblin) ? 1 : 0), 0);
    const elvesKilled = startElves - endElves;

    return { score: roundsCompleted * totalHP, elvesKilled: elvesKilled };
}

function day15(input) {
    let attackPower = 3;
    do {
        var battleResult = battle(input, attackPower);
        if (attackPower == 3)
            var first = battleResult.score;
        ++attackPower;
    } while (battleResult.elvesKilled !== 0);
    return `Part 1: ${first}, Part 2: [${battleResult.score}, Attack ${attackPower - 1}]`;
}

console.log(`Sample`)
console.log(day15(sample));
const then = Date.now();
console.log(`Actual`);
console.log(day15(input));
console.log(`${Date.now() - then}ms for actual input`);