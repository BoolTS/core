import type { TArgumentsMetadataCollection } from "../decorators/arguments";
import type { THttpMethods } from "../http";

export type THttpRouteModel<T = unknown> = Readonly<{
    class: new (...args: Array<any>) => T;
    funcName: string | symbol;
    func: (...args: Array<any>) => unknown;
    argumentsMetadata: TArgumentsMetadataCollection;
}>;

const BASE_URL = "https://www.booljs.com";

export class HttpRoute {
    public readonly alias: string;

    #map = new Map<THttpMethods, THttpRouteModel>();
    #urlPattern: URLPattern;

    constructor({ alias }: { alias: string }) {
        const thinAlias = this._thinAlias(alias);

        this.alias = thinAlias;
        this.#urlPattern = new URLPattern({
            pathname: thinAlias,
            baseURL: BASE_URL
        });
    }

    /**
     *
     * @param pathname
     * @param method
     * @returns
     */
    public test({ pathname }: { pathname: string }): boolean {
        try {
            return this.#urlPattern.test({
                pathname: this._thinAlias(pathname),
                baseURL: BASE_URL
            });
        } catch (error) {
            console.error(error);

            return false;
        }
    }

    public exec({ pathname, method }: { pathname: string; method: THttpMethods }): Readonly<{
        parameters: Record<string, string | undefined>;
        model: THttpRouteModel;
    }> | null {
        try {
            const model = this.#map.get(method);

            if (!model) {
                return null;
            }

            const inferResult = this.#urlPattern.exec({
                pathname: this._thinAlias(pathname),
                baseURL: BASE_URL
            });

            if (!inferResult) {
                return null;
            }

            const parameters = inferResult.pathname.groups;

            return Object.freeze({
                parameters: parameters,
                model: model
            });
        } catch (error) {
            console.error(error);

            return null;
        }
    }

    /**
     *
     * @param model
     * @returns
     */
    public get({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("GET");

        if (!currenTHttpRouteModel) {
            this.#map.set("GET", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    public post({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("POST");

        if (!currenTHttpRouteModel) {
            this.#map.set("POST", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    public put({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("PUT");

        if (!currenTHttpRouteModel) {
            this.#map.set("PUT", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    public delete({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("DELETE");

        if (!currenTHttpRouteModel) {
            this.#map.set("DELETE", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    public connect({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("CONNECT");

        if (!currenTHttpRouteModel) {
            return this.#map.set("CONNECT", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    public options({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("OPTIONS");

        if (!currenTHttpRouteModel) {
            return this.#map.set("OPTIONS", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    public trace({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("TRACE");

        if (!currenTHttpRouteModel) {
            return this.#map.set("TRACE", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    public patch({ model }: { model: THttpRouteModel }) {
        const currenTHttpRouteModel = this.#map.get("PATCH");

        if (!currenTHttpRouteModel) {
            return this.#map.set("PATCH", model);
        }

        return this;
    }

    /**
     *
     * @param model
     * @returns
     */
    private _thinAlias(alias: string) {
        return alias
            .replace(new RegExp("[/]{2,}", "g"), "/")
            .replace(new RegExp("^[/]|[/]$", "g"), "");
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

export default HttpRoute;
