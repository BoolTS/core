import type { TWebSocketEventHandlerMetadata } from "../decorators";
import type { WebSocketRouter } from "./webSocketRouter";

export class WebSocketRouterGroup {
    public readonly prefix: string;
    public readonly routers: Array<WebSocketRouter> = [];

    constructor(public readonly rawPrefix: string = "/") {
        this.prefix = WebSocketRouterGroup.thinPrefix(rawPrefix);
    }

    /**
     *
     * @param routers
     * @returns
     */
    public addRouters(...routers: Array<WebSocketRouter>): ThisType<WebSocketRouterGroup> {
        for (let i = 0; i < routers.length; i++) {
            if (!this.routers.includes(routers[i])) {
                this.routers.push(routers[i]);
            }
        }

        for (const router of routers) {
            if (!this.routers.includes(router)) {
                this.routers.push(router);
            }
        }

        return this;
    }

    /**
     *
     * @returns
     */
    public execute(): Map<string, TWebSocketEventHandlerMetadata> {
        const map = new Map<string, TWebSocketEventHandlerMetadata>();

        for (const router of this.routers) {
            const routerMap = router.execute();

            for (const [routerKey, metadata] of routerMap.entries()) {
                map.set(
                    `/${WebSocketRouterGroup.thinPrefix(`${this.prefix}/${routerKey}`)}`,
                    metadata
                );
            }
        }

        return map;
    }

    /**
     *
     * @param prefix
     * @returns
     */
    public static thinPrefix(prefix: string): string {
        return prefix
            .replace(new RegExp("[/]{2,}", "g"), "/")
            .replace(new RegExp("^[/]|[/]$", "g"), "");
    }
}
