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

function battle(input, atk) {
    let units = [];
    const grid = input.split('\n')
    .map((line, y) => {
        return line.split('').map((ch, x) => {
            let pos = { occupied: false, wall: false };
            if (ch === 'E') {
                units.push({ x: x, y: y, goblin: false, hp: 200, atk: atk });
                pos.occupied = true;
            }
            else if (ch === 'G') {
                units.push({ x: x, y: y, goblin: true, hp: 200, atk: 3 });
                pos.occupied = true;
            }
            else if (ch === '#')
                pos.wall = true;
            return pos;
        });
    });
    const startElves = units.reduce((i, cur) => (!cur.goblin) ? i + 1 : i, 0);

    function getTargets(unit) {
        return units.reduce((arr, cur) => {
            if (!(cur.x === unit.x && cur.y === unit.y) && cur.goblin !== unit.goblin)
                arr.push(cur);
            return arr;
        }, []);
    }

    function getAdjacent(unit) {
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

    function pathfind(start, destPos) {
        // A*
        function path(bestPrev, current) {
            let result = [];
            while (bestPrev.has(key(current))) {
                current = extract(bestPrev.get(key(current)));
                result.push(current);
            }
            result.pop(); // Remove start
            return result;
        }

        const goal = { x: destPos[0], y: destPos[1] };

        let result = {
            distance: 0,
            first: null
        };

        function key(cell) {
            return cell.y * 10000 + cell.x;
        }

        function extract(key) {
            return { x: key % 10000, y: Math.floor(key / 10000 ) };
        }

        function distance(a, b) {
            return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        }

        let evaluated = new Set();
        let open = new Set();
        open.add(key(start));
        let bestPrev = new Map();
        let cost = new Map();

        cost.set(key(start), 0);

        let traversalCost = new Map();

        traversalCost.set(key(start), distance(start, goal));

        while (open.size > 0) {
            const openPositions = Array.from(open.keys()).map(key => extract(key));
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
            open.delete(key(current));

            if (current.x === goal.x && current.y === goal.y) {
                const finalPath = path(bestPrev, current);
                result.distance = finalPath.length + 1;
                result.path = finalPath.reverse();
                break; // Done
            }
            
            evaluated.add(key(current));

            for (const delta of [[1,0],[-1,0],[0,-1],[0,1]]) { // No diagonals
                const neighbor = { x: current.x + delta[0], y: current.y + delta[1] };
                
                if (evaluated.has(key(neighbor)))
                    continue;

                const neighborCell = grid[neighbor.y][neighbor.x];
                if (neighborCell.wall || (neighborCell.occupied && (neighbor.x !== goal.x || neighbor.y !== goal.y))) {
                    continue;
                }

                const tentative = cost.get(key(current)) + distance(current, neighbor);

                if (!open.has(key(neighbor)))
                    open.add(key(neighbor));
                else if (tentative >= (cost.has(key(neighbor)) ? cost.get(key(neighbor)) : Infinity)) {
                    continue;
                }

                bestPrev.set(key(neighbor), key(current));
                cost.set(key(neighbor), tentative);
                traversalCost.set(key(neighbor), cost.get(key(neighbor)) + distance(neighbor, goal));
            }
        }

        return result;
    }

    function grid_to_s() {
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
    
    function round(n) {

        units.sort((a, b) => {
            if (a.y === b.y)
                return a.x - b.x;
            return a.y - b.y;
        });

        for (let i = 0; i < units.length; ++i) {
            const targets = getTargets(units[i]);
            if (targets.length === 0)
                return false; // End combat

            const potential = targets.reduce((arr, target) => {
                const targetOpenAdjacent = getAdjacent(target)
                .reduce((adj, pos) => {
                    const tile = grid[pos[1]][pos[0]];
                    if (!tile.wall && !tile.occupied) {
                        adj.push(pos);
                    }
                    return adj;
                }, []);
                if (targetOpenAdjacent.length > 0)
                    arr.push(target);
                return arr;
            }, []);

            let adjacentEnemy = targets.find(target =>
                getAdjacent(units[i]).some(pos =>
                    target.x === pos[0] && target.y === pos[1]
                )
            );
            
            if (potential.length === 0 && adjacentEnemy == null)
                continue; // End turn

            if (adjacentEnemy == null) {
                const reachable = potential.reduce((list, target) => {
                    const distInfo = pathfind(units[i], [target.x, target.y]);
                    const result = {
                        pos: [ target.x, target.y],
                        target: target,
                        distance: distInfo.distance,
                        path: distInfo.path
                    };
                    if (result.distance > 0 && result.path.length > 0)
                        list.push(result);
                    return list;
                }, []);

                if (reachable.length === 0)
                    continue; // End turn

                reachable.sort((a,b) => {
                    const diffDist = a.distance - b.distance;
                    if (diffDist === 0) {
                        if (a.pos[1] === b.pos[1])
                            return a.pos[0] - b.pos[0];
                        return a.pos[1] - b.pos[1];
                    }
                    return diffDist;
                });
        
                // Move
                grid[units[i].y][units[i].x].occupied = false;
                const options = getAdjacent(units[i])
                    .map(pos => { return { pos: pos, path: pathfind({ x: pos[0], y: pos[1] }, reachable[0].pos)}; })
                    .reduce((arr, cur) => {
                        if (!grid[cur.pos[1]][cur.pos[0]].occupied && cur.path.distance > 0)
                            arr.push(cur);
                        return arr;
                    }, []);
                options.sort((a,b) => {
                    if (a.path.distance === b.path.distance) {
                        if (a.pos[1] === b.pos[1])
                            return a.pos[0] - b.pos[0];
                        return a.pos[1] - b.pos[1];
                    }
                    return a.path.distance - b.path.distance;
                });
                units[i].x = options[0].pos[0];
                units[i].y = options[0].pos[1];
                grid[units[i].y][units[i].x].occupied = true;
            
                if (pathfind(units[i], reachable[0].pos).distance === 1) {
                    adjacentEnemy = reachable[0].target;
                }
            }
            
            if (adjacentEnemy) {
                // Attack
                const canAttack = getAdjacent(units[i])
                .reduce((arr, pos) => {
                    const adjTarget = targets.find(target => target.x === pos[0] && target.y === pos[1]);
                    if (adjTarget)
                        arr.push(adjTarget);
                    return arr;
                }, []);

                canAttack.sort((a, b) => {
                    if (a.hp === b.hp) {
                        if (a.y === b.y)
                            return a.x - b.x;
                        return a.y - b.y;
                    }
                    return a.hp - b.hp;
                });

                const attacked = canAttack[0];

                attacked.hp -= units[i].atk;

                if (attacked.hp <= 0) {
                    const killed = units.findIndex(unit => unit.hp <= 0);
                    if (killed < i)
                        --i; // Previous unit was dead one
                    grid[attacked.y][attacked.x].occupied = false;
                    units = units.reduce((arr, cur) => {
                        if (cur.x !== attacked.x || cur.y !== attacked.y)
                            arr.push(cur);
                        return arr;
                    }, []);
                }
            }
        }
        return true;
    }

    let roundsCompleted = 0;
    do {
        var result = round(roundsCompleted);
        if (result)
            ++roundsCompleted;
    } while (result);

    const totalHP = units.reduce((sum, cur) => sum + cur.hp, 0);

    return [roundsCompleted * totalHP, startElves - units.reduce((i, cur) => (!cur.goblin) ? i + 1 : i, 0)];
}

function day15(input) {
    let atk = 3;
    do {
        var result = battle(input, atk);
        if (atk == 3)
            var first = result[0];
        ++atk;
    } while (result[1] !== 0);
    return `Part 1: ${first}, Part 2: [${result[0]}, Attack ${atk - 1}]`;
}

console.log(`Sample`)
console.log(day15(sample));
const then = Date.now();
console.log(`Actual`);
console.log(day15(input));
console.log(`${Date.now() - then}ms for actual input`);