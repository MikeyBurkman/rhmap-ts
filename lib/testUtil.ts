
import * as sinon from 'sinon';

const _stub = sinon.stub();
type Sinon = typeof _stub;

type Sinonized<T> = {
    [P in keyof T]: Sinon&T[P];
}

export { Sinonized }