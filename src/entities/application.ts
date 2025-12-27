import type { BunFile, Server } from "bun";
import type {
    TArgumentsMetadataCollection,
    TContainerMetadata,
    TControllerMetadata,
    TModuleMetadata,
    TWebSocketEventHandlerMetadata,
    TWebSocketMetadata
} from "../decorators";
import type { THttpMethods } from "../http";
import type { IGuard, IInterceptor, IMiddleware } from "../interfaces";
import type { ICustomValidator } from "../interfaces/customValidator";
import type { TConstructor } from "../ultils";

import { ETimeUnit, add as TimeAdd } from "@bool-ts/date-time";
import { parse as QsParse } from "qs";
import {
    HttpClientError,
    httpMethods,
    httpMethodsStandardization,
    HttpServerError,
    jsonErrorInfer
} from "../http";
import {
    argumentsKey,
    configKey,
    containerKey,
    contextArgsKey,
    controllerKey,
    httpServerArgsKey,
    moduleKey,
    paramArgsKey,
    paramsArgsKey,
    queryArgsKey,
    requestArgsKey,
    requestBodyArgsKey,
    requestHeaderArgsKey,
    requestHeadersArgsKey,
    responseBodyArgsKey,
    responseHeadersArgsKey,
    responseStatusArgsKey,
    responseStatusTextArgsKey,
    routeModelArgsKey,
    webSocketCloseCodeArgsKey,
    webSocketCloseReasonArgsKey,
    webSocketConnectionArgsKey,
    webSocketKey,
    webSocketMessageArgsKey,
    webSocketServerArgsKey
} from "../keys";
import { ansiText, isWebSocketUpgrade } from "../ultils";
import { Context } from "./context";
import { HttpRouter } from "./httpRouter";
import { HttpRouterGroup } from "./httpRouterGroup";
import { Injector } from "./injector";
import { ValidationFailed } from "./validationFailed";
import { WebSocketRoute } from "./webSocketRoute";
import { WebSocketRouter } from "./webSocketRouter";
import { WebSocketRouterGroup } from "./webSocketRouterGroup";

type TParamsType = Record<string, string>;

type TApplicationOptions<AllowedMethods extends Array<THttpMethods> = Array<THttpMethods>> =
    Required<{
        port: number;
    }> &
        Partial<{
            config: Record<string | symbol, any> | (() => Record<string | symbol, any>);
            prefix: string;
            debug: boolean;
            log: Partial<{
                methods: AllowedMethods;
            }>;
            queryParser: Parameters<typeof QsParse>[1];
            static: Required<{
                path: string;
            }> &
                Partial<{
                    headers: TParamsType;
                    cacheTimeInSeconds: number;
                }>;
            cors: Partial<{
                credentials: boolean;
                origins: string | Array<string>;
                methods: Array<THttpMethods>;
                headers: Array<string>;
            }>;
        }>;

type TGroupElementModel<
    TFuncName extends keyof TClass,
    TClass extends Object = Object,
    TFunc = TClass[TFuncName]
> = Readonly<{
    class: TClass;
    func: TFunc;
    funcName: TFuncName;
    argumentsMetadata: TArgumentsMetadataCollection;
}>;

type TStaticMap = Map<
    string,
    Readonly<{
        expiredAt: Date;
        file: BunFile;
    }>
>;

type TResolutedOptions = Readonly<{
    allowLogsMethods: Array<THttpMethods>;
    allowOrigins: Array<string>;
    allowMethods: Array<THttpMethods>;
    allowHeaders: Array<string>;
    allowCredentials: boolean;
    staticOption?: Required<{
        path: string;
    }> &
        Partial<{
            headers: TParamsType;
            cacheTimeInSeconds: number;
        }>;
}>;

type TWebSocketUpgradeData = {
    pathname: string;
    method: string;
    query: Record<string, unknown>;
};

type TPreLaunch =
    | undefined
    | Readonly<{
          containerMetadata: TContainerMetadata;
          modulesConverted: Array<TConstructor<unknown>>;
          resolutedContainer?: Awaited<ReturnType<Application["containerResolution"]>>;
          resolutedModules: Array<Awaited<ReturnType<Application["moduleResolution"]>>>;
          webSocketsMap: Map<string, TWebSocketEventHandlerMetadata>;
      }>;

type TValidator = undefined | ICustomValidator;

export class Application<TRootClass extends Object = Object> {
    #preLaunchData: TPreLaunch;
    #inputedConstructorKeys: Array<any>;
    #injector = new Injector();
    #staticMap: TStaticMap = new Map();
    #resolutedOptions: TResolutedOptions;
    #staticCacheTimeInSecond: number = 900;
    #customValidator: TValidator;

    constructor(
        private readonly classConstructor: TConstructor<TRootClass>,
        private readonly options: TApplicationOptions
    ) {
        this.#inputedConstructorKeys = Reflect.getOwnMetadataKeys(classConstructor);

        if (
            !this.#inputedConstructorKeys.includes(containerKey) &&
            !this.#inputedConstructorKeys.includes(moduleKey)
        ) {
            throw Error(
                `Can not detect! ${classConstructor.name} class is not a container or module.`
            );
        }

        this.#staticCacheTimeInSecond =
            typeof options.static?.cacheTimeInSeconds !== "number"
                ? 900
                : options.static.cacheTimeInSeconds;

        this.#resolutedOptions = Object.freeze({
            allowLogsMethods: this.options?.log?.methods || [],
            staticOption: this.options.static,
            allowOrigins: !this.options.cors?.origins
                ? ["*"]
                : typeof this.options.cors.origins !== "string"
                ? this.options.cors.origins.includes("*") || this.options.cors.origins.length < 1
                    ? ["*"]
                    : this.options.cors.origins
                : [this.options.cors.origins !== "*" ? this.options.cors.origins : "*"],
            allowMethods: this.options.cors?.methods || httpMethods,
            allowCredentials: !this.options.cors?.credentials ? false : true,
            allowHeaders:
                !this.options.cors?.headers || this.options.cors.headers.includes("*")
                    ? ["*"]
                    : this.options.cors.headers
        });
    }

    public useValidator(validator: ICustomValidator) {
        this.#customValidator = validator;
    }

    /**
     *
     * @returns
     */
    public async preLaunch(): Promise<NonNullable<TPreLaunch>> {
        if (this.#preLaunchData) {
            return this.#preLaunchData;
        }

        const containerMetadata: TContainerMetadata = !this.#inputedConstructorKeys.includes(
            containerKey
        )
            ? undefined
            : Reflect.getOwnMetadata(containerKey, this.classConstructor);

        const modulesConverted = !this.#inputedConstructorKeys.includes(containerKey)
            ? [this.classConstructor]
            : containerMetadata?.modules || [];

        const resolutedContainer = !containerMetadata
            ? undefined
            : await this.containerResolution({
                  containerClass: this.classConstructor,
                  options: this.options,
                  extendInjector: this.#injector
              });

        const resolutedModules = await Promise.all(
            modulesConverted.map((moduleConverted) =>
                this.moduleResolution({
                    moduleClass: moduleConverted,
                    options: this.options,
                    extendInjector: !resolutedContainer
                        ? this.#injector
                        : resolutedContainer.injector
                })
            )
        );

        const prefixs = [
            ...new Set(
                resolutedModules.map(
                    (availableModuleResolution) => availableModuleResolution.prefix
                )
            )
        ];

        if (prefixs.length !== resolutedModules.length) {
            throw Error("Module prefix should be unique.");
        }

        const webSocketsMap = new Map<string, TWebSocketEventHandlerMetadata>();

        for (const availableModuleResolution of resolutedModules) {
            const webSocketMap = availableModuleResolution.webSocketRouterGroup.execute();

            for (const [key, metadata] of webSocketMap.entries()) {
                webSocketsMap.set(key, metadata);
            }
        }

        const preLaunchData = Object.freeze({
            containerMetadata,
            modulesConverted,
            resolutedContainer,
            resolutedModules,
            webSocketsMap
        });

        this.#preLaunchData = preLaunchData;

        return preLaunchData;
    }

    /**
     * Start listen app on a port
     * @param port
     */
    public async listen() {
        const {
            allowLogsMethods,
            allowOrigins,
            allowMethods,
            allowHeaders,
            allowCredentials,
            staticOption
        } = this.#resolutedOptions;

        const { resolutedContainer, resolutedModules, webSocketsMap } = await this.preLaunch();

        const server = Bun.serve<TWebSocketUpgradeData>({
            port: this.options.port,
            fetch: async (request, server) => {
                const start = performance.now(),
                    url = new URL(request.url),
                    query = QsParse(url.searchParams.toString(), this.options.queryParser),
                    origin = request.headers.get("origin") || "*",
                    method = request.method.toUpperCase(),
                    responseHeaders = new Headers();

                let context = new Context()
                    .setOptions({ isStatic: true })
                    .set(httpServerArgsKey, server)
                    .set(requestArgsKey, request)
                    .set(requestHeaderArgsKey, request.headers)
                    .set(responseHeadersArgsKey, responseHeaders)
                    .set(queryArgsKey, query);

                try {
                    const validateRequestMethod = httpMethodsStandardization(method);

                    if (!validateRequestMethod) {
                        return this.finalizeResponse(
                            new Response(
                                JSON.stringify({
                                    httpCode: 405,
                                    message: "Method Not Allowed.",
                                    data: undefined
                                }),
                                {
                                    status: 405,
                                    statusText: "Method Not Allowed.",
                                    headers: responseHeaders
                                }
                            )
                        );
                    }

                    const isUpgradable = isWebSocketUpgrade(request);

                    let collection:
                        | undefined
                        | Required<{
                              route: NonNullable<ReturnType<HttpRouterGroup["find"]>>;
                              resolution: NonNullable<
                                  Awaited<ReturnType<Application<TRootClass>["moduleResolution"]>>
                              >;
                          }>;

                    if (isUpgradable) {
                        for (const availableModuleResolution of resolutedModules) {
                            const routeResult =
                                availableModuleResolution.webSocketHttpRouterGroup.find({
                                    pathname: url.pathname,
                                    method: method
                                });

                            if (routeResult) {
                                collection = Object.freeze({
                                    route: routeResult,
                                    resolution: availableModuleResolution
                                });
                                break;
                            }
                        }

                        if (!collection) {
                            return this.finalizeResponse(
                                new Response(
                                    JSON.stringify({
                                        httpCode: 404,
                                        message: "Route not found.",
                                        data: undefined
                                    }),
                                    {
                                        status: 404,
                                        statusText: "Not found.",
                                        headers: responseHeaders
                                    }
                                )
                            );
                        }

                        const upgradeResult = await this.webSocketFetcher(
                            {
                                request,
                                server
                            },
                            {
                                query: query,
                                responseHeaders: responseHeaders,
                                route: collection.route,
                                moduleResolution: collection.resolution
                            }
                        );

                        return upgradeResult instanceof Response ? upgradeResult : undefined;
                    }

                    [
                        ...(!allowCredentials
                            ? []
                            : [
                                  {
                                      key: "Access-Control-Allow-Credentials",
                                      value: "true"
                                  }
                              ]),
                        {
                            key: "Access-Control-Allow-Origin",
                            value: allowOrigins.includes("*")
                                ? "*"
                                : !allowOrigins.includes(origin)
                                ? allowOrigins[0]
                                : origin
                        },
                        { key: "Access-Control-Allow-Methods", value: allowMethods.join(", ") },
                        { key: "Access-Control-Allow-Headers", value: allowHeaders.join(", ") }
                    ].forEach(({ key, value }) => responseHeaders.set(key, value));

                    if (!allowMethods.includes(method)) {
                        return this.finalizeResponse(
                            new Response(undefined, {
                                status: 405,
                                statusText: "Method Not Allowed.",
                                headers: responseHeaders
                            })
                        );
                    }

                    if (request.method.toUpperCase() === "OPTIONS") {
                        return this.finalizeResponse(
                            allowOrigins.includes("*") || allowOrigins.includes(origin)
                                ? new Response(undefined, {
                                      status: 204,
                                      statusText: "No Content.",
                                      headers: responseHeaders
                                  })
                                : new Response(undefined, {
                                      status: 417,
                                      statusText: "Expectation Failed.",
                                      headers: responseHeaders
                                  })
                        );
                    }

                    if (staticOption) {
                        const { path, headers } = staticOption;
                        const pathname = `${path}/${url.pathname}`;
                        const cachedFile = this.#staticMap.get(pathname);

                        if (!cachedFile) {
                            const file = Bun.file(pathname);
                            const isFileExists = await file.exists();

                            if (isFileExists) {
                                if (headers) {
                                    for (const [key, value] of Object.entries(headers)) {
                                        responseHeaders.set(key, value);
                                    }
                                }

                                responseHeaders.set("Content-Type", file.type);

                                return this.finalizeResponse(
                                    new Response(await file.arrayBuffer(), {
                                        status: 200,
                                        statusText: "SUCCESS",
                                        headers: responseHeaders
                                    })
                                );
                            }
                        } else {
                            const isExpired = new Date() > cachedFile.expiredAt;

                            if (isExpired) {
                                this.#staticMap.delete(pathname);
                            }

                            const file = !isExpired ? cachedFile.file : Bun.file(pathname);
                            const isFileExists = await file.exists();

                            if (isFileExists) {
                                this.#staticMap.set(
                                    pathname,
                                    Object.freeze({
                                        expiredAt: TimeAdd(
                                            new Date(),
                                            this.#staticCacheTimeInSecond,
                                            ETimeUnit.seconds
                                        ),
                                        file: file
                                    })
                                );

                                if (headers) {
                                    for (const [key, value] of Object.entries(headers)) {
                                        responseHeaders.set(key, value);
                                    }
                                }

                                responseHeaders.set("Content-Type", file.type);

                                return this.finalizeResponse(
                                    new Response(await file.arrayBuffer(), {
                                        status: 200,
                                        statusText: "SUCCESS",
                                        headers: responseHeaders
                                    })
                                );
                            }
                        }
                    }

                    for (const availableModuleResolution of resolutedModules) {
                        const routeResult = availableModuleResolution.controllerRouterGroup.find({
                            pathname: url.pathname,
                            method: method
                        });

                        if (routeResult) {
                            collection = Object.freeze({
                                route: routeResult,
                                resolution: availableModuleResolution
                            });
                            break;
                        }
                    }

                    if (resolutedContainer) {
                        const { context: newContext } = await this.httpFetcher({
                            context: context,
                            route: collection?.route,
                            resolutedMap: {
                                injector: resolutedContainer.injector,
                                startMiddlewareGroup: resolutedContainer.startMiddlewareGroup,
                                guardGroup: resolutedContainer.guardGroup
                            },
                            options: {
                                isContainer: true
                            }
                        });

                        context = newContext;
                    }

                    if (!collection) {
                        context
                            .setOptions({ isStatic: false })
                            .set(responseStatusArgsKey, 404)
                            .set(responseStatusTextArgsKey, "Not found.")
                            .set(
                                responseBodyArgsKey,
                                JSON.stringify({
                                    httpCode: 404,
                                    message: "Route not found.",
                                    data: undefined
                                })
                            );
                    } else {
                        const { context: newContext } = await this.httpFetcher({
                            context: context,
                            route: collection.route,
                            resolutedMap: collection.resolution
                        });

                        context = newContext;
                    }

                    if (resolutedContainer) {
                        const { context: newContext } = await this.httpFetcher({
                            context: context,
                            resolutedMap: {
                                injector: resolutedContainer.injector,
                                endMiddlewareGroup: resolutedContainer.endMiddlewareGroup
                            },
                            options: {
                                isContainer: true
                            }
                        });

                        context = newContext;
                    }

                    const latestResponseHeaders =
                            context.get<Headers | null | undefined>(responseHeadersArgsKey, {
                                isStatic: true
                            }) || new Headers(),
                        latestResponseBody =
                            context.get<unknown>(responseBodyArgsKey, { isStatic: false }) ||
                            undefined,
                        latestResponseStatus = context.get<unknown>(responseStatusArgsKey, {
                            isStatic: false
                        }),
                        latestResponseStatusText = context.get<unknown>(responseStatusTextArgsKey, {
                            isStatic: false
                        });

                    return this.serializeResponse({
                        status:
                            typeof latestResponseStatus !== "number"
                                ? method === "POST"
                                    ? 201
                                    : undefined
                                : latestResponseStatus,
                        statusText:
                            typeof latestResponseStatusText !== "string"
                                ? undefined
                                : latestResponseStatusText,
                        headers: latestResponseHeaders,
                        data: latestResponseBody
                    });
                } catch (error) {
                    this.options.debug && console.error(error);

                    return this.finalizeResponse(jsonErrorInfer(error, responseHeaders));
                } finally {
                    if (allowLogsMethods) {
                        const end = performance.now();
                        const pathname = ansiText(url.pathname, { color: "blue" });
                        const convertedPID = `${Bun.color("yellow", "ansi")}${process.pid}`;
                        const convertedMethod = ansiText(request.method, {
                            color: "yellow",
                            backgroundColor: "blue"
                        });
                        const convertedReqIp = ansiText(
                            `${
                                request.headers.get("x-forwarded-for") ||
                                request.headers.get("x-real-ip") ||
                                server.requestIP(request)?.address ||
                                "<Unknown>"
                            }`,
                            {
                                color: "yellow"
                            }
                        );
                        const convertedTime = ansiText(
                            `${Math.round((end - start + Number.EPSILON) * 10 ** 2) / 10 ** 2}ms`,
                            {
                                color: "yellow",
                                backgroundColor: "blue"
                            }
                        );

                        allowLogsMethods.includes(
                            request.method.toUpperCase() as (typeof allowLogsMethods)[number]
                        ) &&
                            console.info(
                                `PID: ${convertedPID} - Method: ${convertedMethod} - IP: ${convertedReqIp} - ${pathname} - Time: ${convertedTime}`
                            );
                    }
                }
            },
            websocket: {
                open: (connection) => {
                    const pathnameKey = `${connection.data.pathname}:::open`;
                    const handlerMetadata = webSocketsMap.get(pathnameKey);

                    if (!handlerMetadata) {
                        return;
                    }

                    const argumentsMetadata = handlerMetadata.arguments || {};
                    const args: Array<unknown> = [];

                    for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argumentMetadata.type) {
                            case webSocketConnectionArgsKey:
                                args[argumentMetadata.index] = connection;
                                break;
                            case webSocketServerArgsKey:
                                args[argumentMetadata.index] = server;
                                break;
                        }
                    }

                    handlerMetadata.descriptor.value(...args);
                },
                close: (connection, code, reason) => {
                    const pathnameKey = `${connection.data.pathname}:::close`;
                    const handlerMetadata = webSocketsMap.get(pathnameKey);

                    if (!handlerMetadata) {
                        return;
                    }

                    const argumentsMetadata = handlerMetadata.arguments || {};
                    const args: Array<unknown> = [];

                    for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argumentMetadata.type) {
                            case webSocketConnectionArgsKey:
                                args[argumentMetadata.index] = connection;
                                break;
                            case webSocketServerArgsKey:
                                args[argumentMetadata.index] = server;
                                break;
                            case webSocketCloseCodeArgsKey:
                                args[argumentMetadata.index] = code;
                                break;
                            case webSocketCloseReasonArgsKey:
                                args[argumentMetadata.index] = reason;
                                break;
                        }
                    }

                    handlerMetadata.descriptor.value(...args);
                },
                message: (connection, message) => {
                    const pathnameKey = `${connection.data.pathname}:::message`;
                    const handlerMetadata = webSocketsMap.get(pathnameKey);

                    if (!handlerMetadata) {
                        return;
                    }

                    const argumentsMetadata = handlerMetadata.arguments || {};
                    const args: Array<unknown> = [];

                    for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argumentMetadata.type) {
                            case webSocketConnectionArgsKey:
                                args[argumentMetadata.index] = connection;
                                break;
                            case webSocketMessageArgsKey:
                                args[argumentMetadata.index] = message;
                                break;
                            case webSocketServerArgsKey:
                                args[argumentMetadata.index] = server;
                                break;
                        }
                    }

                    handlerMetadata.descriptor.value(...args);
                },
                drain: (connection) => {
                    const pathnameKey = `${connection.data.pathname}:::drain`;
                    const handlerMetadata = webSocketsMap.get(pathnameKey);

                    if (!handlerMetadata) {
                        return;
                    }

                    const argumentsMetadata = handlerMetadata.arguments || {};
                    const args: Array<unknown> = [];

                    for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argumentMetadata.type) {
                            case webSocketConnectionArgsKey:
                                args[argumentMetadata.index] = connection;
                                break;
                            case webSocketServerArgsKey:
                                args[argumentMetadata.index] = server;
                                break;
                        }
                    }

                    handlerMetadata.descriptor.value(...args);
                },
                ping: (connection, data) => {
                    const pathnameKey = `${connection.data.pathname}:::ping`;
                    const handlerMetadata = webSocketsMap.get(pathnameKey);

                    if (!handlerMetadata) {
                        return;
                    }

                    const argumentsMetadata = handlerMetadata.arguments || {};
                    const args: Array<unknown> = [];

                    for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argumentMetadata.type) {
                            case webSocketConnectionArgsKey:
                                args[argumentMetadata.index] = connection;
                                break;
                            case webSocketServerArgsKey:
                                args[argumentMetadata.index] = server;
                                break;
                            case webSocketMessageArgsKey:
                                args[argumentMetadata.index] = data;
                                break;
                        }
                    }

                    handlerMetadata.descriptor.value(...args);
                },
                pong: (connection, data) => {
                    const pathnameKey = `${connection.data.pathname}:::pong`;
                    const handlerMetadata = webSocketsMap.get(pathnameKey);

                    if (!handlerMetadata) {
                        return;
                    }

                    const argumentsMetadata = handlerMetadata.arguments || {};
                    const args: Array<unknown> = [];

                    for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argumentMetadata.type) {
                            case webSocketConnectionArgsKey:
                                args[argumentMetadata.index] = connection;
                                break;
                            case webSocketServerArgsKey:
                                args[argumentMetadata.index] = server;
                                break;
                            case webSocketMessageArgsKey:
                                args[argumentMetadata.index] = data;
                                break;
                        }
                    }

                    handlerMetadata.descriptor.value(...args);
                }
            }
        });
    }

    /**
     *
     * @param param0
     * @returns
     */
    private async containerResolution({
        containerClass,
        options,
        extendInjector
    }: {
        containerClass: TConstructor<unknown>;
        options: TApplicationOptions;
        extendInjector: Injector;
    }) {
        if (!Reflect.getOwnMetadataKeys(containerClass).includes(containerKey)) {
            throw Error(`${containerClass.name} is not a container.`);
        }

        const injector = new Injector(extendInjector);
        const containerMetadata: TContainerMetadata = Reflect.getOwnMetadata(
            containerKey,
            containerClass
        );

        const {
            loaders,
            middlewares,
            guards,
            dependencies,
            config: containerConfig
        } = containerMetadata || {};

        //#region [Configuration(s)]
        const { config } = Object.freeze({
            config: {
                ...(typeof options.config !== "function" ? options.config : await options.config()),
                ...(typeof containerConfig !== "function"
                    ? typeof containerConfig !== "object"
                        ? undefined
                        : "key" in containerConfig &&
                          "value" in containerConfig &&
                          typeof containerConfig.key === "symbol"
                        ? typeof containerConfig.value !== "function"
                            ? containerConfig.value
                            : await containerConfig.value()
                        : containerConfig
                    : await containerConfig())
            }
        });
        //#endregion

        //#region [Register config like an injection]
        injector.set(
            containerConfig &&
                "key" in containerConfig &&
                "value" in containerConfig &&
                typeof containerConfig.key === "symbol"
                ? containerConfig.key
                : configKey,
            config
        );
        //#endregion

        //#region [Run loader(s)]
        if (loaders) {
            const loaderFunctions = [];

            for (const [key, func] of Object.entries(loaders)) {
                loaderFunctions.push(async () => {
                    try {
                        const result = await func({ config });

                        console.info(
                            `${ansiText(" INFO ", {
                                color: "white",
                                backgroundColor: "blue",
                                bold: true
                            })} Loader [${key}] initialized successfully.`
                        );

                        return result;
                    } catch (error) {
                        console.error(
                            `${ansiText(" WARN ", {
                                color: "yellow",
                                backgroundColor: "red",
                                bold: true
                            })} Loader [${key}] initialization failed.`
                        );
                        options.debug && console.error(error);
                        throw error;
                    }
                });
            }

            const results = await Promise.all(loaderFunctions.map((func) => func()));

            for (const [key, value] of results) {
                injector.set(key, value);
            }
        }
        //#endregion

        //#region [Dependencies]
        !dependencies || dependencies.map((dependency) => injector.get(dependency));
        //#endregion

        //#region [Middleware(s)]
        const startMiddlewareGroup: Array<
            TGroupElementModel<"start", IMiddleware, NonNullable<IMiddleware["start"]>>
        > = [];
        const endMiddlewareGroup: Array<
            TGroupElementModel<"end", IMiddleware, NonNullable<IMiddleware["end"]>>
        > = [];

        !middlewares ||
            middlewares.forEach((middleware) => {
                const instance = injector.get<IMiddleware>(middleware);

                if (instance.start && typeof instance.start === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "start") || {};

                    startMiddlewareGroup.push(
                        Object.freeze({
                            class: middleware as IMiddleware,
                            funcName: "start",
                            func: instance.start.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }

                if (instance.end && typeof instance.end === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "end") || {};

                    endMiddlewareGroup.push(
                        Object.freeze({
                            class: middleware as IMiddleware,
                            funcName: "end",
                            func: instance.end.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }
            });
        //#endregion

        //#region [Guard(s)]
        const guardGroup: Array<
            TGroupElementModel<"enforce", IGuard, NonNullable<IGuard["enforce"]>>
        > = !guards
            ? []
            : guards.map((guard) => {
                  const guardInstance = injector.get<IGuard>(guard);
                  const argumentsMetadata: TArgumentsMetadataCollection =
                      Reflect.getOwnMetadata(argumentsKey, guard, "enforce") || {};

                  return Object.freeze({
                      class: guard as unknown as IGuard,
                      funcName: "enforce",
                      func: guardInstance.enforce.bind(guardInstance),
                      argumentsMetadata: argumentsMetadata
                  });
              });
        //#endregion

        return Object.freeze({
            injector,
            startMiddlewareGroup,
            endMiddlewareGroup,
            guardGroup
        });
    }

    /**
     *
     * @param param0
     * @returns
     */
    private async moduleResolution({
        moduleClass,
        options,
        extendInjector
    }: {
        moduleClass: TConstructor<unknown>;
        options: TApplicationOptions;
        extendInjector: Injector;
    }) {
        if (!Reflect.getOwnMetadataKeys(moduleClass).includes(moduleKey)) {
            throw Error(`${moduleClass.name} is not a module.`);
        }

        const injector = new Injector(extendInjector);
        const moduleMetadata: TModuleMetadata = Reflect.getOwnMetadata(moduleKey, moduleClass);

        const {
            loaders,
            middlewares,
            guards,
            interceptors,
            controllers,
            dependencies,
            webSockets,
            prefix: modulePrefix,
            config: moduleConfig
        } = moduleMetadata || {};

        const fullPrefix = `${options.prefix || ""}/${modulePrefix || ""}`;

        //#region [Configuration(s)]
        const { config } = Object.freeze({
            config: !moduleConfig
                ? undefined
                : {
                      ...(typeof options.config !== "function"
                          ? options.config
                          : await options.config()),
                      ...(typeof moduleConfig !== "function"
                          ? typeof moduleConfig !== "object"
                              ? undefined
                              : "key" in moduleConfig &&
                                "value" in moduleConfig &&
                                typeof moduleConfig.key === "symbol"
                              ? typeof moduleConfig.value !== "function"
                                  ? moduleConfig.value
                                  : await moduleConfig.value()
                              : moduleConfig
                          : await moduleConfig())
                  }
        });
        //#endregion

        //#region [Register config like an injection]
        config &&
            injector.set(
                moduleConfig &&
                    "key" in moduleConfig &&
                    "value" in moduleConfig &&
                    typeof moduleConfig.key === "symbol"
                    ? moduleConfig.key
                    : configKey,
                config
            );
        //#endregion

        //#region [Run loader(s)]
        if (loaders) {
            const loaderFunctions = [];

            for (const [key, func] of Object.entries(loaders)) {
                loaderFunctions.push(async () => {
                    try {
                        const result = await func({ config });

                        console.info(
                            `${ansiText(" INFO ", {
                                color: "white",
                                backgroundColor: "blue",
                                bold: true
                            })} Loader [${key}] initialized successfully.`
                        );

                        return result;
                    } catch (error) {
                        console.error(
                            `${ansiText(" WARN ", {
                                color: "yellow",
                                backgroundColor: "red",
                                bold: true
                            })} Loader [${key}] initialization failed.`
                        );
                        options.debug && console.error(error);
                        throw error;
                    }
                });
            }

            const results = await Promise.all(loaderFunctions.map((func) => func()));

            for (let i = 0; i < results.length; i++) {
                const [key, value] = results[i];
                injector.set(key, value);
            }
        }
        //#endregion

        //#region [Dependencies]
        !dependencies || dependencies.map((dependency) => injector.get(dependency));
        //#endregion

        //#region [Middleware(s)]
        const startMiddlewareGroup: Array<
            TGroupElementModel<"start", IMiddleware, NonNullable<IMiddleware["start"]>>
        > = [];
        const endMiddlewareGroup: Array<
            TGroupElementModel<"end", IMiddleware, NonNullable<IMiddleware["end"]>>
        > = [];

        !middlewares ||
            middlewares.forEach((middleware) => {
                const instance = injector.get<IMiddleware>(middleware);

                if (instance.start && typeof instance.start === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "start") || {};

                    startMiddlewareGroup.push(
                        Object.freeze({
                            class: middleware as IMiddleware,
                            funcName: "start",
                            func: instance.start.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }

                if (instance.end && typeof instance.end === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "end") || {};

                    endMiddlewareGroup.push(
                        Object.freeze({
                            class: middleware as IMiddleware,
                            funcName: "end",
                            func: instance.end.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }
            });
        //#endregion

        //#region [Guard(s)]
        const guardGroup: Array<
            TGroupElementModel<"enforce", IGuard, NonNullable<IGuard["enforce"]>>
        > = !guards
            ? []
            : guards.map((guard) => {
                  const guardInstance = injector.get<IGuard>(guard);
                  const argumentsMetadata: TArgumentsMetadataCollection =
                      Reflect.getOwnMetadata(argumentsKey, guard, "enforce") || {};

                  return Object.freeze({
                      class: guard as unknown as IGuard,
                      funcName: "enforce",
                      func: guardInstance.enforce.bind(guardInstance),
                      argumentsMetadata: argumentsMetadata
                  });
              });
        //#endregion

        //#region [Before interceptor(s)]
        const openInterceptorGroup: Array<
            TGroupElementModel<"open", IInterceptor, NonNullable<IInterceptor["open"]>>
        > = [];
        const closeInterceptorGroup: Array<
            TGroupElementModel<"close", IInterceptor, NonNullable<IInterceptor["close"]>>
        > = [];

        !interceptors ||
            interceptors.forEach((interceptor) => {
                const instance = injector.get<IInterceptor>(interceptor);

                if (instance.open && typeof instance.open === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, interceptor, "open") || {};

                    openInterceptorGroup.push(
                        Object.freeze({
                            class: interceptor as IInterceptor,
                            funcName: "open",
                            func: instance.open.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }

                if (instance.close && typeof instance.close === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, interceptor, "close") || {};

                    closeInterceptorGroup.push(
                        Object.freeze({
                            class: interceptor as IInterceptor,
                            funcName: "close",
                            func: instance.close.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }
            });
        //#endregion

        //#region [Controller(s)]
        const controllerRouterGroup = new HttpRouterGroup();

        !controllers ||
            controllers.forEach((controllerConstructor) =>
                this.initControllerInstance({
                    controllerConstructor,
                    httpRouterGroup: controllerRouterGroup,
                    injector: injector,
                    prefix: fullPrefix
                })
            );
        //#endregion

        //#region [WebSocket(s)]
        const webSocketHttpRouterGroup = new HttpRouterGroup();
        const webSocketRouterGroup = new WebSocketRouterGroup();

        webSockets &&
            webSockets.forEach((webSocket) =>
                this.initWebSocketInstance({
                    webSocketConstructor: webSocket,
                    httpRouterGroup: webSocketHttpRouterGroup,
                    webSocketRouterGroup: webSocketRouterGroup,
                    injector: injector,
                    prefix: fullPrefix
                })
            );
        //#endregion

        return Object.freeze({
            prefix: modulePrefix || "",
            injector: injector,
            startMiddlewareGroup: startMiddlewareGroup,
            endMiddlewareGroup: endMiddlewareGroup,
            guardGroup: guardGroup,
            openInterceptorGroup: openInterceptorGroup,
            closeInterceptorGroup: closeInterceptorGroup,
            controllerRouterGroup: controllerRouterGroup,
            webSocketHttpRouterGroup: webSocketHttpRouterGroup,
            webSocketRouterGroup: webSocketRouterGroup
        });
    }

    /**
     *
     * @param data
     * @param zodSchema
     * @param argumentIndex
     * @param funcName
     * @returns
     */
    private async argumentsResolution<TValidationSchema = unknown>(
        data: unknown,
        validationSchema: TValidationSchema,
        argumentIndex: number,
        funcName: string | symbol
    ) {
        if (!this.#customValidator) {
            return data;
        }

        try {
            const validation = await this.#customValidator.validate(
                data,
                validationSchema,
                argumentIndex,
                funcName
            );

            if (!(validation instanceof ValidationFailed)) {
                return validation;
            }

            throw new HttpClientError({
                httpCode: 400,
                message: `Validation at the [${funcName.toString()}] method fails at positional argument [${argumentIndex}].`,
                data: validation.error
            });
        } catch (error) {
            if (error instanceof HttpClientError) {
                throw error;
            }

            throw new HttpServerError({
                httpCode: 500,
                message: `Validation at the [${funcName.toString()}] method error at positional argument [${argumentIndex}].`,
                data: !(error instanceof Error)
                    ? error
                    : [
                          {
                              message: error.message,
                              code: error.name,
                              cause: error.cause
                          }
                      ]
            });
        }
    }

    /**
     *
     * @param param0
     * @returns
     */
    private initControllerInstance({
        controllerConstructor,
        httpRouterGroup,
        injector,
        prefix
    }: Readonly<{
        controllerConstructor: TConstructor<unknown>;
        httpRouterGroup: HttpRouterGroup;
        injector: Injector;
        prefix?: string;
    }>) {
        if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(controllerKey)) {
            throw Error(`${controllerConstructor.name} is not a controller.`);
        }

        const controller = injector.get(controllerConstructor);

        if (!controller) {
            throw Error("Can not initialize controller.");
        }

        const controllerMetadata: TControllerMetadata = Reflect.getOwnMetadata(
            controllerKey,
            controllerConstructor
        ) || {
            prefix: "/",
            httpMetadata: []
        };

        const router = new HttpRouter({
            alias: `/${prefix || ""}/${controllerMetadata.prefix}`
        });

        controllerMetadata.httpMetadata.forEach((routeMetadata) => {
            if (typeof routeMetadata.descriptor.value !== "function") {
                return;
            }

            const route = router.route(routeMetadata.path);
            const handler = routeMetadata.descriptor.value.bind(controller);
            const httpRouteModel = Object.freeze({
                class: controllerConstructor,
                funcName: routeMetadata.methodName,
                func: handler,
                argumentsMetadata: routeMetadata.argumentsMetadata
            });

            switch (routeMetadata.httpMethod) {
                case "GET":
                    return route.get({ model: httpRouteModel });
                case "POST":
                    return route.post({ model: httpRouteModel });
                case "PUT":
                    return route.put({ model: httpRouteModel });
                case "PATCH":
                    return route.patch({ model: httpRouteModel });
                case "DELETE":
                    return route.delete({ model: httpRouteModel });
                case "OPTIONS":
                    return route.options({ model: httpRouteModel });
            }
        });

        return httpRouterGroup.add(router);
    }

    /**
     *
     * @param param0
     * @returns
     */
    private initWebSocketInstance({
        injector,
        httpRouterGroup,
        prefix,
        webSocketRouterGroup,
        webSocketConstructor
    }: Readonly<{
        webSocketConstructor: TConstructor<unknown>;
        httpRouterGroup: HttpRouterGroup;
        webSocketRouterGroup: WebSocketRouterGroup;
        injector: Injector;
        prefix?: string;
    }>): Readonly<{
        httpRouterGroup: HttpRouterGroup;
        webSocketRouterGroup: WebSocketRouterGroup;
    }> {
        if (!Reflect.getOwnMetadataKeys(webSocketConstructor).includes(webSocketKey)) {
            throw Error(`${webSocketConstructor.name} is not a websocket route.`);
        }

        const webSocket = injector.get(webSocketConstructor);

        if (!webSocket) {
            throw Error("Can not initialize webSocket.");
        }

        const webSocketMetadata: TWebSocketMetadata = Reflect.getOwnMetadata(
            webSocketKey,
            webSocketConstructor
        ) || {
            prefix: "/",
            events: [],
            http: []
        };

        const fullPrefix = `/${prefix || ""}/${webSocketMetadata.prefix}`;

        //#region [HTTP ROUTER]
        const router = new HttpRouter({
            alias: fullPrefix
        });

        for (const [_key, httpMetadata] of Object.entries(webSocketMetadata.http)) {
            if (typeof httpMetadata.descriptor?.value !== "function") {
                continue;
            }

            const route = router.route(httpMetadata.path);
            const handler = httpMetadata.descriptor.value.bind(webSocket);
            const httpRouteModel = Object.freeze({
                class: webSocketConstructor,
                funcName: httpMetadata.methodName,
                func: handler,
                argumentsMetadata: httpMetadata.argumentsMetadata
            });

            switch (httpMetadata.httpMethod) {
                case "GET":
                    route.get({ model: httpRouteModel });
                    break;
                case "POST":
                    route.post({ model: httpRouteModel });
                    break;
            }
        }

        httpRouterGroup.add(router);
        //#endregion

        //#region [WEBSOCKET ROUTER]
        const webSocketRouter = new WebSocketRouter(fullPrefix);

        for (const [key, event] of Object.entries(webSocketMetadata.events)) {
            const webSocketRoute = new WebSocketRoute({
                eventName: key,
                metadata: event
            });

            webSocketRouter.addRoutes(webSocketRoute);
        }

        webSocketRouter.bind(webSocket);
        webSocketRouterGroup.addRouters(webSocketRouter);
        //#endregion

        return Object.freeze({
            httpRouterGroup: httpRouterGroup,
            webSocketRouterGroup: webSocketRouterGroup
        });
    }

    /**
     *
     * @param param0
     * @returns
     */
    private serializeResponse({
        status,
        statusText,
        headers,
        data
    }: {
        status?: number;
        statusText?: string;
        headers: Headers;
        data: unknown;
    }): Response {
        const contentType = headers.get("Content-Type") || "text/plain";

        if (contentType.includes("application/json")) {
            return this.finalizeResponse(
                new Response(
                    !data
                        ? undefined
                        : data instanceof ReadableStream
                        ? data
                        : JSON.stringify(data),
                    {
                        status: !data ? 204 : status,
                        statusText: statusText,
                        headers: headers
                    }
                )
            );
        }

        if (contentType.includes("text/plain") || contentType.includes("text/html")) {
            return this.finalizeResponse(
                new Response(
                    !data ? undefined : data instanceof ReadableStream ? data : String(data),
                    {
                        status: !data ? 204 : status,
                        statusText: statusText,
                        headers: headers
                    }
                )
            );
        }

        if (contentType.includes("application/octet-stream")) {
            if (
                data instanceof Uint8Array ||
                data instanceof ArrayBuffer ||
                data instanceof Blob ||
                data instanceof ReadableStream
            ) {
                return this.finalizeResponse(
                    new Response(data as BodyInit, {
                        status: status,
                        statusText: statusText,
                        headers: headers
                    })
                );
            }

            throw new Error("Invalid data type for application/octet-stream");
        }

        if (contentType.includes("multipart/form-data")) {
            if (data instanceof FormData) {
                return this.finalizeResponse(
                    new Response(data, { status: status, statusText: statusText, headers: headers })
                );
            }

            throw new Error("multipart/form-data requires FormData object");
        }

        return this.finalizeResponse(
            new Response(!data ? undefined : String(data), {
                status: !data ? 204 : status,
                statusText: statusText,
                headers: headers
            })
        );
    }

    /**
     *
     * @param response
     * @returns
     */
    private finalizeResponse(response: Response) {
        response.headers.set("X-Powered-By", "Bool Typescript");

        return response;
    }

    /**
     *
     * @param param0
     * @returns
     */
    private async httpFetcher({
        context: outerContext,
        route,
        options,
        resolutedMap
    }: Partial<{
        route: NonNullable<ReturnType<HttpRouterGroup["find"]>>;
        resolutedMap:
            | Partial<
                  NonNullable<Awaited<ReturnType<Application<TRootClass>["containerResolution"]>>>
              >
            | Partial<
                  NonNullable<Awaited<ReturnType<Application<TRootClass>["moduleResolution"]>>>
              >;
        context: Context;
        options: Partial<{
            isContainer: boolean;
        }>;
    }>) {
        const contextOptions = { isStatic: true };
        const context = new Context(...(!outerContext ? [] : [outerContext])).setOptions(
            contextOptions
        );

        if (route) {
            context
                .set(paramsArgsKey, route.parameters, { isPassthrough: true })
                .set(routeModelArgsKey, route.model, { isPassthrough: true });
        }

        const httpServer =
                context.get<Server<TWebSocketUpgradeData> | null | undefined>(
                    httpServerArgsKey,
                    contextOptions
                ) || undefined,
            request =
                context.get<Request | null | undefined>(requestArgsKey, contextOptions) ||
                undefined,
            requestHeaders =
                context.get<Headers | null | undefined>(requestHeaderArgsKey, contextOptions) ||
                undefined,
            responseHeaders =
                context.get<Headers | null | undefined>(responseHeadersArgsKey, contextOptions) ||
                undefined,
            parameters =
                context.get<TParamsType | null | undefined>(paramsArgsKey, contextOptions) ||
                undefined,
            routeModel =
                context.get<
                    NonNullable<ReturnType<HttpRouterGroup["find"]>>["model"] | null | undefined
                >(routeModelArgsKey, contextOptions) || undefined;

        if (resolutedMap) {
            const { startMiddlewareGroup, guardGroup } = resolutedMap;

            // Execute start middleware(s)
            if (startMiddlewareGroup) {
                for (let i = 0; i < startMiddlewareGroup.length; i++) {
                    const args = [];
                    const {
                        func: handler,
                        funcName: functionName,
                        argumentsMetadata
                    } = startMiddlewareGroup[i];

                    for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argMetadata.type) {
                            case contextArgsKey:
                                args[argMetadata.index] = !argMetadata.key
                                    ? context
                                    : context.get(argMetadata.key, contextOptions);
                                break;
                            case requestArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? request
                                    : await this.argumentsResolution(
                                          request,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestBodyArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? await request?.[argMetadata.parser || "json"]()
                                    : await this.argumentsResolution(
                                          await request?.[argMetadata.parser || "json"](),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestHeadersArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders
                                    : await this.argumentsResolution(
                                          requestHeaders?.toJSON(),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestHeaderArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders?.get(argMetadata.key) || undefined
                                    : await this.argumentsResolution(
                                          requestHeaders?.get(argMetadata.key) || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case paramArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? parameters?.[argMetadata.key] || undefined
                                    : await this.argumentsResolution(
                                          parameters?.[argMetadata.key] || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case routeModelArgsKey:
                                args[argMetadata.index] = routeModel;
                                break;
                            case responseHeadersArgsKey:
                                args[argMetadata.index] = responseHeaders;
                                break;
                            case httpServerArgsKey:
                                args[argMetadata.index] = httpServer;
                                break;
                            default:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? !context.has(argMetadata.type, contextOptions)
                                        ? undefined
                                        : context.get(argMetadata.type, contextOptions)
                                    : await this.argumentsResolution(
                                          !(argMetadata.type in context)
                                              ? undefined
                                              : context.get(argMetadata.type, contextOptions),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                        }
                    }

                    await handler(...args);
                }
            }

            // Execute guard(s)
            if (guardGroup) {
                for (let i = 0; i < guardGroup.length; i++) {
                    const args = [];
                    const {
                        func: handler,
                        funcName: functionName,
                        argumentsMetadata
                    } = guardGroup[i];

                    for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argMetadata.type) {
                            case requestArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? request
                                    : await this.argumentsResolution(
                                          request,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestBodyArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? await request?.[argMetadata.parser || "json"]()
                                    : await this.argumentsResolution(
                                          await request?.[argMetadata.parser || "json"](),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case contextArgsKey:
                                args[argMetadata.index] = !argMetadata.key
                                    ? context
                                    : context.get(argMetadata.key);
                                break;
                            case requestHeadersArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders
                                    : await this.argumentsResolution(
                                          requestHeaders?.toJSON(),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case responseHeadersArgsKey:
                                args[argMetadata.index] = responseHeaders;
                                break;
                            case requestHeaderArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders?.get(argMetadata.key) || undefined
                                    : await this.argumentsResolution(
                                          requestHeaders?.get(argMetadata.key) || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case paramArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? parameters?.[argMetadata.key] || undefined
                                    : await this.argumentsResolution(
                                          parameters?.[argMetadata.key],
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case routeModelArgsKey:
                                args[argMetadata.index] = routeModel;
                                break;
                            case httpServerArgsKey:
                                args[argMetadata.index] = httpServer;
                                break;
                            default:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? !context.has(argMetadata.type)
                                        ? undefined
                                        : context.get(argMetadata.type)
                                    : await this.argumentsResolution(
                                          context.get(argMetadata.type),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                        }
                    }

                    const guardResult = await handler(...args);

                    if (typeof guardResult !== "boolean" || !guardResult) {
                        throw new HttpClientError({
                            httpCode: 401,
                            message: "Unauthorization.",
                            data: undefined
                        });
                    }
                }
            }
        }

        if (routeModel && !options?.isContainer) {
            if (
                resolutedMap &&
                "openInterceptorGroup" in resolutedMap &&
                resolutedMap.openInterceptorGroup
            ) {
                const { openInterceptorGroup } = resolutedMap;

                // Execute open interceptor(s)
                for (let i = 0; i < openInterceptorGroup.length; i++) {
                    const args = [];
                    const {
                        func: handler,
                        funcName: functionName,
                        argumentsMetadata
                    } = openInterceptorGroup[i];

                    for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argMetadata.type) {
                            case requestArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? request
                                    : await this.argumentsResolution(
                                          request,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestBodyArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? await request?.[argMetadata.parser || "json"]()
                                    : await this.argumentsResolution(
                                          await request?.[argMetadata.parser || "json"](),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case contextArgsKey:
                                args[argMetadata.index] = !argMetadata.key
                                    ? context
                                    : context.get(argMetadata.key);
                                break;
                            case requestHeadersArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders
                                    : await this.argumentsResolution(
                                          requestHeaders?.toJSON(),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestHeaderArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders?.get(argMetadata.key) || undefined
                                    : await this.argumentsResolution(
                                          requestHeaders?.get(argMetadata.key) || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case responseHeadersArgsKey:
                                args[argMetadata.index] = responseHeaders;
                                break;
                            case paramArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? parameters?.[argMetadata.key] || undefined
                                    : await this.argumentsResolution(
                                          parameters?.[argMetadata.key] || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case routeModelArgsKey:
                                args[argMetadata.index] = routeModel;
                                break;
                            case httpServerArgsKey:
                                args[argMetadata.index] = httpServer;
                                break;
                            default:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? !context.has(argMetadata.type)
                                        ? undefined
                                        : context.get(argMetadata.type)
                                    : await this.argumentsResolution(
                                          context.get(argMetadata.type),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                        }
                    }

                    await handler(...args);
                }
            }

            // Execute controller action
            const controllerActionArguments: any[] = [];
            const {
                func: controllerAction,
                funcName: controllerActionName,
                argumentsMetadata: controllerActionArgumentsMetadata
            } = routeModel;

            for (const [_key, argMetadata] of Object.entries(controllerActionArgumentsMetadata)) {
                switch (argMetadata.type) {
                    case requestArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? request
                            : await this.argumentsResolution(
                                  request,
                                  argMetadata.validationSchema,
                                  argMetadata.index,
                                  controllerActionName
                              );
                        break;
                    case requestBodyArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? await request?.[argMetadata.parser || "json"]()
                            : await this.argumentsResolution(
                                  await request?.[argMetadata.parser || "json"](),
                                  argMetadata.validationSchema,
                                  argMetadata.index,
                                  controllerActionName
                              );
                        break;
                    case contextArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.key
                            ? context
                            : context.get(argMetadata.key);
                        break;
                    case requestHeadersArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? requestHeaders
                            : await this.argumentsResolution(
                                  requestHeaders?.toJSON(),
                                  argMetadata.validationSchema,
                                  argMetadata.index,
                                  controllerActionName
                              );
                        break;
                    case requestHeaderArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? requestHeaders?.get(argMetadata.key) || undefined
                            : await this.argumentsResolution(
                                  requestHeaders?.get(argMetadata.key) || undefined,
                                  argMetadata.validationSchema,
                                  argMetadata.index,
                                  controllerActionName
                              );
                        break;
                    case responseHeadersArgsKey:
                        controllerActionArguments[argMetadata.index] = responseHeaders;
                        break;
                    case paramArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? parameters?.[argMetadata.key] || undefined
                            : await this.argumentsResolution(
                                  parameters?.[argMetadata.key] || undefined,
                                  argMetadata.validationSchema,
                                  argMetadata.index,
                                  controllerActionName
                              );
                        break;
                    case routeModelArgsKey:
                        controllerActionArguments[argMetadata.index] = routeModel;
                        break;
                    case httpServerArgsKey:
                        controllerActionArguments[argMetadata.index] = httpServer;
                        break;
                    default:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? !context.has(argMetadata.type)
                                ? undefined
                                : context.get(argMetadata.type)
                            : await this.argumentsResolution(
                                  context.get(argMetadata.type),
                                  argMetadata.validationSchema,
                                  argMetadata.index,
                                  controllerActionName
                              );
                        break;
                }
            }

            context.set(responseBodyArgsKey, await controllerAction(...controllerActionArguments), {
                isStatic: false
            });

            if (
                resolutedMap &&
                "closeInterceptorGroup" in resolutedMap &&
                resolutedMap.closeInterceptorGroup
            ) {
                const { closeInterceptorGroup } = resolutedMap;

                // Execute close interceptor(s)
                for (let i = 0; i < closeInterceptorGroup.length; i++) {
                    const args = [];
                    const {
                        func: handler,
                        funcName: functionName,
                        argumentsMetadata
                    } = closeInterceptorGroup[i];

                    for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argMetadata.type) {
                            case requestArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? request
                                    : await this.argumentsResolution(
                                          request,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestBodyArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? await request?.[argMetadata.parser || "json"]()
                                    : await this.argumentsResolution(
                                          await request?.[argMetadata.parser || "json"](),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case contextArgsKey:
                                args[argMetadata.index] = !argMetadata.key
                                    ? context
                                    : context.get(argMetadata.key);
                                break;
                            case requestHeadersArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders
                                    : await this.argumentsResolution(
                                          requestHeaders?.toJSON(),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case responseHeadersArgsKey:
                                args[argMetadata.index] = context.get(argMetadata.type);
                                break;
                            case requestHeaderArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders?.get(argMetadata.key) || undefined
                                    : await this.argumentsResolution(
                                          requestHeaders?.get(argMetadata.key) || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case paramArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? parameters?.[argMetadata.key] || undefined
                                    : await this.argumentsResolution(
                                          parameters?.[argMetadata.key] || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case routeModelArgsKey:
                                args[argMetadata.index] = routeModel;
                                break;
                            case httpServerArgsKey:
                                args[argMetadata.index] = httpServer;
                                break;
                            default:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? !context.has(argMetadata.type)
                                        ? undefined
                                        : context.get(argMetadata.type)
                                    : await this.argumentsResolution(
                                          context.get(argMetadata.type),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                        }
                    }

                    await handler(...args);
                }
            }
        }

        if (resolutedMap) {
            const { endMiddlewareGroup } = resolutedMap;

            // Execute end middleware(s)
            if (endMiddlewareGroup) {
                for (let i = 0; i < endMiddlewareGroup.length; i++) {
                    const args = [];
                    const {
                        func: handler,
                        funcName: functionName,
                        argumentsMetadata
                    } = endMiddlewareGroup[i];

                    for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                        switch (argMetadata.type) {
                            case requestArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? request
                                    : await this.argumentsResolution(
                                          request,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case requestBodyArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? await request?.[argMetadata.parser || "json"]()
                                    : await this.argumentsResolution(
                                          await request?.[argMetadata.parser || "json"](),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case contextArgsKey:
                                args[argMetadata.index] = !argMetadata.key
                                    ? context
                                    : context.get(argMetadata.key);
                                break;
                            case requestHeadersArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders
                                    : await this.argumentsResolution(
                                          requestHeaders?.toJSON(),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case responseHeadersArgsKey:
                                args[argMetadata.index] = context.get(argMetadata.type);
                                break;
                            case requestHeaderArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? requestHeaders?.get(argMetadata.key) || undefined
                                    : await this.argumentsResolution(
                                          requestHeaders?.get(argMetadata.key) || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case paramArgsKey:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? parameters?.[argMetadata.key] || undefined
                                    : await this.argumentsResolution(
                                          parameters?.[argMetadata.key] || undefined,
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                            case routeModelArgsKey:
                                args[argMetadata.index] = routeModel;
                                break;
                            case httpServerArgsKey:
                                args[argMetadata.index] = httpServer;
                                break;
                            default:
                                args[argMetadata.index] = !argMetadata.validationSchema
                                    ? !context.has(argMetadata.type)
                                        ? undefined
                                        : context.get(argMetadata.type)
                                    : await this.argumentsResolution(
                                          !(argMetadata.type in context)
                                              ? undefined
                                              : context.get(argMetadata.type),
                                          argMetadata.validationSchema,
                                          argMetadata.index,
                                          functionName
                                      );
                                break;
                        }
                    }

                    await handler(...args);
                }
            }
        }

        return Object.freeze({
            context: context
        });
    }

    /**
     *
     * @param bun
     * @param bool
     * @returns
     */
    private async webSocketFetcher(
        bun: Required<{
            request: Request;
            server: Server<TWebSocketUpgradeData>;
        }>,
        bool: Required<{
            responseHeaders: Headers;
            query: Record<string, unknown>;
            route: NonNullable<ReturnType<HttpRouterGroup["find"]>>;
            moduleResolution: NonNullable<
                Awaited<ReturnType<Application<TRootClass>["moduleResolution"]>>
            >;
        }>
    ) {
        const { request, server } = bun;
        const {
            query,
            responseHeaders,
            route: { model }
        } = bool;

        // Execute controller action
        const isUpgrade = await model.func(...[server, request, query]);

        if (typeof isUpgrade !== "boolean") {
            return this.finalizeResponse(
                new Response(
                    JSON.stringify({
                        httpCode: 500,
                        message: "Can not detect webSocket upgrade result.",
                        data: undefined
                    }),
                    {
                        status: 500,
                        statusText: "Internal server error.",
                        headers: responseHeaders
                    }
                )
            );
        }

        if (!isUpgrade) {
            return this.finalizeResponse(
                new Response(
                    JSON.stringify({
                        httpCode: 500,
                        message: "Can not upgrade.",
                        data: undefined
                    }),
                    {
                        status: 500,
                        statusText: "Internal server error.",
                        headers: responseHeaders
                    }
                )
            );
        }

        return isUpgrade;
    }
}
