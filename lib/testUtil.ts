
import 'jest';

/**
 * Assumes that all fields in T are functions, and wraps them
 * as if they were both the original function, and also sinon stubs.
 *
 * let dao: Stubbed<Dao>
 */
export type Stubbed<T> = {
    [P in keyof T]: T[P] & jest.Mock<T[P]>;
};

/**
 * Use this for a dependency in a test when you don't expect it to ever be used.
 * It will always throw an error when it is used in any way.
 */
export const whatever = buildFailingProxy();

/**
 * Builds a Proxy object that will always throw an error when you try to access anything on it
 * or call it as a function.
 */
function buildFailingProxy(): any {
  return new Proxy(() => null, {
    get: (obj, prop) => {
      throw new Error(`Tried to call "${prop}" on a mock dependency`);
    },
    apply: (target, that, args) => {
      throw new Error(`Tried to call a mock as a function with args "${args}"`);
    }
  });
}
