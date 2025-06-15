import type { IContext, TContextOptions } from "../interfaces";
export declare class Context implements IContext {
    private readonly _staticMap;
    private readonly _dynamicMap;
    private _options?;
    constructor(...contexts: Array<Context>);
    get<T = unknown>(key: symbol, options?: TContextOptions): T;
    has(key: symbol, options?: TContextOptions): boolean;
    set(key: symbol, value: any, options?: TContextOptions): this;
    setOptions(options: TContextOptions): this;
    get staticEntries(): [symbol, any][];
    get dynamicEntries(): [symbol, any][];
}
export default Context;
