export class RouterGroup {
    _routers = new Map();
    add(...routers) {
        for (let i = 0; i < routers.length; i++) {
            if (this._routers.has(routers[i].alias)) {
                continue;
            }
            this._routers.set(routers[i].alias, routers[i]);
        }
        return this;
    }
    find(pathame, method) {
        for (const router of [...this._routers.values()]) {
            for (const route of router.routes.values()) {
                const result = route.test(pathame, method);
                if (!result) {
                    continue;
                }
                return result;
            }
        }
        return undefined;
    }
}
