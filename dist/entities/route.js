"use strict";
export class Route {
    static rootPattern = ":([a-z0-9A-Z_.-]{1,})";
    alias;
    _map = new Map();
    constructor(alias) {
        this.alias = this._thinAlias(alias);
    }
    test(pathname, method) {
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
            const parameters = Object();
            for (let index = 0; index < aliasSplitted.length; index++) {
                const aliasPart = aliasSplitted[index];
                const pathnamePart = currentPathNameSplitted[index];
                // Check pathmane path match a dynamic syntax, if no match => start compare equal or not
                if (!new RegExp(Route.rootPattern, "g").test(aliasPart)) {
                    if (aliasPart !== pathnamePart)
                        return undefined;
                }
                else {
                    let isFailed = false;
                    aliasPart.replace(new RegExp(Route.rootPattern, "g"), (match, key, offset) => {
                        if (offset === 0) {
                            Object.assign(parameters, {
                                [key]: pathnamePart
                            });
                        }
                        return match;
                    });
                    if (isFailed) {
                        console.log(3, "isFailed", isFailed);
                        return undefined;
                    }
                }
                continue;
            }
            return Object.freeze({
                params: parameters,
                handlers: handlers
            });
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    /**
     *
     */
    isMatch(pathname, method) {
        try {
            const handlers = this._map.get(method);
            if (!handlers) {
                return undefined;
            }
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
                }
                else {
                    let isFailed = false;
                    aliasPart.replace(new RegExp(Route.rootPattern, "g"), (subString, key, value) => {
                        if (!new RegExp(value, "g").test(pathnamePart)) {
                            isFailed = true;
                        }
                        else {
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
        }
        catch (err) {
            console.error(err);
            return undefined;
        }
    }
    /**
     *
     * @param handlers
     * @returns
     */
    get(...handlers) {
        const currentHandlers = this._map.get("GET");
        if (!currentHandlers) {
            this._map.set("GET", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    post(...handlers) {
        const currentHandlers = this._map.get("POST");
        if (!currentHandlers) {
            this._map.set("POST", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    put(...handlers) {
        const currentHandlers = this._map.get("PUT");
        if (!currentHandlers) {
            this._map.set("PUT", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    delete(...handlers) {
        const currentHandlers = this._map.get("DELETE");
        if (!currentHandlers) {
            this._map.set("DELETE", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    connect(...handlers) {
        const currentHandlers = this._map.get("CONNECT");
        if (!currentHandlers) {
            return this._map.set("CONNECT", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    options(...handlers) {
        const currentHandlers = this._map.get("OPTIONS");
        if (!currentHandlers) {
            return this._map.set("OPTIONS", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    trace(...handlers) {
        const currentHandlers = this._map.get("TRACE");
        if (!currentHandlers) {
            return this._map.set("TRACE", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    patch(...handlers) {
        const currentHandlers = this._map.get("PATCH");
        if (!currentHandlers) {
            return this._map.set("PATCH", handlers);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    _thinAlias(alias) {
        return alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
    }
    /**
     * Internal get fullpath after check regular expression
     * @returns
     */
    get _fullPath() {
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
    get _filteredPath() {
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
