import type { TCloseInterceptorHandlers, TGuardHandlers, TOpenInterceptorHandlers } from "../interfaces";
import HttpRoute from "./httpRoute";
export declare class HttpRouter {
    #private;
    readonly alias: string;
    constructor({ alias, guardHandlers: guards, openInterceptorHandlers, closeInterceptorHandlers }: {
        alias: string;
        guardHandlers?: TGuardHandlers;
        openInterceptorHandlers?: TOpenInterceptorHandlers;
        closeInterceptorHandlers?: TCloseInterceptorHandlers;
    });
    /**
     *
     * @param alias
     * @returns
     */
    route({ alias }: {
        alias: string;
    }): HttpRoute;
    /**
     *
     * @param alias
     * @returns
     */
    private _thinAlias;
    /**
     *
     */
    get routes(): Map<string, HttpRoute>;
    get pipes(): Readonly<{
        guardHandlers: Readonly<{
            class: import("..").IGuard;
            func: (...args: any[]) => import("../interfaces").TGuardReturn;
            funcName: "enforce";
            argumentsMetadata: import("..").TArgumentsMetadataCollection;
        }>[];
        openInterceptorHandlers: Readonly<{
            class: import("..").IInterceptor<any, any>;
            func: (...args: any[]) => any;
            funcName: "open";
            argumentsMetadata: import("..").TArgumentsMetadataCollection;
        }>[];
        closeInterceptorHandlers: Readonly<{
            class: import("..").IInterceptor<any, any>;
            func: (...args: any[]) => any;
            funcName: "close";
            argumentsMetadata: import("..").TArgumentsMetadataCollection;
        }>[];
    }>;
}
export default HttpRouter;
