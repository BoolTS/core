import HttpRoute from "./httpRoute";
export declare class HttpRouter {
    readonly alias: string;
    private _routes;
    constructor(alias: string);
    /**
     *
     * @param alias
     * @returns
     */
    route(alias: string): HttpRoute;
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
}
export default HttpRouter;
