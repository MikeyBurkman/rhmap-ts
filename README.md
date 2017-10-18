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

### Architecture Design Decisions
#### Dependency Injection
We're using good old fashioned dependency injection with this application, mostly for unit testing considerations.
With JS, it's easy enough to mock out calls to `require()` using Jest (or even Proxyquire). However, with doing that, we
lose all type checks. If you change a module's API, that change is not caught by the compiler, and you'll have to debug 
failing tests to figure out what happened. (And hopefully they don't just fail silently.) We can do better than that

Instead, each module is essentially broken into three parts:
1) The API contract. This is the public interface(s) for the module that other modules will reference.

2) The actual implementation. This is usually a function that takes in other modules (if necessary) as arguments. 
These modules are of course only referenced by *their* API contracts, and not their implementation. Any configuration or
environment variables should also be arguments to this function. (If the argument list gets too long, then instead use a 
single config object as the only argument.) Utility libraries like Lodash usually do NOT need be passed in the arguments list.

3) The `index.ts` file, which builds the implementation and exports (default) the final object. This file is responsible
for gathering all dependencies for the implementation. Note that this module is the ONLY thing it's building. All other 
dependencies will be pulled in by their `index.ts` files.

By doing this, we make it easy to unit test the module, by having the test pass in required dependencies, which can
of course be mocked up. (The index files do not need to be unit tested -- they should be tested through integration or E2E 
tests.) Modules are not aware of the implementation of other modules, or how they should be created. And of course, everything
is type safe.

Why not use a DI framework like [Inversify](https://github.com/inversify/InversifyJS)? For starters, I don't like classes in
TS/JS. Second, these frameworks are kind of magical -- a black box that you rely on. It saves you from writing our manual mapping files (the `index.ts` files), but at the cost of added mental complexity. How do you inject constant values or environment variables? What about an array of things? These are trivial to do using manual mapping. What if I want my module to be a new instance every time it's injected? With manual mapping, have your `index.ts` file export a factory function instead of the actual instance. The manual mapping files are not magical, can be traced through easily, as well as debugged.

#### Wait, No Classes?
I believe (though I seem to be in the minority) that classes in TS/JS are a mistake, and should be avoided. TS and JS are
expressive languages that do not need the boilerplate of classes. What's more, the type system in TS surpasses most other
strongly-typed mainstream languages, making the case for classes less powerful. Finally, the `this` variable is easy to 
mess up, causes a lot of confusion for new-comers, and makes it very difficult to use functions by reference. For instance, 
assuming there's a class `Foo` with a `doStuff(a: string, b: string): string` method on it, instead of passing `foo.doStuff` 
as an argument to another function, you're forced to pass `(a: string, b: string) => foo.doStuff(a, b)`. And because function 
types in TS do not carry information on the context, the compiler would not catch the null pointer exception you'll get if
you forget to do the expanded version.

But isn't that less efficient, having function `doStuff` defined on every object? That's only an issue if you are combining
state and functions into a single instance. Since TS does namespaces rather well, it's simpler just to have a function 
`doStuff(f: Foo, a: string, b: string): string` in your module. Leave all your data in your object, and put all your functions
in your namespace. Functional programming is your friend.

For a lot more resources, see https://github.com/joshburgess/not-awesome-es6-classes
