import type { THttpMethods } from "../http";
import type { HttpRouter } from "./httpRouter";

export class HttpRouterGroup {
    private _routers: Map<string, HttpRouter> = new Map();

    public add(...routers: Array<HttpRouter>) {
        for (const router of routers) {
            if (this._routers.has(router.alias)) {
                continue;
            }

            this._routers.set(router.alias, router);
        }

        return this;
    }

    /**
     *
     * @param pathame
     * @param method
     * @returns
     */
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
