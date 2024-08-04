import type { THttpMethods } from "../http";
import type { Router } from "./router";
export declare class RouterGroup {
    private _routers;
    add(...routers: Array<Router>): this;
    find(pathame: string, method: keyof THttpMethods): Readonly<{
        params: Record<string, string>;
        handlers: Array<Required<{
            constructor: new (...args: Array<any>) => unknown;
            funcName: string | symbol;
            func: (...args: Array<any>) => unknown;
        }>>;
    }> | undefined;
}
