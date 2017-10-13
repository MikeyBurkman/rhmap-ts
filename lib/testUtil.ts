
import * as sinon from 'sinon';

const _stub = sinon.stub();
type Sinon = typeof _stub;

/**
 * Assumes that all fields in T are functions, and wraps them
 * as if they were both the original function, and also sinon stubs.
 * 
 * let dao: Sinonized<Dao>
 */
type Sinonized<T> = {
    [P in keyof T]: T[P]&Sinon;
}

/**
 * Similar to Sinonized, except the first generic contains only the fields
 * that need to be mocked. You'll need to intersection type it with T
 * so that it still contains all the original fields.
 * 
 * let dao: Dao&SinonizedPartial<Dao, 'find'|'remove'>
 */
type SinonizedPartial<T, K extends string & keyof T> = {
    [P in K]: T[P]&Sinon;
}

export { Sinonized, SinonizedPartial }