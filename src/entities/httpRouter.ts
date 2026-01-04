import type {
    TCloseInterceptorHandlers,
    TGuardHandlers,
    TOpenInterceptorHandlers
} from "../interfaces";

import HttpRoute from "./httpRoute";

export class HttpRouter {
    public readonly alias: string;

    #routes: Map<string, HttpRoute> = new Map();
    #guardHandlers: TGuardHandlers;
    #openInterceptorHandlers: TOpenInterceptorHandlers;
    #closeInterceptorHandlers: TCloseInterceptorHandlers;

    constructor({
        alias,
        guardHandlers: guards = [],
        openInterceptorHandlers = [],
        closeInterceptorHandlers = []
    }: {
        alias: string;
        guardHandlers?: TGuardHandlers;
        openInterceptorHandlers?: TOpenInterceptorHandlers;
        closeInterceptorHandlers?: TCloseInterceptorHandlers;
    }) {
        this.alias = this._thinAlias(alias);
        this.#guardHandlers = guards;
        this.#openInterceptorHandlers = openInterceptorHandlers;
        this.#closeInterceptorHandlers = closeInterceptorHandlers;
    }

    /**
     *
     * @param alias
     * @returns
     */
    public route({ alias }: { alias: string }) {
        const thinAlias = this._thinAlias(`${this.alias}/${alias}`);
        const route = this.#routes.get(thinAlias);
        const newRoute = !route ? new HttpRoute({ alias: `${this.alias}/${alias}` }) : route;

        if (!route) {
            this.#routes.set(thinAlias, newRoute);
        }

        return newRoute;
    }

    /**
     *
     * @param alias
     * @returns
     */
    private _thinAlias(alias: string) {
        return alias
            .replace(new RegExp("[/]{2,}", "g"), "/")
            .replace(new RegExp("^[/]|[/]$", "g"), "");
    }

    /**
     *
     */
    get routes() {
        return this.#routes;
    }

    get pipes() {
        return Object.freeze({
            guardHandlers: [...this.#guardHandlers],
            openInterceptorHandlers: [...this.#openInterceptorHandlers],
            closeInterceptorHandlers: [...this.#closeInterceptorHandlers]
        });
    }
}

export default HttpRouter;
