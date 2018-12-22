//depth: 3879
//target: 8,713

const ROCKY = 0
const WET = 1
const NARROW = 2

function type(cave, depth, pos, target) {
    let type = 0
    switch (erosionLevel(cave, depth, pos, target) % 3) {
        case 0: type = ROCKY; break
        case 1: type = WET; break
        case 2: type = NARROW; break
    }
    cave[pos.y * (target.x + 1) + pos.x].type = type
}

function erosionLevel(cave, depth, pos, target) {
    if (cave[pos.y * (target.x + 1) + pos.x].erosion != undefined) {
        return cave[pos.y * (target.x + 1) + pos.x].erosion
    }
    const erosion = (geoIndex(cave, depth, pos, target) + depth) % 20183
    //console.log(`set ${pos.y * (target.x + 1) + pos.x} erosion to ${erosion}`)
    cave[pos.y * (target.x + 1) + pos.x].erosion = erosion
    return erosion
}

function geoIndex(cave, depth, pos, target) {
    if (cave[pos.y * (target.x + 1) + pos.x].geo != undefined) {
        return cave[pos.y * (target.x + 1) + pos.x].geo
    }
    if (pos.x == 0 && pos.y == 0) {
        return 0
    }
    if (pos.x === target.x && pos.y === target.y) {
        return 0
    }
    if (pos.y === 0) {
        return pos.x * 16807
    }
    if (pos.x === 0) {
        return pos.y * 48271
    }
    const geo = erosionLevel(cave, depth, { x: pos.x - 1, y: pos.y }, target)
         * erosionLevel(cave, depth, { x: pos.x, y: pos.y - 1 }, target)
    //console.log(`set ${pos.y * (target.x + 1) + pos.x} geo to ${geo}`)
    cave[pos.y * (target.x+ 1) + pos.x].geo = geo
    return geo
}

const TORCH = 0
const GEAR = 1
const NEITHER = 2

function switchTool(t1, t2, data) {
    let dist = data.dist
    let tool = data.tool
    switch (t1) {
        case ROCKY:
            switch (t2) {
                case ROCKY:
                    break
                case WET:
                    if (tool !== GEAR) {
                        tool = GEAR
                        dist += 7
                    }
                    break 
                case NARROW:
                    if (tool !== TORCH) {
                        tool = TORCH
                        dist += 7
                    }
                    break
            }
        case WET:
            switch (t2) {
                case ROCKY:
                    if (tool !== GEAR) {
                        tool = GEAR
                        dist += 7
                    }
                    break
                case WET:
                    break
                case NARROW:
                    if (tool !== NEITHER) {
                        tool = NEITHER
                        dist += 7
                    }
                   break
            }
        case NARROW:
            switch (t2) {
                case ROCKY:
                    if (tool !== TORCH) {
                        tool = TORCH
                        dist += 7
                    }
                    break 
                case WET:
                    if (tool !== NEITHER) {
                        tool = NEITHER
                        dist += 7
                    }
                    break
                case NARROW:
                    break
            }
    }
    return {dist: dist, tool: tool }
}

function traverse(cave,width) {
    let remaining = []
    remaining.push({ dist: 0, x: 0, y: 0, tool: TORCH })
    while (remaining.length > 0) {
        const cur = remaining.pop()
        let dist = cur.dist
        const index = cur.y * width + cur.x
        console.log(cur, cave[index].type)
        if (cur.x === width - 1 && cur.y === cave.length / width)
            dist += 7
        if (cave[index].min == undefined || dist < cave[index].min || !cave[index].tools.has(cur.tool)) {
            cave[index].tools.add(cur.tool)
            cave[index].min = dist
        }
        else
            continue
        for (let dx = -1; dx <= 1; ++dx) {
            for (let dy = -1; dy <= 1; ++dy) {
                if (dx == 0 || dy == 0 && dx != dy) {
                    const ny = cur.y + dy
                    const nx = cur.x + dx
                    if (nx < 0 || nx >= width || ny < 0 || ny >= cave.length / width)
                        continue
                    const neighbor = cave[ny * width + nx]
                    const switched = switchTool(cave[index].type, neighbor.type, { tool: cur.tool, dist: dist })
                    remaining.push({ dist: switched.dist + 1, x: nx, y: ny, tool: switched.tool })
                }
            }
        }
    }
}

function day22(depth, target) {
    const cave = new Array((target.x + 1) * (target.y + 1))
    for (let i = 0; i < cave.length; ++i) {
        cave[i] = { tools: new Set() }
    }
    for (let y = 0; y <= target.y; ++y) {
        for (let x = 0; x <= target.x; ++x) {
            type(cave, depth, { x: x, y: y}, target)
        }
    }
    /*console.log(cave.reduce((str, val, i) => {*/
        //str += (val.type === ROCKY ? '.' : (val.type === WET ? '=' : '|'))
        //if (i % (target.x + 1) === target.x)
            //str += "\n"
        //return str
    /*}, ""))*/

    const risk = cave.reduce((sum, val) => sum + val.type, 0)

    traverse(cave,target.x + 1)

    return [risk, cave[cave.length - 1].min]
}

console.log(day22(510, { x: 10, y: 10 }))
//console.log(day22(3879, { x: 8, y: 713 }))
