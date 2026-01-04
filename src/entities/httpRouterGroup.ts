import type { THttpMethods } from "../http";
import type {
    TCloseInterceptorHandlers,
    TGuardHandlers,
    TOpenInterceptorHandlers
} from "../interfaces";
import type { THttpRouteModel } from "./httpRoute";
import type { HttpRouter } from "./httpRouter";

export class HttpRouterGroup {
    #routers: Map<string, HttpRouter> = new Map();

    public add(...routers: Array<HttpRouter>) {
        for (const router of routers) {
            if (this.#routers.has(router.alias)) {
                continue;
            }

            this.#routers.set(router.alias, router);
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
        guardHandlers: TGuardHandlers;
        openInterceptorHandlers: TOpenInterceptorHandlers;
        closeInterceptorHandlers: TCloseInterceptorHandlers;
    }> | null {
        for (const router of this.#routers.values()) {
            for (const route of router.routes.values()) {
                const testResult = route.test({ pathname });

                if (!testResult) {
                    continue;
                }

                const execResult = route.exec({ pathname, method });

                if (!execResult) {
                    continue;
                }

                return Object.freeze({
                    ...execResult,
                    ...router.pipes
                });
            }
        }

        return null;
    }
}
