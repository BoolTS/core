import type { THttpMethods } from "../http";
import type { THttpRouteModel } from "./httpRoute";
import type { HttpRouter } from "./httpRouter";
export declare class HttpRouterGroup {
    private _routers;
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
    }> | null;
}
