import type { IContext, TContextOptions } from "../interfaces";

export class Context implements IContext {
    private readonly _staticMap = new Map<symbol, any>();
    private readonly _dynamicMap = new Map<symbol, any>();

    private _options?: TContextOptions = undefined;

    constructor(...contexts: Array<Context>) {
        contexts.forEach((context) => {
            context.staticEntries.forEach(([key, value]) =>
                this.set(key, value, { isStatic: true, isPassthrough: true })
            );
            context.dynamicEntries.forEach(([key, value]) =>
                this.set(key, value, { isStatic: false })
            );
        });
    }

    get<T = unknown>(key: symbol, options?: TContextOptions) {
        const temporaryOptions = options || this._options;

        return !temporaryOptions?.isStatic
            ? (this._dynamicMap.get(key) as T)
            : (this._staticMap.get(key) as T);
    }

    has(key: symbol, options?: TContextOptions) {
        const temporaryOptions = options || this._options;

        return !temporaryOptions?.isStatic ? this._dynamicMap.has(key) : this._staticMap.has(key);
    }

    set(key: symbol, value: any, options?: TContextOptions) {
        const temporaryOptions = options || this._options;

        if (!temporaryOptions?.isStatic) {
            this._dynamicMap.set(key, value);
        } else {
            if (!this._staticMap.has(key)) {
                this._staticMap.set(key, value);
            } else if (!temporaryOptions.isPassthrough) {
                throw Error(`${String(key)} already exists in context static collection.`);
            }
        }

        return this;
    }

    setOptions(options: TContextOptions) {
        this._options = options;

        return this;
    }

    get staticEntries() {
        return [...this._staticMap.entries()];
    }

    get dynamicEntries() {
        return [...this._dynamicMap.entries()];
    }
}

export default Context;
