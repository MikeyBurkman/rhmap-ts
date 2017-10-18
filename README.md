# RHMAP with TypeScript

A proof of concept of using [TypeScript](https://www.typescriptlang.org/) with RHMAP.

### Features
- Uses TypeScript 2.x with strict compiler settings
- Compiles on post-install, so no need to keep compiled JS in your repo, or worry about the JS diffs in commits
- Uses [Jest](https://www.npmjs.com/package/jest) to handle unit testing and code coverage
- Includes a [VS Code](https://code.visualstudio.com/) config file to make IDE setup easy
- Uses [tslint](https://www.npmjs.com/package/tslint) to keep code styling consistent
- Uses a combination of NODE_PATH and tsconfig baseUrls to allow importing modules relative to the root directory. 
This allows you to import, for instance, `lib/contracts/db` instead of `../../contracts/db`.

### Installation
1. Clone this repo
2. `npm i`. This will install all dependencies and compile the code
3. The `.vscode` directory is included, which will set up everything you need to get started if editing in VS Code. (You're on your own if using a different editor.)
4. All the TS code is in `/lib`. Do not edit any of the generated JS files. (The `.vscode` settings are set to not even show JS files, to avoid accidentally editing them.)

### Running locally
- `npm start` Start the server
- `npm test` Run the tests and generate code coverage reports
- `npm run compile` Compile the code. (Both `start` and `test` automatically call this.)
- `npm run lint` Runs the linter. Also tries to fix any issues it can automatically.
- `npm run clean` Delete all generated files. Generated files are in `.gitignore`, so no worry about accidentally checking them in.

### Accessing the Running App
- Simply go to `http://localhost:8100` your browser to verify that the app is running
- Make a GET request to `http://localhost:8080/messages` to verify that you can query Mongo
- Make a PUT request to `http//localhost:8080/messages` with a JSON object containing a string `message` property, to test that you can insert data into Mongo. (Then use the GET request to verify it got saved.)
