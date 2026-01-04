import type { TArgumentsMetadataCollection } from "../decorators/arguments";
import type { THttpMethods } from "../http";
export type THttpRouteModel<T = unknown> = Readonly<{
    class: new (...args: Array<any>) => T;
    funcName: string | symbol;
    func: (...args: Array<any>) => unknown;
    argumentsMetadata: TArgumentsMetadataCollection;
}>;
export declare class HttpRoute {
    #private;
    readonly alias: string;
    constructor({ alias }: {
        alias: string;
    });
    /**
     *
     * @param pathname
     * @param method
     * @returns
     */
    test({ pathname }: {
        pathname: string;
    }): boolean;
    exec({ pathname, method }: {
        pathname: string;
        method: THttpMethods;
    }): Readonly<{
        parameters: Record<string, string | undefined>;
        model: THttpRouteModel;
    }> | null;
    /**
     *
     * @param model
     * @returns
     */
    get({ model }: {
        model: THttpRouteModel;
    }): this;
    /**
     *
     * @param model
     * @returns
     */
    post({ model }: {
        model: THttpRouteModel;
    }): this;
    /**
     *
     * @param model
     * @returns
     */
    put({ model }: {
        model: THttpRouteModel;
    }): this;
    /**
     *
     * @param model
     * @returns
     */
    delete({ model }: {
        model: THttpRouteModel;
    }): this;
    /**
     *
     * @param model
     * @returns
     */
    connect({ model }: {
        model: THttpRouteModel;
    }): this | Map<THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param model
     * @returns
     */
    options({ model }: {
        model: THttpRouteModel;
    }): this | Map<THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param model
     * @returns
     */
    trace({ model }: {
        model: THttpRouteModel;
    }): this | Map<THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param model
     * @returns
     */
    patch({ model }: {
        model: THttpRouteModel;
    }): this | Map<THttpMethods, Readonly<{
        class: new (...args: Array<any>) => unknown;
        funcName: string | symbol;
        func: (...args: Array<any>) => unknown;
        argumentsMetadata: TArgumentsMetadataCollection;
    }>>;
    /**
     *
     * @param model
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
