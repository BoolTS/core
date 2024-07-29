import type { THttpMethods } from "../http";
import type { Router } from "./router";

export class RouterGroup {
    private _routers: Map<string, Router> = new Map();

    public add(...routers: Array<Router>) {
        for (let i = 0; i < routers.length; i++) {
            if (this._routers.has(routers[i].alias)) {
                continue;
            }

            this._routers.set(routers[i].alias, routers[i]);
        }

        return this;
    }

    public find(pathame: string, method: keyof THttpMethods) {
        for (const router of this._routers.values()) {
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
