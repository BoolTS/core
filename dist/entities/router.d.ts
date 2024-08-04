import Route from "./route";
export declare class Router {
    readonly alias: string;
    private _routes;
    constructor(alias: string);
    route(alias: string): Route;
    private _thinAlias;
    get routes(): Map<string, Route>;
}
export default Router;
