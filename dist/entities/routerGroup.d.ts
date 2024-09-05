import type { THttpMethods } from "../http";
import type { Router } from "./router";
export declare class RouterGroup {
    private _routers;
    add(...routers: Array<Router>): this;
    find(pathame: string, method: keyof THttpMethods): Readonly<{
        parameters: Record<string, string>;
        model: import("./route").TRouteModel;
    }> | undefined;
}
