const fs = require('fs');
const path = require('path');

try {
    const baapPath = path.resolve('c:/Users/user/Desktop/Trendsts/trendsta', 'baap file.json');
    console.log(`Reading from: ${baapPath}`);
    const content = fs.readFileSync(baapPath, 'utf8');
    const sourceBaap = JSON.parse(content);

    console.log('Is Array?', Array.isArray(sourceBaap));

    const baapRoot = Array.isArray(sourceBaap) ? sourceBaap[0] : sourceBaap;
    console.log('Has overall_strategy?', !!baapRoot.overall_strategy);

    const strategy = baapRoot.overall_strategy || {};
    console.log('Has dashboard_graphs?', !!strategy.dashboard_graphs);

    if (strategy.dashboard_graphs) {
        console.log('Graph Keys:', Object.keys(strategy.dashboard_graphs));
    } else {
        console.log('dashboard_graphs is MISSING');
        console.log('Strategy Keys:', Object.keys(strategy));
    }

} catch (e) {
    console.error('Error:', e);
}
