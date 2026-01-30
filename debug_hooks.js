const fs = require('fs');
const path = require('path');

try {
    const baapPath = path.resolve('c:/Users/user/Desktop/Trendsts/trendsta', 'baap file.json');
    console.log(`Reading from: ${baapPath}`);
    const content = fs.readFileSync(baapPath, 'utf8');
    const json = JSON.parse(content);

    const root = Array.isArray(json) ? json[0] : json;

    console.log("Root keys:", Object.keys(root));

    if (root.hooks) {
        console.log("Found 'hooks' at root!");
        console.log("Count:", root.hooks.length);
        console.log("First item:", root.hooks[0]);
    } else {
        console.log("'hooks' NOT found at root.");
        // Search deeper just in case
        if (root.overall_strategy && root.overall_strategy.hooks) {
            console.log("Found 'hooks' in overall_strategy!");
        }
    }

} catch (err) {
    console.error("Error:", err);
}
