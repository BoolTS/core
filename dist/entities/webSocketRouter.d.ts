import type { TWebSocketEventHandlerMetadata } from "../decorators";
import type { WebSocketRoute } from "./webSocketRoute";
export declare class WebSocketRouter {
    readonly rawAlias: string;
    readonly alias: string;
    readonly routes: Array<WebSocketRoute>;
    constructor(rawAlias?: string);
    /**
     * Add websocket routes into router and start analysis
     * @param routes
     * @returns
     */
    addRoutes(...routes: Array<WebSocketRoute>): ThisType<WebSocketRouter>;
    /**
     * Bind context for descriptor handler in the router
     * @param instance
     * @returns
     */
    bind(instance: Object): this;
    /**
     * Generate map for websocket handler metadata
     * @returns
     */
    execute(): Map<string, TWebSocketEventHandlerMetadata>;
    /**
     * Handle alias for router, standardize
     * @param alias
     * @returns
     */
    static thinAlias(alias: string): string;
}
