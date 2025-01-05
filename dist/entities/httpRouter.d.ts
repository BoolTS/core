import HttpRoute from "./httpRoute";
export declare class HttpRouter {
    readonly alias: string;
    private _routes;
    constructor(alias: string);
    route(alias: string): HttpRoute;
    private _thinAlias;
    get routes(): Map<string, HttpRoute>;
}
export default HttpRouter;
