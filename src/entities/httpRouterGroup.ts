import type { THttpMethods } from "../http";
import type { THttpRouteModel } from "./httpRoute";
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
     * @param pathname
     * @param method
     * @returns
     */
    public find({ pathname, method }: { pathname: string; method: THttpMethods }): Readonly<{
        parameters: Record<string, string | undefined>;
        model: THttpRouteModel;
    }> | null {
        for (const router of this._routers.values()) {
            for (const route of router.routes.values()) {
                const testResult = route.test({ pathname });

                if (!testResult) {
                    continue;
                }

                const execResult = route.exec({ pathname, method });

                if (!execResult) {
                    continue;
                }

                return execResult;
            }
        }

        return null;
    }
}
