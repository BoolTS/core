import type { TWebSocketEventHandlerMetadata } from "../decorators";
import type { WebSocketRoute } from "./webSocketRoute";

export class WebSocketRouter {
    public readonly alias: string;
    public readonly routes: Array<WebSocketRoute> = [];

    constructor(public readonly rawAlias: string = "/") {
        this.alias = WebSocketRouter.thinAlias(rawAlias);
    }

    /**
     * Add websocket routes into router and start analysis
     * @param routes
     * @returns
     */
    public addRoutes(...routes: Array<WebSocketRoute>): ThisType<WebSocketRouter> {
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
    public bind(instance: Object): ThisType<WebSocketRouter> {
        for (const route of this.routes) {
            route.bind(instance);
        }

        return this;
    }

    /**
     * Generate map for websocket handler metadata
     * @returns
     */
    public execute(): Map<string, TWebSocketEventHandlerMetadata> {
        const map = new Map<string, TWebSocketEventHandlerMetadata>();

        for (const route of this.routes) {
            map.set(`${this.alias}:::${route.eventName}`, route.execute());
        }

        return map;
    }

    /**
     * Handle alias for router, standardize
     * @param alias
     * @returns
     */
    public static thinAlias(alias: string): string {
        return alias
            .replace(new RegExp("[/]{2,}", "g"), "/")
            .replace(new RegExp("^[/]|[/]$", "g"), "");
    }
}
