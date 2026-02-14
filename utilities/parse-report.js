const fs = require('fs');
const path = require('path');

const filePath = path.resolve('test-results/results.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let passed = 0;
let failed = 0;
let skipped = 0;

for (const suite of data.suites || []) { 
    for (const spec of suite.specs || []) { 
        for (const test of spec.tests || []) {
            for (const result of test.results || []) {
                const status = result.status;
                if (status === 'passed') passed++;
                else if (status === 'failed') failed++;
                else skipped++;
            } 
        }
    }
}

// Export for GitHub Actions
console.log(`::set-output name=passed::${passed}`);
console.log(`::set-output name=failed::${failed}`);
console.log(`::set-output name=skipped::${skipped}`);