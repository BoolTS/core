import type { THttpMethods } from "../http";
export type TRouteModel<T = unknown> = Readonly<Required<{
    class: new (...args: Array<any>) => T;
    funcName: string | symbol;
    func: (...args: Array<any>) => unknown;
}>>;
export declare class Route {
    static rootPattern: string;
    readonly alias: string;
    private _map;
    constructor(alias: string);
    test(pathname: string, method: keyof THttpMethods): Readonly<{
        parameters: Record<string, string>;
        model: TRouteModel;
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
    get(handler: TRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    post(handler: TRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    put(handler: TRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    delete(handler: TRouteModel): this;
    /**
     *
     * @param handlers
     * @returns
     */
    connect(handler: TRouteModel): this | Map<keyof THttpMethods, Readonly<Required<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>>;
    /**
     *
     * @param handlers
     * @returns
     */
    options(handler: TRouteModel): this | Map<keyof THttpMethods, Readonly<Required<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>>;
    /**
     *
     * @param handlers
     * @returns
     */
    trace(handler: TRouteModel): this | Map<keyof THttpMethods, Readonly<Required<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>>;
    /**
     *
     * @param handlers
     * @returns
     */
    patch(handler: TRouteModel): this | Map<keyof THttpMethods, Readonly<Required<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
    }>>>;
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
