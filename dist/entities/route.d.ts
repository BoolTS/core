import type { THttpMethods } from "../http";
type THandler<T = unknown> = Required<{
    constructor: new (...args: Array<any>) => T;
    funcName: string | symbol;
    func: (...args: Array<any>) => unknown;
}>;
export declare class Route {
    static rootPattern: string;
    readonly alias: string;
    private _map;
    constructor(alias: string);
    test(pathname: string, method: keyof THttpMethods): Readonly<{
        params: Record<string, string>;
        handlers: Array<THandler>;
    }> | false | undefined;
    /**
     *
     */
    isMatch(pathname: string, method: keyof THttpMethods): boolean | undefined;
    /**
     *
     * @param handlers
     * @returns
     */
    get(...handlers: Array<THandler>): this;
    /**
     *
     * @param handlers
     * @returns
     */
    post(...handlers: Array<THandler>): this;
    /**
     *
     * @param handlers
     * @returns
     */
    put(...handlers: Array<THandler>): this;
    /**
     *
     * @param handlers
     * @returns
     */
    delete(...handlers: Array<THandler>): this;
    /**
     *
     * @param handlers
     * @returns
     */
    connect(...handlers: Array<THandler>): this | Map<keyof THttpMethods, Required<{
        constructor: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>[]>;
    /**
     *
     * @param handlers
     * @returns
     */
    options(...handlers: Array<THandler>): this | Map<keyof THttpMethods, Required<{
        constructor: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>[]>;
    /**
     *
     * @param handlers
     * @returns
     */
    trace(...handlers: Array<THandler>): this | Map<keyof THttpMethods, Required<{
        constructor: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>[]>;
    /**
     *
     * @param handlers
     * @returns
     */
    patch(...handlers: Array<THandler>): this | Map<keyof THttpMethods, Required<{
        constructor: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>[]>;
    /**
     *
     * @param handlers
     * @returns
     */
    private _thinAlias;
    /**
     * Internal get fullpath after check regular expression
     * @returns
     */
    get _fullPath(): string;
    /**
     * Internal get filterd path after check regular expression
     * @returns
     */
    get _filteredPath(): string;
}
export default Route;
