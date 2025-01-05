export class WebSocketRouterGroup {
    rawPrefix;
    prefix;
    routers = [];
    constructor(rawPrefix = "/") {
        this.rawPrefix = rawPrefix;
        this.prefix = WebSocketRouterGroup.thinPrefix(rawPrefix);
    }
    /**
     *
     * @param routers
     * @returns
     */
    addRouters(...routers) {
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
    execute() {
        const map = new Map();
        for (const router of this.routers) {
            const routerMap = router.execute();
            for (const [routerKey, metadata] of routerMap.entries()) {
                map.set(`/${WebSocketRouterGroup.thinPrefix(`${this.prefix}/${routerKey}`)}`, metadata);
            }
        }
        return map;
    }
    /**
     *
     * @param prefix
     * @returns
     */
    static thinPrefix(prefix) {
        return prefix
            .replace(new RegExp("[/]{2,}", "g"), "/")
            .replace(new RegExp("^[/]|[/]$", "g"), "");
    }
}
