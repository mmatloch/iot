import _ from 'lodash';
import { VM } from 'vm2';

export const createSandbox = () => {
    return new VM({
        timeout: 1000,
        allowAsync: true,
        sandbox: {
            _: _,
        },
        eval: false,
        wasm: false,
    });
};
