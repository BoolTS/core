export class WebSocketRouter {
    rawAlias;
    alias;
    routes = [];
    constructor(rawAlias = "/") {
        this.rawAlias = rawAlias;
        this.alias = WebSocketRouter.thinAlias(rawAlias);
    }
    /**
     * Add websocket routes into router and start analysis
     * @param routes
     * @returns
     */
    addRoutes(...routes) {
        for (const route of routes) {
            if (!this.routes.includes(route)) {
                this.routes.push(route);
            }
        }
        return this;
    }
    /**
     * Bind context for descriptor handler in the router
     * @param instance
     * @returns
     */
    bind(instance) {
        for (const route of this.routes) {
            route.bind(instance);
        }
        return this;
    }
    /**
     * Generate map for websocket handler metadata
     * @returns
     */
    execute() {
        const map = new Map();
        for (const route of this.routes) {
            map.set(`${this.alias}:::${route.eventName}`, route.metadata);
        }
        return map;
    }
    /**
     * Handle alias for router, standardize
     * @param alias
     * @returns
     */
    static thinAlias(alias) {
        return alias
            .replace(new RegExp("[/]{2,}", "g"), "/")
            .replace(new RegExp("^[/]|[/]$", "g"), "");
    }
}
