const distanceThreshold = 10000;
const input = `77, 279
216, 187
72, 301
183, 82
57, 170
46, 335
55, 89
71, 114
313, 358
82, 88
78, 136
339, 314
156, 281
260, 288
125, 249
150, 130
210, 271
190, 258
73, 287
187, 332
283, 353
66, 158
108, 97
237, 278
243, 160
61, 52
353, 107
260, 184
234, 321
181, 270
104, 84
290, 109
193, 342
43, 294
134, 211
50, 129
92, 112
309, 130
291, 170
89, 204
186, 177
286, 302
188, 145
40, 52
254, 292
270, 287
238, 216
299, 184
141, 264
117, 129`;
// Sample data
// const fact = 32;
// const input = `1, 1
// 1, 6
// 8, 3
// 3, 4
// 5, 5
// 8, 9`;

const lines = input.split(`\n`);

// Get grid dimensions
const dimensions = [0,0];
for (let i = 0; i < 2; ++i) {
    dimensions[i] = lines.reduce((prev,cur) => {
        return (cur.split(', ')[i] > prev) ? parseInt(cur.split(', ')[i]) : parseInt(prev);
    });
}

const pointRegions = new Array();

lines.forEach((str, i) => {
    const pos = str.split(', ').map(x => parseInt(x) + 1);
    let obj = new Object();
    obj.pos = pos;
    obj.i = i;
    obj.area = 0;
    obj.infinite = false;
    pointRegions.push(obj);
});

// Add border to check for infinite regions
const adjustedDimensions = dimensions.map(val => val + 2);

function manhattan(pos1, pos2) {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

let areaWithinThreshold = 0;
let gridOutputString = "";

for (let i = 0; i < grid.length; ++i) {
    const gridX = i % adjustedDimensions[0];
    const gridY = Math.floor(i / adjustedDimensions[0]);

    // Find manhattan distance to every point
    const distances = pointRegions.map(point => {
        return {
            point = point.i,
            distance = manhattan([gridX, gridY],
            pos = point.pos)
        };
    });

    const totalDistanceToGridPos = distances.reduce((sum, next) => {
        return sum + next.distance;
    }, 0);

    // Check if the total distance to all points is within the threshold
    if (totalDistanceToGridPos < distanceThreshold
        && gridX > 0 && gridX < adjustedDimensions[0] - 1
        && gridY > 0 && gridY < adjustedDimensions[1] - 1) {
            ++areaWithinThreshold;
        }

    // Ascending
    distances.sort((a,b) => a.distance - b.distance);

    const closest = distances[0].point;

    if (closest.distance < distances[1].distance) {
        // Check if infinite; if not, update area
        if (!pointRegions[closest.point].infinite) {
            if (gridPosX === 0
                || gridPosX === adjustedDimensions[0] - 1
                || gridPosY === 0
                || gridPosY === adjustedDimensions[1] - 1) {
                    pointRegions[closest.point].infinite = true;
                }
        }
        if (!pointRegions[closest.point].infinite)
            ++pointRegions[closest.point].area;
    }
}

// Remove infinite regions
pointRegions.reduce((prev,cur) => {
    if (!cur.infinite)
        prev.push(cur);
    return prev;
}, new Array());

// Sort descending
pointRegions.sort((a,b) => b.area - a.area);

// Max area
const part1 = pointRegions[0].area;

const part2 = areaWithinThreshold;

console.log(part1);
console.log(part2);