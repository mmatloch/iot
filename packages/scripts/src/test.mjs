import { $, cd } from 'zx';

const main = async () => {
    cd('./packages/tests');

    await $`yarn node --experimental-vm-modules $(yarn bin jest)`;
};

await main();
