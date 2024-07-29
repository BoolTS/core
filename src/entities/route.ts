"use strict";

import type { THttpMethods } from "../http";

type THandler = (req: Request) => any;

export class Route {
    public static rootPattern = ":([a-z0-9A-Z_.-]{1,})(\\(.*?\\))";

    public readonly alias: string;
    private _map = new Map<keyof THttpMethods, Array<(req: Request) => any>>();

    constructor(alias: string) {
        this.alias = this._thinAlias(alias);
    }

    public test(
        pathname: string,
        method: keyof THttpMethods
    ): Readonly<{ params: Record<string, string>; handlers: Array<THandler> }> | false | undefined {
        try {
            const handlers = this._map.get(method);
            const aliasSplitted = this.alias.split("/");
            const currentPathNameSplitted = this._thinAlias(pathname).split("/");

            if (!handlers) {
                return undefined;
            }

            // Compare splitted length
            if (aliasSplitted.length !== currentPathNameSplitted.length) {
                return undefined;
            }

            const parameters: Record<string, string> = Object();

            for (let index = 0; index < aliasSplitted.length; index++) {
                const aliasPart = aliasSplitted[index];
                const pathnamePart = currentPathNameSplitted[index];

                // Check pathmane path match a dynamic syntax, if no match => start compare equal or not
                if (!new RegExp(Route.rootPattern, "g").test(aliasPart)) {
                    if (aliasPart !== pathnamePart) {
                        return undefined;
                    }
                } else {
                    let isFailed = false;

                    aliasPart.replace(new RegExp(Route.rootPattern, "g"), (subString, key, value) => {
                        if (!new RegExp(value, "g").test(pathnamePart)) {
                            isFailed = true;
                        } else {
                            Object.assign(parameters, {
                                [key]: pathnamePart
                            });
                        }
                        return "";
                    });

                    if (isFailed) {
                        return undefined;
                    }
                }

                continue;
            }

            return Object.freeze({
                params: parameters,
                handlers: handlers
            });
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     *
     */
    public isMatch(pathname: string) {
        try {
            const aliasSplitted = this.alias.split("/");
            const currentPathNameSplitted = this._thinAlias(pathname).split("/");

            // Compare splitted length
            if (aliasSplitted.length !== currentPathNameSplitted.length) {
                return false;
            }

            const parameters = Object();

            for (let index = 0; index < aliasSplitted.length; index++) {
                const aliasPart = aliasSplitted[index];
                const pathnamePart = currentPathNameSplitted[index];

                // Check pathmane path match a dynamic syntax, if no match => start compare equal or not
                if (!new RegExp(Route.rootPattern, "g").test(aliasPart)) {
                    if (aliasPart !== pathnamePart) {
                        return false;
                    }
                } else {
                    let isFailed = false;

                    aliasPart.replace(new RegExp(Route.rootPattern, "g"), (subString, key, value) => {
                        if (!new RegExp(value, "g").test(pathnamePart)) {
                            isFailed = true;
                        } else {
                            Object.assign(parameters, {
                                [key]: pathnamePart
                            });
                        }
                        return "";
                    });

                    if (isFailed) {
                        return false;
                    }
                }

                continue;
            }

            return true;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    public get(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("GET");

        if (currentHandlers) {
            return;
        }

        this._map.set("GET", handlers);
    }

    public post(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("POST");

        if (currentHandlers) {
            return;
        }

        this._map.set("POST", handlers);
    }

    public put(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("PUT");

        if (currentHandlers) {
            return;
        }

        this._map.set("PUT", handlers);
    }

    public delete(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("DELETE");

        if (currentHandlers) {
            return;
        }

        this._map.set("DELETE", handlers);
    }

    public connect(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("CONNECT");

        if (currentHandlers) {
            return;
        }

        this._map.set("CONNECT", handlers);
    }

    public options(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("OPTIONS");

        if (currentHandlers) {
            return;
        }

        this._map.set("OPTIONS", handlers);
    }

    public trace(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("TRACE");

        if (currentHandlers) {
            return;
        }

        this._map.set("TRACE", handlers);
    }

    public patch(...handlers: Array<THandler>) {
        const currentHandlers = this._map.get("PATCH");

        if (currentHandlers) {
            return;
        }

        this._map.set("PATCH", handlers);
    }

    private _thinAlias(alias: string) {
        return alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
    }

    /**
     * Internal get fullpath after check regular expression
     * @returns
     */
    get _fullPath(): string {
        // Split path to start filter
        const pathSplited = this.alias.split("/");

        const blockFiltered = pathSplited.map((value, index) => {
            // Initialize full parameter regex to validate
            let validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})(\\(.*?\\))", "g");

            if (!validateReg.test(value)) {
                // Initialize key parameter regex to validate
                validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})", "g");

                if (!validateReg.test(value)) {
                    return value;
                }

                return value.replace(validateReg, (value, index) => `${value}(.*?)`);
            }

            return value;
        });

        return blockFiltered.join("/");
    }

    /**
     * Internal get filterd path after check regular expression
     * @returns
     */
    get _filteredPath(): string {
        // Split path to start filter
        const pathSplited = this.alias.split("/");

        //
        const blockFiltered = pathSplited.map((value, index) => {
            let validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})((.*?))", "g");

            if (!validateReg.test(value)) {
                // Initialize key parameter regex to validate
                validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})", "g");

                if (!validateReg.test(value)) {
                    return value;
                }

                return value.replace(validateReg, (value, index) => "(.*?)");
            }

            return value.replace(validateReg, (subString, arg_01, arg_02) => arg_02);
        });

        return blockFiltered.join("/");
    }
}

export default Route;
