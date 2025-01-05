import type { THttpMethods } from "../http";
import type { HttpRouter } from "./httpRouter";

export class HttpRouterGroup {
    private _routers: Map<string, HttpRouter> = new Map();

    public add(...routers: Array<HttpRouter>) {
        for (let i = 0; i < routers.length; i++) {
            if (this._routers.has(routers[i].alias)) {
                continue;
            }

            this._routers.set(routers[i].alias, routers[i]);
        }

        return this;
    }

    public find(pathame: string, method: keyof THttpMethods) {
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
