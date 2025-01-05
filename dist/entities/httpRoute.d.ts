import type { THttpMethods } from "../http";
export type THttpRouteModel<T = unknown> = Readonly<{
    class: new (...args: Array<any>) => T;
    funcName: string | symbol;
    func: (...args: Array<any>) => unknown;
}>;
export declare class HttpRoute {
    static rootPattern: string;
    static innerRootPattern: string;
    readonly alias: string;
    private _map;
    constructor(alias: string);
    test(pathname: string, method: keyof THttpMethods): Readonly<{
        parameters: Record<string, string>;
        model: THttpRouteModel;
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
    get(handler: THttpRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    post(handler: THttpRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    put(handler: THttpRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    delete(handler: THttpRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    connect(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>;
    /**
     *
     * @param handlers
     * @returns
     */
    options(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>;
    /**
     *
     * @param handlers
     * @returns
     */
    trace(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>;
    /**
     *
     * @param handlers
     * @returns
     */
    patch(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>;
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
export default HttpRoute;
