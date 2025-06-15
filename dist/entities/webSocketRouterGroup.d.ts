import type { TWebSocketEventHandlerMetadata } from "../decorators";
import type { WebSocketRouter } from "./webSocketRouter";
export declare class WebSocketRouterGroup {
    readonly rawPrefix: string;
    readonly prefix: string;
    readonly routers: Array<WebSocketRouter>;
    constructor(rawPrefix?: string);
    /**
     *
     * @param routers
     * @returns
     */
    addRouters(...routers: Array<WebSocketRouter>): ThisType<WebSocketRouterGroup>;
    /**
     *
     * @returns
     */
    execute(): Map<string, TWebSocketEventHandlerMetadata>;
    /**
     *
     * @param prefix
     * @returns
     */
    static thinPrefix(prefix: string): string;
}
export default WebSocketRouterGroup;
