import type { THttpMethods } from "../http";
import type { TCloseInterceptorHandlers, TGuardHandlers, TOpenInterceptorHandlers } from "../interfaces";
import type { THttpRouteModel } from "./httpRoute";
import type { HttpRouter } from "./httpRouter";
export declare class HttpRouterGroup {
    #private;
    add(...routers: Array<HttpRouter>): this;
    /**
     *
     * @param pathname
     * @param method
     * @returns
     */
    find({ pathname, method }: {
        pathname: string;
        method: THttpMethods;
    }): Readonly<{
        parameters: Record<string, string | undefined>;
        model: THttpRouteModel;
        guardHandlers: TGuardHandlers;
        openInterceptorHandlers: TOpenInterceptorHandlers;
        closeInterceptorHandlers: TCloseInterceptorHandlers;
    }> | null;
}
