module.exports = {
    transform: {
        '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage-raw'
};