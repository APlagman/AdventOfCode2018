const sample = [9, 5, 18, 2018];
const input = 919901;

function day14(input) {
    let recipes = [3, 7];
    let elves = [0, 1];
    let firstFound = null;
    for (var inputDigits = [], temp = input; temp > 0; temp = Math.floor(temp / 10))
        inputDigits.push(temp % 10);
    inputDigits.reverse();
    while (recipes.length < input + 10 || firstFound == null) {
        const newScore = recipes[elves[0]] + recipes[elves[1]];
        const numDigits = Math.floor(newScore / 10) + 1;
        let newRecipes = [];
        for (let i = 0, score = newScore; i < numDigits; ++i) {
            newRecipes.push(score % 10);
            score = Math.floor(score / 10);
        }
        newRecipes.reverse();
        for (const val of newRecipes) {
            recipes.push(val);
            if (firstFound == null && recipes.length >= inputDigits.length) {
                const end = recipes.slice(-inputDigits.length, recipes.length);
                firstFound = recipes.length - inputDigits.length;
                for (let i = 0; i < end.length; ++i) {
                    if (end[i] !== inputDigits[i]) {
                        firstFound = null;
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < elves.length; ++i) {
            const newIndex = elves[i] + recipes[elves[i]] + 1;
            elves[i] = newIndex % recipes.length;
        }
    }
    return [recipes.slice(input, input + 10).join(''), firstFound];
}

console.log('Sample Part 1');
sample.forEach(sample => console.log(day14(sample)[0]));
console.log('Sample Part 2');
[51589, 92510, 59414].forEach(sample => console.log(day14(sample)[1]));
console.log('Actual')
const then = new Date();
console.log(day14(input));
console.log(`${Date.now() - then}ms for actual input`);