type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: unknown) => void;

export class DeferredPromise<T> extends Promise<T> {
    public resolve!: ResolveFn<T>;
    public reject!: RejectFn;

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let resolveSelf: ResolveFn<T> = () => {};
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let rejectSelf: RejectFn = () => {};

        super((resolve, reject) => {
            resolveSelf = resolve;
            rejectSelf = reject;
        });

        this.resolve = resolveSelf;
        this.reject = rejectSelf;
    }

    // you can also use Symbol.species in order to
    // return a Promise for then/catch/finally
    static get [Symbol.species]() {
        return Promise;
    }

    // Promise overrides his Symbol.toStringTag
    get [Symbol.toStringTag]() {
        return 'DeferredPromise';
    }
}
