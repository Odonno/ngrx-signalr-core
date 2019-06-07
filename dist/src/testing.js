export let testingEnabled = false;
export let hubCreationFunc;
export const enableTesting = (func) => {
    testingEnabled = true;
    hubCreationFunc = func;
};
