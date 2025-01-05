import type { THttpMethods } from "../http";
import type { HttpRouter } from "./httpRouter";
export declare class HttpRouterGroup {
    private _routers;
    add(...routers: Array<HttpRouter>): this;
    find(pathame: string, method: keyof THttpMethods): Readonly<{
        parameters: Record<string, string>;
        model: import("./httpRoute").THttpRouteModel;
    }> | undefined;
}
