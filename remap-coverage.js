// Stolen and slightly modified from https://github.com/kwonoj/jest-typescript-coverage

const orig = './coverage-raw';
const dest = './coverage';

const fs = require('fs');
const path = require('path');
const loadCoverage = require('remap-istanbul/lib/loadCoverage');
const remap = require('remap-istanbul/lib/remap');
const writeReport = require('remap-istanbul/lib/writeReport');

const coverageFile = orig + '/coverage-final.json';
const updatedCoverageFile = orig + '/coverage-updated.json';

const originalCoverage = fs.readFileSync(coverageFile, 'utf8');

const originalCoverageJson = JSON.parse(originalCoverage);

const updateCoverageJson = {};
Object.keys(originalCoverageJson).forEach((key) => {
  const value = originalCoverageJson[key];
  const updatedKey = key.replace(path.normalize('/src/'), path.normalize('/build/src/')).replace('.ts', '.js');
  updateCoverageJson[updatedKey] = value;
});

fs.writeFileSync(updatedCoverageFile, JSON.stringify(updateCoverageJson));

const collector = remap(loadCoverage(updatedCoverageFile));
writeReport(collector, 'json', {}, dest + '/coverage.json');
writeReport(collector, 'lcovonly', {}, dest + '/coverage.lcov');
writeReport(collector, 'html', {}, dest + '/html');