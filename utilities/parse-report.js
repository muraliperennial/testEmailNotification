const fs = require('fs');
const path = require('path');

const filePath = path.resolve('test-results/results.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let passed = 0;
let failed = 0;
let skipped = 0;

let passedTitles = [];
let failedTitles = [];

// Helper function to recursively find specs (Playwright JSON structure can be nested)
function walk(suites) {
    for (const suite of suites || []) {
        if (suite.specs) {
            for (const spec of suite.specs) {
                // Get the status from the first result of the test
                const status = spec.tests[0]?.results[0]?.status;
                
                if (status === 'passed') {
                    passed++;
                    passedTitles.push(spec.title);
                } else if (status === 'failed' || status === 'timedOut') {
                    failed++;
                    failedTitles.push(spec.title);
                } else {
                    skipped++;
                }
            }
        }
        if (suite.suites) walk(suite.suites);
    }
}

walk(data.suites);

// 1. Format lists for the email body (Join with newlines or commas)
const passedList = passedTitles.length > 0 ? passedTitles.join('\\n - ') : 'None';
const failedList = failedTitles.length > 0 ? failedTitles.join('\\n - ') : 'None';

// 2. Export to GitHub Actions Environment Variables
// We use appendFileSync to handle multi-line strings correctly in GitHub Actions
const envFile = process.env.GITHUB_ENV;
if (envFile) {
    fs.appendFileSync(envFile, `PASSED_COUNT=${passed}\n`);
    fs.appendFileSync(envFile, `FAILED_COUNT=${failed}\n`);
    fs.appendFileSync(envFile, `SKIPPED_COUNT=${skipped}\n`);
    // Using a delimiter for multi-line strings in GITHUB_ENV
    fs.appendFileSync(envFile, `PASSED_LIST<<EOF\n- ${passedList}\nEOF\n`);
    fs.appendFileSync(envFile, `FAILED_LIST<<EOF\n- ${failedList}\nEOF\n`);
}

// Log to console for debugging
console.log(`Summary: ${passed} Passed, ${failed} Failed`);
console.log(`Passed List: ${passedList}`)
console.log(`Failed List: ${failedList}`)