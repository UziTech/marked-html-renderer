import { spec } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
const cover = process.argv.includes('--cover');
const only = process.argv.includes('--only');

run({
  globPatterns: ['spec/**/*.test.js'],
  only,
  coverage: cover,
  coverageExcludeGlobs: 'spec/*',
  lineCoverage: 100,
  branchCoverage: 100,
  functionCoverage: 100,
})
  .on('test:fail', () => {
    process.exitCode = 1;
  })
  .compose(spec)
  .pipe(process.stdout);
