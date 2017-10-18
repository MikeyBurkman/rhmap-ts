
import 'jest';

/**
 * Assumes that all fields in T are functions, and wraps them
 * as if they were both the original function, and also sinon stubs.
 *
 * let dao: Stubbed<Dao>
 */
type Stubbed<T> = {
    [P in keyof T]: T[P] & jest.Mock<T[P]>;
};

/**
 * Similar to Stubbed, except the first generic contains only the fields
 * that need to be mocked. You'll need to intersection type it with T
 * so that it still contains all the original fields.
 *
 * let dao: Dao&PartialStubbed<Dao, 'find'|'remove'>
 */
type PartialStubbed<T, K extends string & keyof T> = {
    [P in K]: T[P] & jest.Mock<T[P]>;
};

export { Stubbed, PartialStubbed }
