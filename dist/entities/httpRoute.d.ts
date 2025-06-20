import type { TArgumentsMetadataCollection } from "../decorators/arguments";
import type { THttpMethods } from "../http";
export type THttpRouteModel<T = unknown> = Readonly<{
    class: new (...args: Array<any>) => T;
    funcName: string | symbol;
    func: (...args: Array<any>) => unknown;
    argumentsMetadata: TArgumentsMetadataCollection;
}>;
export declare class HttpRoute {
    static rootPattern: string;
    static innerRootPattern: string;
    readonly alias: string;
    private _map;
    constructor(alias: string);
    /**
     *
     * @param pathname
     * @param method
     * @returns
     */
    test(pathname: string, method: keyof THttpMethods): Readonly<{
        parameters: Record<string, string>;
        model: THttpRouteModel;
    }> | false | undefined;
    /**
     *
     * @param pathname
     * @param method
     * @returns
     */
    isMatch(pathname: string, method: keyof THttpMethods): boolean | undefined;
    /**
     *
     * @param handler
     * @returns
     */
    get(handler: THttpRouteModel): this;
    /**
     *
     * @param handler
     * @returns
     */
    post(handler: THttpRouteModel): this;
    /**
     *
     * @param handler
     * @returns
     */
    put(handler: THttpRouteModel): this;
    /**
     *
     * @param handler
     * @returns
     */
    delete(handler: THttpRouteModel): this;
    /**
     *
     * @param handler
     * @returns
     */
    connect(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param handler
     * @returns
     */
    options(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param handler
     * @returns
     */
    trace(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param handler
     * @returns
     */
    patch(handler: THttpRouteModel): this | Map<keyof THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param handler
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
