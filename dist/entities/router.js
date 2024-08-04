"use strict";
import Route from "./route";
export class Router {
    alias;
    _routes = new Map();
    constructor(alias) {
        this.alias = this._thinAlias(alias);
    }
    route(alias) {
        const thinAlias = this._thinAlias(`${this.alias}/${alias}`);
        const route = this._routes.get(thinAlias);
        const newRoute = !route ? new Route(`${this.alias}/${alias}`) : route;
        if (!route) {
            this._routes.set(thinAlias, newRoute);
        }
        return newRoute;
    }
    _thinAlias(alias) {
        return alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
    }
    get routes() {
        return this._routes;
    }
}
export default Router;
