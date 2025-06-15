import type { THttpMethods } from "../http";
import type { HttpRouter } from "./httpRouter";
export declare class HttpRouterGroup {
    private _routers;
    add(...routers: Array<HttpRouter>): this;
    /**
     *
     * @param pathame
     * @param method
     * @returns
     */
    find(pathame: string, method: keyof THttpMethods): Readonly<{
        parameters: Record<string, string>;
        model: import("./httpRoute").THttpRouteModel;
    }> | undefined;
}
