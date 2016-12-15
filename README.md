# RHMAP with TypeScript

A proof of concept of using [TypeScript](https://www.typescriptlang.org/) with RHMAP.

### Features
- Uses TypeScript 2.0
- Compiles on post-install, so no need to keep compiled JS in your repo
- Uses [Mocha](https://www.npmjs.com/package/mocha) to run tests
    - Uses [Sinon](https://www.npmjs.com/package/sinon) and [Proxyquire](https://www.npmjs.com/package/proxyquire) the same way you would with traditional Node JS apps
    - (At this point tests aren't type-safe the way regular code is -- hopefully can fix this to some extent)
- Uses [nyc](https://www.npmjs.com/package/nyc) to generate code coverage reports
    - NOTE: Apparently this broke somewhere along the way. Need to fix it...
- Includes [VS Code](https://code.visualstudio.com/) config file to make IDE setup easy
- Uses [tslint](https://www.npmjs.com/package/tslint) to keep code styling consistent
- Uses a combination of NODE_PATH and tsconfig baseUrls to allow importing modules relative to the `lib/` directory

### Installation
1. Clone this repo
2. `npm i`. This will install all dependencies and compile the code
3. The `.vscode` directory is included, which will set up everything you need to get started if editing in VS Code. (You're on your own if using a different editor.)
4. All the TS code is in `/lib`. Do not edit any of the generated JS files. (The `.vscode` settings are set to not even show JS files, to avoid accidentally editing them.)

### Running locally
- `npm start` Start the server
- `npm test` Run the tests
- `npm run compile` Compile the code. (Both `start` and `test` automatically call this.)
- `npm run clean` Delete all generated files. Generated files are in `.gitignore`, so no worry about accidentally checking them in.
