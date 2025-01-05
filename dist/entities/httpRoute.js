"use strict";
export class HttpRoute {
    static rootPattern = ":([a-z0-9A-Z_-]{1,})";
    static innerRootPattern = "([a-z0-9A-Z_-]{1,})";
    alias;
    _map = new Map();
    constructor(alias) {
        this.alias = this._thinAlias(alias);
    }
    test(pathname, method) {
        try {
            const model = this._map.get(method);
            const aliasSplitted = this.alias.split("/");
            const currentPathNameSplitted = this._thinAlias(pathname).split("/");
            if (!model) {
                return undefined;
            }
            // Compare splitted length
            if (aliasSplitted.length !== currentPathNameSplitted.length) {
                return undefined;
            }
            const parameters = Object();
            const matchingRegex = this.alias.replace(new RegExp(HttpRoute.rootPattern, "g"), HttpRoute.innerRootPattern);
            if (!new RegExp(matchingRegex).test(this._thinAlias(pathname))) {
                return undefined;
            }
            for (let index = 0; index < aliasSplitted.length; index++) {
                const aliasPart = aliasSplitted[index];
                const pathnamePart = currentPathNameSplitted[index];
                // Check pathmane path match a dynamic syntax, if no match => start compare equal or not
                if (!new RegExp(HttpRoute.rootPattern, "g").test(aliasPart)) {
                    if (aliasPart !== pathnamePart)
                        return undefined;
                }
                else {
                    let isFailed = false;
                    aliasPart.replace(new RegExp(HttpRoute.rootPattern, "g"), (match, key, offset) => {
                        if (offset === 0) {
                            pathnamePart.replace(new RegExp(HttpRoute.innerRootPattern, "g"), (innerMatch, innerKey, innerOffset) => {
                                if (innerOffset === 0) {
                                    Object.assign(parameters, {
                                        [key]: innerMatch
                                    });
                                }
                                return innerMatch;
                            });
                        }
                        return match;
                    });
                    if (isFailed) {
                        return undefined;
                    }
                }
                continue;
            }
            return Object.freeze({
                parameters: parameters,
                model: model
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
                if (!new RegExp(HttpRoute.rootPattern, "g").test(aliasPart)) {
                    if (aliasPart !== pathnamePart) {
                        return false;
                    }
                }
                else {
                    let isFailed = false;
                    aliasPart.replace(new RegExp(HttpRoute.rootPattern, "g"), (subString, key, value) => {
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
    get(handler) {
        const currenTHttpRouteModel = this._map.get("GET");
        if (!currenTHttpRouteModel) {
            this._map.set("GET", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    post(handler) {
        const currenTHttpRouteModel = this._map.get("POST");
        if (!currenTHttpRouteModel) {
            this._map.set("POST", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    put(handler) {
        const currenTHttpRouteModel = this._map.get("PUT");
        if (!currenTHttpRouteModel) {
            this._map.set("PUT", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    delete(handler) {
        const currenTHttpRouteModel = this._map.get("DELETE");
        if (!currenTHttpRouteModel) {
            this._map.set("DELETE", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    connect(handler) {
        const currenTHttpRouteModel = this._map.get("CONNECT");
        if (!currenTHttpRouteModel) {
            return this._map.set("CONNECT", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    options(handler) {
        const currenTHttpRouteModel = this._map.get("OPTIONS");
        if (!currenTHttpRouteModel) {
            return this._map.set("OPTIONS", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    trace(handler) {
        const currenTHttpRouteModel = this._map.get("TRACE");
        if (!currenTHttpRouteModel) {
            return this._map.set("TRACE", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    patch(handler) {
        const currenTHttpRouteModel = this._map.get("PATCH");
        if (!currenTHttpRouteModel) {
            return this._map.set("PATCH", handler);
        }
        return this;
    }
    /**
     *
     * @param handlers
     * @returns
     */
    _thinAlias(alias) {
        return alias
            .replace(new RegExp("[/]{2,}", "g"), "/")
            .replace(new RegExp("^[/]|[/]$", "g"), "");
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
export default HttpRoute;
