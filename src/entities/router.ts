"use strict";

import Route from "./route";

export class Router {
    public readonly alias: string;

    private _routes: Map<string, Route> = new Map();

    constructor(alias: string) {
        this.alias = alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
    }

    public route(alias: string) {
        const thinAlias = this._thinAlias(`${this.alias}/${alias}`);
        const route = this._routes.get(thinAlias);
        const newRoute = !route ? new Route(`${this.alias}/${alias}`) : route;

        if (!route) {
            this._routes.set(thinAlias, newRoute);
        }

        return newRoute;
    }

    private _thinAlias(alias: string) {
        return alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
    }

    get routes() {
        return this._routes;
    }
}

export default Router;
