import type { Server, ServerWebSocket, WebSocketHandler } from "bun";
import type {
    TArgumentsMetadataCollection,
    TContainerMetadata,
    TControllerMetadata,
    TModuleMetadata,
    TWebSocketEventHandlerMetadata,
    TWebSocketMetadata,
    TWebSocketUpgradeData
} from "../decorators";
import type { THttpMethods } from "../http";
import type {
    IController,
    ICustomValidator,
    IGuard,
    IInterceptor,
    IMiddleware,
    TApplicationOptions,
    TCloseInterceptorHandlers,
    TCloseInterceptorsPipe,
    TControllerPipe,
    TEndMiddlewareHandlers,
    TEndMiddlewaresPipe,
    TGuardHandlers,
    TGuardReturn,
    TGuardsPipe,
    TOpenInterceptorHandlers,
    TOpenInterceptorsPipe,
    TParamsType,
    TPipesEnforcerUnion,
    TPreLaunch,
    TResolutedOptions,
    TStartMiddlewareHandlers,
    TStartMiddlewaresPipe,
    TStaticMap,
    TValidator
} from "../interfaces";
import type { TConstructor } from "../utils";

import { ETimeUnit, add as TimeAdd } from "@bool-ts/date-time";
import { serve } from "bun";
import { parse as QsParse } from "qs";
import { Objects } from "../constants";
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
} from "../constants/keys";
import {
    HttpClientError,
    httpMethods,
    httpMethodsStandardization,
    HttpServerError,
    jsonErrorInfer
} from "../http";
import { ansiText, inferStatusText, isWebSocketUpgrade } from "../utils";
import { Context } from "./context";
import { HttpRouter } from "./httpRouter";
import { HttpRouterGroup } from "./httpRouterGroup";
import { Injector } from "./injector";
import { ValidationFailed } from "./validationFailed";
import { WebSocketRoute } from "./webSocketRoute";
import { WebSocketRouter } from "./webSocketRouter";
import { WebSocketRouterGroup } from "./webSocketRouterGroup";

export class Application<TRootClass extends Object = Object> {
    #preLaunchData: TPreLaunch;
    #type: "CONTAINER" | "MODULE";
    #staticMap: TStaticMap = new Map();
    #resolutedOptions: TResolutedOptions;
    #staticCacheTimeInSecond: number = 900;
    #customValidator: TValidator;
    #globalContext: Context = new Context();

    constructor(
        private readonly classConstructor: TConstructor<TRootClass>,
        private readonly options: TApplicationOptions
    ) {
        const metadataKeys = Reflect.getOwnMetadataKeys(classConstructor);

        if (!metadataKeys.includes(containerKey) && !metadataKeys.includes(moduleKey)) {
            throw Error(
                `Can not detect! ${classConstructor.name} class is not a container or module.`
            );
        }

        this.#type = !metadataKeys.includes(containerKey) ? "MODULE" : "CONTAINER";

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
                    : this.options.cors.headers,
            pipelineStrategy: (() => {
                switch (options.pipelineStrategy?.type) {
                    case "SIMPLE":
                        return Object.freeze({
                            startMiddlewares: "FIFO",
                            endMiddlewares: options.pipelineStrategy.targets?.middlewares || "FIFO",
                            openInterceptors: "FIFO",
                            closeInterceptors:
                                options.pipelineStrategy.targets?.interceptors || "FIFO"
                        });

                    default:
                        return Object.freeze({
                            startMiddlewares: "FIFO",
                            endMiddlewares: "FIFO",
                            openInterceptors: "FIFO",
                            closeInterceptors: "FIFO"
                        });
                }
            })()
        });
    }

    /**
     * Static method to initialize app and await all reloads.
     * @param classConstructor
     * @param options
     * @returns
     */
    public static async create<TRootClass extends Object = Object>(
        classConstructor: TConstructor<TRootClass>,
        options: TApplicationOptions
    ) {
        const app = new Application(classConstructor, options);

        await app.preLaunch();

        return app;
    }

    /**
     * Register app validator to execute all validations process in app.
     * @param validator
     */
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

        const {
            startMiddlewareHandlers,
            endMiddlewareHandlers,
            controllerRouterGroup,
            webSocketHttpRouterGroup,
            webSocketRouterGroup
        } =
            this.#type !== "MODULE"
                ? await this.#containerResolver({
                      containerClass: this.classConstructor,
                      prefix: this.options.prefix,
                      options: this.options
                  })
                : await this.#moduleResolver({
                      moduleClass: this.classConstructor,
                      prefix: this.options.prefix,
                      options: this.options
                  });

        const webSocketsMap = new Map<string, TWebSocketEventHandlerMetadata>();
        const webSocketMap = webSocketRouterGroup.execute();

        for (const [key, metadata] of webSocketMap.entries()) {
            webSocketsMap.set(key, metadata);
        }

        this.#preLaunchData = Object.freeze({
            startMiddlewareHandlers,
            endMiddlewareHandlers,
            controllerRouterGroup,
            webSocketHttpRouterGroup,
            webSocketRouterGroup,
            webSocketsMap: webSocketsMap
        });

        return this.#preLaunchData;
    }

    /**
     * Start listen app on a port
     * @param port
     */
    public async listen() {
        const server = serve<TWebSocketUpgradeData>({
            port: this.options.port,
            fetch: this.#rootFetch.bind(this),
            websocket: await this.#rootWebSocket.bind(this)()
        });

        this.#globalContext.set(webSocketServerArgsKey, server);
    }

    /**
     *
     * @param request
     * @param server
     * @returns
     */
    async #rootFetch(request: Request, server: Server<TWebSocketUpgradeData>) {
        const {
            allowLogsMethods,
            allowOrigins,
            allowMethods,
            allowHeaders,
            allowCredentials,
            staticOption
        } = this.#resolutedOptions;

        const {
            startMiddlewareHandlers,
            endMiddlewareHandlers,
            controllerRouterGroup,
            webSocketHttpRouterGroup
        } = await this.preLaunch();

        const start = performance.now(),
            url = new URL(request.url),
            query = QsParse(url.searchParams.toString(), this.options.queryParser),
            origin = request.headers.get("origin") || "*",
            method = request.method.toUpperCase(),
            responseHeaders = new Headers();

        try {
            const context = new Context()
                .setOptions({ isStatic: true })
                .set(httpServerArgsKey, server)
                .set(requestArgsKey, request)
                .set(requestHeaderArgsKey, request.headers)
                .set(responseHeadersArgsKey, responseHeaders)
                .set(queryArgsKey, query);

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

            const validateRequestMethod = httpMethodsStandardization(method);

            if (!validateRequestMethod || !allowMethods.includes(method)) {
                return this.finalizeResponse(
                    new Response(undefined, {
                        ...Objects.clientErrorStatuses.METHOD_NOT_ALLOWED,
                        headers: responseHeaders
                    })
                );
            }

            const isUpgradable = isWebSocketUpgrade(request);

            if (isUpgradable) {
                return await this.#webSocketFetcher({
                    request: request,
                    server: server,
                    context: context,
                    url: url,
                    query: query,
                    method: method,
                    responseHeaders: responseHeaders,
                    httpRouterGroup: webSocketHttpRouterGroup,
                    startMiddlewareHandlers: startMiddlewareHandlers,
                    endMiddlewareHandlers: endMiddlewareHandlers
                });
            }

            if (request.method.toUpperCase() === "OPTIONS") {
                return this.finalizeResponse(
                    allowOrigins.includes("*") || allowOrigins.includes(origin)
                        ? new Response(undefined, {
                              ...Objects.successfulStatuses.NO_CONTENT,
                              headers: responseHeaders
                          })
                        : new Response(undefined, {
                              ...Objects.clientErrorStatuses.EXPECTATION_FAILED,
                              headers: responseHeaders
                          })
                );
            }

            if (staticOption) {
                const staticResult = await this.#staticFetcher({
                    url: url,
                    responseHeaders: responseHeaders,
                    path: staticOption.path,
                    headers: staticOption.headers,
                    cacheTimeInSeconds: staticOption.cacheTimeInSeconds
                });

                if (staticResult instanceof Response) {
                    return staticResult;
                }
            }

            return await this.#httpFetcher({
                url: url,
                method: method,
                context: context,
                httpRouterGroup: controllerRouterGroup,
                startMiddlewareHandlers: startMiddlewareHandlers,
                endMiddlewareHandlers: endMiddlewareHandlers
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
    }

    /**
     *
     * @returns
     */
    async #rootWebSocket<T extends TWebSocketUpgradeData = TWebSocketUpgradeData>(): Promise<
        WebSocketHandler<T>
    > {
        const { webSocketsMap } = await this.preLaunch();

        return {
            open: (connection: ServerWebSocket<T>) => {
                const pathnameKey = `${connection.data.pathname}:::open`;
                const handlerMetadata = webSocketsMap.get(pathnameKey);

                if (!handlerMetadata) {
                    return;
                }

                const argumentsMetadata = handlerMetadata.arguments || {};
                const args: Array<unknown> = [];

                for (const [, argumentMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argumentMetadata.type) {
                        case webSocketConnectionArgsKey:
                            args[argumentMetadata.index] = connection;
                            break;
                        case webSocketServerArgsKey:
                            args[argumentMetadata.index] =
                                this.#globalContext.get(webSocketServerArgsKey);
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

                for (const [, argumentMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argumentMetadata.type) {
                        case webSocketConnectionArgsKey:
                            args[argumentMetadata.index] = connection;
                            break;
                        case webSocketCloseCodeArgsKey:
                            args[argumentMetadata.index] = code;
                            break;
                        case webSocketCloseReasonArgsKey:
                            args[argumentMetadata.index] = reason;
                            break;
                        case webSocketServerArgsKey:
                            args[argumentMetadata.index] =
                                this.#globalContext.get(webSocketServerArgsKey);
                            break;
                    }
                }

                handlerMetadata.descriptor.value(...args);
            },
            message: (connection: ServerWebSocket<T>, message) => {
                const pathnameKey = `${connection.data.pathname}:::message`;
                const handlerMetadata = webSocketsMap.get(pathnameKey);

                if (!handlerMetadata) {
                    return;
                }

                const argumentsMetadata = handlerMetadata.arguments || {};
                const args: Array<unknown> = [];

                for (const [, argumentMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argumentMetadata.type) {
                        case webSocketConnectionArgsKey:
                            args[argumentMetadata.index] = connection;
                            break;
                        case webSocketMessageArgsKey:
                            args[argumentMetadata.index] = message;
                            break;
                        case webSocketServerArgsKey:
                            args[argumentMetadata.index] =
                                this.#globalContext.get(webSocketServerArgsKey);
                            break;
                    }
                }

                handlerMetadata.descriptor.value(...args);
            },
            drain: (connection: ServerWebSocket<T>) => {
                const pathnameKey = `${connection.data.pathname}:::drain`;
                const handlerMetadata = webSocketsMap.get(pathnameKey);

                if (!handlerMetadata) {
                    return;
                }

                const argumentsMetadata = handlerMetadata.arguments || {};
                const args: Array<unknown> = [];

                for (const [, argumentMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argumentMetadata.type) {
                        case webSocketConnectionArgsKey:
                            args[argumentMetadata.index] = connection;
                            break;
                        case webSocketServerArgsKey:
                            args[argumentMetadata.index] =
                                this.#globalContext.get(webSocketServerArgsKey);
                            break;
                    }
                }

                handlerMetadata.descriptor.value(...args);
            },
            ping: (connection: ServerWebSocket<T>, data) => {
                const pathnameKey = `${connection.data.pathname}:::ping`;
                const handlerMetadata = webSocketsMap.get(pathnameKey);

                if (!handlerMetadata) {
                    return;
                }

                const argumentsMetadata = handlerMetadata.arguments || {};
                const args: Array<unknown> = [];

                for (const [, argumentMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argumentMetadata.type) {
                        case webSocketConnectionArgsKey:
                            args[argumentMetadata.index] = connection;
                            break;
                        case webSocketMessageArgsKey:
                            args[argumentMetadata.index] = data;
                            break;
                        case webSocketServerArgsKey:
                            args[argumentMetadata.index] =
                                this.#globalContext.get(webSocketServerArgsKey);
                            break;
                    }
                }

                handlerMetadata.descriptor.value(...args);
            },
            pong: (connection: ServerWebSocket<T>, data) => {
                const pathnameKey = `${connection.data.pathname}:::pong`;
                const handlerMetadata = webSocketsMap.get(pathnameKey);

                if (!handlerMetadata) {
                    return;
                }

                const argumentsMetadata = handlerMetadata.arguments || {};
                const args: Array<unknown> = [];

                for (const [, argumentMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argumentMetadata.type) {
                        case webSocketConnectionArgsKey:
                            args[argumentMetadata.index] = connection;
                            break;
                        case webSocketMessageArgsKey:
                            args[argumentMetadata.index] = data;
                            break;
                        case webSocketServerArgsKey:
                            args[argumentMetadata.index] =
                                this.#globalContext.get(webSocketServerArgsKey);
                            break;
                    }
                }

                handlerMetadata.descriptor.value(...args);
            }
        } satisfies WebSocketHandler<T>;
    }

    /**
     *
     * @param param0
     * @returns
     */
    async #webSocketFetcher({
        request,
        server,
        context,
        url,
        query,
        method,
        responseHeaders,
        httpRouterGroup,
        startMiddlewareHandlers,
        endMiddlewareHandlers
    }: Required<{
        server: Server<TWebSocketUpgradeData>;
        request: Request;
        context: Context;
        url: URL;
        query: ReturnType<typeof QsParse>;
        method: THttpMethods;
        responseHeaders: Headers;
        httpRouterGroup: HttpRouterGroup;
        startMiddlewareHandlers: TStartMiddlewareHandlers;
        endMiddlewareHandlers: TEndMiddlewareHandlers;
    }>) {
        try {
            await this.#pipesEnforcer({
                type: "START_MIDDLEWARES",
                handlers: startMiddlewareHandlers,
                context: context
            });

            const routeResult = httpRouterGroup.find({
                pathname: url.pathname,
                method: method
            });

            let upgradeResult: Response | undefined = this.finalizeResponse(
                new Response(undefined, {
                    ...Objects.serverErrorStatuses.INTERNAL_SERVER_ERROR,
                    headers: responseHeaders
                })
            );

            if (routeResult) {
                const authResult = await this.#pipesEnforcer({
                    type: "GUARDS",
                    handlers: routeResult.guardHandlers,
                    context: context
                });

                if (authResult !== true) {
                    upgradeResult = this.finalizeResponse(
                        new Response(undefined, {
                            ...(!authResult || authResult === "UNAUTHORIZATION"
                                ? Objects.clientErrorStatuses.UNAUTHORIZED
                                : Objects.clientErrorStatuses.FORBIDDEN),
                            headers: responseHeaders
                        })
                    );
                } else {
                    context.set(routeModelArgsKey, routeResult.model);

                    await this.#pipesEnforcer({
                        type: "OPEN_INTERCEPTORS",
                        handlers: routeResult.openInterceptorHandlers,
                        context: context
                    });

                    const upgradeExecution = await routeResult.model.func(
                        ...[server, request, query]
                    );

                    await this.#pipesEnforcer({
                        type: "CLOSE_INTERCEPTORS",
                        handlers: routeResult.closeInterceptorHandlers,
                        context: context
                    });

                    if (typeof upgradeExecution !== "boolean" || !upgradeExecution) {
                        upgradeResult = this.finalizeResponse(
                            new Response(undefined, {
                                ...Objects.serverErrorStatuses.INTERNAL_SERVER_ERROR,
                                headers: responseHeaders
                            })
                        );
                    } else {
                        upgradeResult = undefined;
                    }
                }
            } else {
            }

            await this.#pipesEnforcer({
                type: "END_MIDDLEWARES",
                handlers: endMiddlewareHandlers,
                context: context
            });

            return upgradeResult;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     *
     * @param param0
     * @returns
     */
    async #staticFetcher({
        url,
        path,
        headers,
        cacheTimeInSeconds,
        responseHeaders
    }: {
        url: URL;
        path: string;
        responseHeaders: Headers;
        headers?: TParamsType;
        cacheTimeInSeconds?: number;
    }) {
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
                        ...Objects.successfulStatuses.OK,
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
                        ...Objects.successfulStatuses.OK,
                        headers: responseHeaders
                    })
                );
            }
        }
    }

    /**
     *
     * @param param0
     * @returns
     */
    async #httpFetcher({
        context,
        url,
        method,
        httpRouterGroup,
        startMiddlewareHandlers = [],
        endMiddlewareHandlers = []
    }: {
        context: Context;
        url: URL;
        method: THttpMethods;
        httpRouterGroup: HttpRouterGroup;
        startMiddlewareHandlers?: TStartMiddlewareHandlers;
        endMiddlewareHandlers?: TEndMiddlewareHandlers;
    }) {
        const contextOptions = { isStatic: true };

        context.setOptions(contextOptions);

        await this.#pipesEnforcer({
            type: "START_MIDDLEWARES",
            handlers: startMiddlewareHandlers,
            context: context
        });

        const routeResult = httpRouterGroup.find({
            pathname: url.pathname,
            method: method
        });

        if (!routeResult) {
            context
                .setOptions({ isStatic: false })
                .set(responseStatusArgsKey, Objects.clientErrorStatuses.NOT_FOUND.status)
                .set(responseStatusTextArgsKey, Objects.clientErrorStatuses.NOT_FOUND.statusText)
                .set(responseBodyArgsKey, undefined);
        } else {
            context.set(routeModelArgsKey, routeResult.model);

            const authResult = await this.#pipesEnforcer({
                type: "GUARDS",
                handlers: routeResult.guardHandlers,
                context: context
            });

            if (authResult !== true) {
                context
                    .setOptions({ isStatic: false })
                    .set(
                        responseStatusArgsKey,
                        !authResult || authResult === "UNAUTHORIZATION"
                            ? Objects.clientErrorStatuses.UNAUTHORIZED.status
                            : Objects.clientErrorStatuses.FORBIDDEN.status
                    )
                    .set(
                        responseStatusTextArgsKey,
                        !authResult || authResult === "UNAUTHORIZATION"
                            ? Objects.clientErrorStatuses.UNAUTHORIZED.statusText
                            : Objects.clientErrorStatuses.FORBIDDEN.statusText
                    )
                    .set(responseBodyArgsKey, undefined);
            } else {
                await this.#pipesEnforcer({
                    type: "OPEN_INTERCEPTORS",
                    handlers: routeResult.openInterceptorHandlers,
                    context: context
                });

                await this.#pipesEnforcer({
                    type: "CONTROLLER",
                    context: context
                });

                await this.#pipesEnforcer({
                    type: "CLOSE_INTERCEPTORS",
                    handlers: routeResult.closeInterceptorHandlers,
                    context: context
                });
            }
        }

        await this.#pipesEnforcer({
            type: "END_MIDDLEWARES",
            handlers: endMiddlewareHandlers,
            context: context
        });

        const latestResponseHeaders =
                context.get<Headers | null | undefined>(responseHeadersArgsKey, {
                    isStatic: true
                }) || new Headers(),
            latestResponseBody =
                context.get<unknown>(responseBodyArgsKey, { isStatic: false }) || undefined,
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
                typeof latestResponseStatusText !== "string" ? undefined : latestResponseStatusText,
            headers: latestResponseHeaders,
            data: latestResponseBody
        });
    }

    /**
     *
     * @param param0
     * @returns
     */
    async #containerResolver({
        prefix = "",
        startMiddlewareHandlers = [],
        endMiddlewareHandlers = [],
        guardHandlers = [],
        openInterceptorHandlers = [],
        closeInterceptorHandlers = [],
        controllerRouterGroup = new HttpRouterGroup(),
        webSocketHttpRouterGroup = new HttpRouterGroup(),
        webSocketRouterGroup = new WebSocketRouterGroup(),
        containerClass,
        options,
        extendInjector
    }: {
        containerClass: TConstructor<unknown>;
        prefix?: string;
        options: Omit<TApplicationOptions, "prefix">;
        extendInjector?: Injector;
        startMiddlewareHandlers?: TStartMiddlewareHandlers;
        endMiddlewareHandlers?: TEndMiddlewareHandlers;
        guardHandlers?: TGuardHandlers;
        openInterceptorHandlers?: TOpenInterceptorHandlers;
        closeInterceptorHandlers?: TCloseInterceptorHandlers;
        controllerRouterGroup?: HttpRouterGroup;
        webSocketHttpRouterGroup?: HttpRouterGroup;
        webSocketRouterGroup?: WebSocketRouterGroup;
    }) {
        if (!Reflect.getOwnMetadataKeys(containerClass).includes(containerKey)) {
            throw Error(`[${containerClass.name}] is not a container.`);
        }

        const injector = !extendInjector ? new Injector() : new Injector(extendInjector);
        const containerMetadata: TContainerMetadata = Reflect.getOwnMetadata(
            containerKey,
            containerClass
        );

        const {
            loaders,
            middlewares,
            dependencies,
            modules,
            guards,
            interceptors,
            prefix: containerPrefix,
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
        if (dependencies) {
            for (const dependency of dependencies) {
                const registerResult = injector.get(dependency);

                if (!registerResult) {
                    throw new Error(`Can not collect dependency [${dependency.name}].`);
                }
            }
        }
        //#endregion

        //#region [Middleware(s)]
        if (middlewares) {
            const middlwareChecker = (
                instance: unknown,
                ofClass: unknown
            ): ofClass is IMiddleware => !!instance;

            for (const middleware of middlewares) {
                const instance = injector.get<IMiddleware>(middleware);

                if (!instance || !middlwareChecker(instance, middleware)) {
                    throw new Error(`Can not collect middleware [${middleware.name}].`);
                }

                if (instance.start && typeof instance.start === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "start") || {};

                    startMiddlewareHandlers.push(
                        Object.freeze({
                            class: middleware,
                            funcName: "start",
                            func: instance.start.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }

                if (instance.end && typeof instance.end === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "end") || {};

                    endMiddlewareHandlers.push(
                        Object.freeze({
                            class: middleware,
                            funcName: "end",
                            func: instance.end.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }
            }
        }
        //#endregion

        //#region [Guard(s)]
        if (guards) {
            const guardChecker = (instance: unknown, ofClass: unknown): ofClass is IGuard =>
                !!instance;

            for (const guard of guards) {
                const instance = injector.get<IGuard>(guard);

                if (!instance || !guardChecker(instance, guard)) {
                    throw new Error(`Can not collect guard [${guard.name}].`);
                }

                const argumentsMetadata: TArgumentsMetadataCollection =
                    Reflect.getOwnMetadata(argumentsKey, guard, "enforce") || {};

                guardHandlers.push(
                    Object.freeze({
                        class: guard,
                        funcName: "enforce",
                        func: instance.enforce.bind(instance),
                        argumentsMetadata: argumentsMetadata
                    })
                );
            }
        }
        //#endregion

        //#region [Interceptor(s)]
        if (interceptors) {
            const interceptorChecker = (
                instance: unknown,
                ofClass: unknown
            ): ofClass is IInterceptor => !!instance;

            for (const interceptor of interceptors) {
                const instance = injector.get<IInterceptor>(interceptor);

                if (!instance || !interceptorChecker(instance, interceptor)) {
                    throw new Error(`Can not collect interceptor [${interceptor.name}].`);
                }

                if (instance) {
                    if (instance.open && typeof instance.open === "function") {
                        const argumentsMetadata: TArgumentsMetadataCollection =
                            Reflect.getOwnMetadata(argumentsKey, interceptor, "open") || {};

                        openInterceptorHandlers.push(
                            Object.freeze({
                                class: interceptor,
                                funcName: "open",
                                func: instance.open.bind(instance),
                                argumentsMetadata: argumentsMetadata
                            })
                        );
                    }

                    if (instance.close && typeof instance.close === "function") {
                        const argumentsMetadata: TArgumentsMetadataCollection =
                            Reflect.getOwnMetadata(argumentsKey, interceptor, "close") || {};

                        closeInterceptorHandlers.push(
                            Object.freeze({
                                class: interceptor,
                                funcName: "close",
                                func: instance.close.bind(instance),
                                argumentsMetadata: argumentsMetadata
                            })
                        );
                    }
                }
            }
        }
        //#endregion

        //#region [Module(s)]
        if (modules) {
            const fullPrefix = [prefix.trim(), containerPrefix?.trim() || ""]
                .filter((prefix) => prefix.length > 0)
                .join("/");

            for (const module of modules) {
                try {
                    await this.#moduleResolver({
                        prefix: fullPrefix,
                        moduleClass: module,
                        extendInjector: injector,
                        options: options,
                        startMiddlewareHandlers: startMiddlewareHandlers,
                        endMiddlewareHandlers: endMiddlewareHandlers,
                        guardHandlers: [...guardHandlers],
                        openInterceptorHandlers: [...openInterceptorHandlers],
                        closeInterceptorHandlers: [...closeInterceptorHandlers],
                        controllerRouterGroup: controllerRouterGroup,
                        webSocketHttpRouterGroup: webSocketHttpRouterGroup,
                        webSocketRouterGroup: webSocketRouterGroup
                    });
                } catch (error: unknown) {
                    console.group(`Can not resolve module: [${module.name}].`);
                    console.error(error);
                    console.groupEnd();
                    throw error;
                }
            }
        }
        //#endregion

        return Object.freeze({
            startMiddlewareHandlers: startMiddlewareHandlers,
            endMiddlewareHandlers: endMiddlewareHandlers,
            controllerRouterGroup: controllerRouterGroup,
            webSocketHttpRouterGroup: webSocketHttpRouterGroup,
            webSocketRouterGroup: webSocketRouterGroup
        });
    }

    /**
     *
     * @param param0
     * @returns
     */
    async #moduleResolver({
        prefix = "",
        startMiddlewareHandlers = [],
        endMiddlewareHandlers = [],
        guardHandlers = [],
        openInterceptorHandlers = [],
        closeInterceptorHandlers = [],
        controllerRouterGroup = new HttpRouterGroup(),
        webSocketHttpRouterGroup = new HttpRouterGroup(),
        webSocketRouterGroup = new WebSocketRouterGroup(),
        moduleClass,
        options,
        extendInjector
    }: {
        prefix?: string;
        moduleClass: TConstructor<unknown>;
        options: Omit<TApplicationOptions, "prefix">;
        extendInjector?: Injector;
        startMiddlewareHandlers?: TStartMiddlewareHandlers;
        endMiddlewareHandlers?: TEndMiddlewareHandlers;
        guardHandlers?: TGuardHandlers;
        openInterceptorHandlers?: TOpenInterceptorHandlers;
        closeInterceptorHandlers?: TCloseInterceptorHandlers;
        controllerRouterGroup?: HttpRouterGroup;
        webSocketHttpRouterGroup?: HttpRouterGroup;
        webSocketRouterGroup?: WebSocketRouterGroup;
    }) {
        if (!Reflect.getOwnMetadataKeys(moduleClass).includes(moduleKey)) {
            throw Error(`[${moduleClass.name}] is not a module.`);
        }

        const injector = !extendInjector ? new Injector() : new Injector(extendInjector);
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

        const fullPrefix = [prefix.trim(), modulePrefix?.trim() || ""]
            .filter((prefix) => prefix.length > 0)
            .join("/");

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
        if (dependencies) {
            for (const dependency of dependencies) {
                const registerResult = injector.get(dependency);

                if (!registerResult) {
                    throw new Error(`Can not collect dependency [${dependency.name}].`);
                }
            }
        }
        //#endregion

        //#region [Middleware(s)]
        if (middlewares) {
            const middlwareChecker = (
                instance: unknown,
                ofClass: unknown
            ): ofClass is IMiddleware => !!instance;

            for (const middleware of middlewares) {
                const instance = injector.get<IMiddleware>(middleware);

                if (!instance || !middlwareChecker(instance, middleware)) {
                    throw new Error(`Can not collect middleware [${middleware.name}].`);
                }

                if (instance.start && typeof instance.start === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "start") || {};

                    startMiddlewareHandlers.push(
                        Object.freeze({
                            class: middleware,
                            funcName: "start",
                            func: instance.start.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }

                if (instance.end && typeof instance.end === "function") {
                    const argumentsMetadata: TArgumentsMetadataCollection =
                        Reflect.getOwnMetadata(argumentsKey, middleware, "end") || {};

                    endMiddlewareHandlers.push(
                        Object.freeze({
                            class: middleware,
                            funcName: "end",
                            func: instance.end.bind(instance),
                            argumentsMetadata: argumentsMetadata
                        })
                    );
                }
            }
        }
        //#endregion

        //#region [Guard(s)]
        if (guards) {
            const guardChecker = (instance: unknown, ofClass: unknown): ofClass is IGuard =>
                !!instance;

            for (const guard of guards) {
                const instance = injector.get<IGuard>(guard);

                if (!instance || !guardChecker(instance, guard)) {
                    throw new Error(`Can not collect guard [${guard.name}].`);
                }

                const argumentsMetadata: TArgumentsMetadataCollection =
                    Reflect.getOwnMetadata(argumentsKey, guard, "enforce") || {};

                guardHandlers.push(
                    Object.freeze({
                        class: guard,
                        funcName: "enforce",
                        func: instance.enforce.bind(instance),
                        argumentsMetadata: argumentsMetadata
                    })
                );
            }
        }
        //#endregion

        //#region [Interceptor(s)]
        if (interceptors) {
            const interceptorChecker = (
                instance: unknown,
                ofClass: unknown
            ): ofClass is IInterceptor => !!instance;

            for (const interceptor of interceptors) {
                const instance = injector.get<IInterceptor>(interceptor);

                if (!instance || !interceptorChecker(instance, interceptor)) {
                    throw new Error(`Can not collect interceptor [${interceptor.name}].`);
                }

                if (instance) {
                    if (instance.open && typeof instance.open === "function") {
                        const argumentsMetadata: TArgumentsMetadataCollection =
                            Reflect.getOwnMetadata(argumentsKey, interceptor, "open") || {};

                        openInterceptorHandlers.push(
                            Object.freeze({
                                class: interceptor,
                                funcName: "open",
                                func: instance.open.bind(instance),
                                argumentsMetadata: argumentsMetadata
                            })
                        );
                    }

                    if (instance.close && typeof instance.close === "function") {
                        const argumentsMetadata: TArgumentsMetadataCollection =
                            Reflect.getOwnMetadata(argumentsKey, interceptor, "close") || {};

                        closeInterceptorHandlers.push(
                            Object.freeze({
                                class: interceptor,
                                funcName: "close",
                                func: instance.close.bind(instance),
                                argumentsMetadata: argumentsMetadata
                            })
                        );
                    }
                }
            }
        }
        //#endregion

        //#region [Controller(s)]
        if (controllers) {
            for (const controller of controllers) {
                this.#controllerResolver({
                    controllerConstructor: controller,
                    prefix: fullPrefix,
                    injector: injector,
                    httpRouterGroup: controllerRouterGroup,
                    guardHandlers: [...guardHandlers],
                    openInterceptorHandlers: [...openInterceptorHandlers],
                    closeInterceptorHandlers: [...closeInterceptorHandlers]
                });
            }
        }
        //#endregion

        //#region [WebSocket(s)]
        if (webSockets) {
            for (const webSocket of webSockets) {
                this.#webSocketResolver({
                    webSocketConstructor: webSocket,
                    injector: injector,
                    prefix: fullPrefix,
                    webSocketHttpRouterGroup: webSocketHttpRouterGroup,
                    webSocketRouterGroup: webSocketRouterGroup
                });
            }
        }
        //#endregion

        return Object.freeze({
            startMiddlewareHandlers: startMiddlewareHandlers,
            endMiddlewareHandlers: endMiddlewareHandlers,
            controllerRouterGroup: controllerRouterGroup,
            webSocketHttpRouterGroup: webSocketHttpRouterGroup,
            webSocketRouterGroup: webSocketRouterGroup
        });
    }

    /**
     *
     * @param param0
     * @returns
     */
    #controllerResolver({
        controllerConstructor,
        prefix = "",
        injector = new Injector(),
        httpRouterGroup = new HttpRouterGroup(),
        guardHandlers = [],
        openInterceptorHandlers = [],
        closeInterceptorHandlers = []
    }: Readonly<{
        controllerConstructor: TConstructor<unknown>;
        injector?: Injector;
        prefix?: string;
        httpRouterGroup?: HttpRouterGroup;
        guardHandlers?: TGuardHandlers;
        openInterceptorHandlers?: TOpenInterceptorHandlers;
        closeInterceptorHandlers?: TCloseInterceptorHandlers;
    }>) {
        if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(controllerKey)) {
            throw Error(`[${controllerConstructor.name}] is not a controller.`);
        }

        const controller = injector.get<IController>(controllerConstructor);

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

        const fullPrefix = [prefix.trim(), controllerMetadata.prefix.trim()]
            .filter((prefix) => prefix.length > 0)
            .join("/");

        const router = new HttpRouter({
            alias: fullPrefix,
            guardHandlers: guardHandlers,
            openInterceptorHandlers: openInterceptorHandlers,
            closeInterceptorHandlers: closeInterceptorHandlers
        });

        for (const routeMetadata of controllerMetadata.httpMetadata) {
            if (typeof routeMetadata.descriptor.value !== "function") {
                continue;
            }

            const route = router.route({
                alias: routeMetadata.path
            });
            const handler = routeMetadata.descriptor.value.bind(controller);
            const httpRouteModel = Object.freeze({
                class: controllerConstructor,
                funcName: routeMetadata.methodName,
                func: handler,
                argumentsMetadata: routeMetadata.argumentsMetadata
            });

            switch (routeMetadata.httpMethod) {
                case "GET":
                    route.get({ model: httpRouteModel });
                    break;
                case "POST":
                    route.post({ model: httpRouteModel });
                    break;
                case "PUT":
                    route.put({ model: httpRouteModel });
                    break;
                case "PATCH":
                    route.patch({ model: httpRouteModel });
                    break;
                case "DELETE":
                    route.delete({ model: httpRouteModel });
                    break;
                case "OPTIONS":
                    route.options({ model: httpRouteModel });
                    break;
            }
        }

        return httpRouterGroup.add(router);
    }

    /**
     *
     * @param param0
     * @returns
     */
    async #argumentsResolver<TValidationSchema = unknown>({
        data,
        validationSchema,
        argumentIndex,
        funcName
    }: {
        data: unknown;
        validationSchema: TValidationSchema;
        argumentIndex: number;
        funcName: string | symbol;
    }) {
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
    #webSocketResolver({
        webSocketConstructor,
        prefix = "",
        injector = new Injector(),
        webSocketHttpRouterGroup = new HttpRouterGroup(),
        webSocketRouterGroup = new WebSocketRouterGroup(),
        guardHandlers = [],
        openInterceptorHandlers = [],
        closeInterceptorHandlers = []
    }: Readonly<{
        webSocketConstructor: TConstructor<unknown>;
        webSocketHttpRouterGroup?: HttpRouterGroup;
        webSocketRouterGroup?: WebSocketRouterGroup;
        injector?: Injector;
        prefix?: string;
        guardHandlers?: TGuardHandlers;
        openInterceptorHandlers?: TOpenInterceptorHandlers;
        closeInterceptorHandlers?: TCloseInterceptorHandlers;
    }>): Readonly<{
        webSocketHttpRouterGroup: HttpRouterGroup;
        webSocketRouterGroup: WebSocketRouterGroup;
    }> {
        if (!Reflect.getOwnMetadataKeys(webSocketConstructor).includes(webSocketKey)) {
            throw Error(`[${webSocketConstructor.name}] is not a websocket route.`);
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

        const fullPrefix = `/${prefix}/${webSocketMetadata.prefix}`;

        //#region [HTTP ROUTER]
        const router = new HttpRouter({
            alias: fullPrefix,
            guardHandlers: guardHandlers,
            openInterceptorHandlers: openInterceptorHandlers,
            closeInterceptorHandlers: closeInterceptorHandlers
        });

        for (const [_key, httpMetadata] of Object.entries(webSocketMetadata.http)) {
            if (typeof httpMetadata.descriptor?.value !== "function") {
                continue;
            }

            const route = router.route({
                alias: httpMetadata.path
            });
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

        webSocketHttpRouterGroup.add(router);
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
            webSocketHttpRouterGroup: webSocketHttpRouterGroup,
            webSocketRouterGroup: webSocketRouterGroup
        });
    }

    /**
     *
     * @param data
     */
    async #pipesEnforcer(
        data: TStartMiddlewaresPipe & {
            context: Context;
        }
    ): Promise<undefined>;
    async #pipesEnforcer(
        data: TEndMiddlewaresPipe & {
            context: Context;
        }
    ): Promise<undefined>;
    async #pipesEnforcer(
        data: TOpenInterceptorsPipe & {
            context: Context;
        }
    ): Promise<undefined>;
    async #pipesEnforcer(
        data: TCloseInterceptorsPipe & {
            context: Context;
        }
    ): Promise<undefined>;
    async #pipesEnforcer(
        data: TGuardsPipe & {
            context: Context;
        }
    ): Promise<TGuardReturn>;
    async #pipesEnforcer(
        data: TControllerPipe & {
            context: Context;
        }
    ): Promise<undefined>;
    async #pipesEnforcer({
        type,
        handlers,
        context
    }: TPipesEnforcerUnion & {
        context: Context;
    }): Promise<unknown> {
        const contextOptions = { isStatic: true };

        context.setOptions(contextOptions);

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

        if (type === "START_MIDDLEWARES" || type === "END_MIDDLEWARES") {
            const strategy =
                type === "START_MIDDLEWARES"
                    ? this.#resolutedOptions.pipelineStrategy.startMiddlewares
                    : this.#resolutedOptions.pipelineStrategy.endMiddlewares;

            for (
                let i = strategy === "FIFO" ? 0 : handlers.length - 1;
                strategy === "FIFO" ? i < handlers.length : i > -1;
                strategy === "FIFO" ? i++ : i--
            ) {
                const args = [];
                const { func: handler, funcName: functionName, argumentsMetadata } = handlers[i];

                for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argMetadata.type) {
                        case contextArgsKey:
                            args[argMetadata.index] = !argMetadata.key
                                ? context
                                : context.get(argMetadata.key, contextOptions);
                            break;
                        case requestArgsKey:
                            args[argMetadata.index] = request;
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await this.#argumentsResolver({
                                      data: await request?.[argMetadata.parser || "json"](),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case requestHeadersArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? requestHeaders
                                : await this.#argumentsResolver({
                                      data: requestHeaders?.toJSON(),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await this.#argumentsResolver({
                                      data: requestHeaders?.get(argMetadata.key) || undefined,
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await this.#argumentsResolver({
                                      data: parameters?.[argMetadata.key] || undefined,
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case routeModelArgsKey:
                            args[argMetadata.index] = undefined;
                            break;
                        case responseHeadersArgsKey:
                            args[argMetadata.index] = responseHeaders;
                            break;
                        case httpServerArgsKey:
                            args[argMetadata.index] = httpServer;
                            break;
                        default:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? context.get(argMetadata.type, contextOptions)
                                : await this.#argumentsResolver({
                                      data: context.get(argMetadata.type, contextOptions),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                    }
                }

                await handler(...args);
            }
        } else if (type === "GUARDS") {
            if (!routeModel || handlers.length === 0) {
                return true;
            }

            for (let i = 0; i < handlers.length; i++) {
                const args = [];
                const { func: handler, funcName: functionName, argumentsMetadata } = handlers[i];

                for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argMetadata.type) {
                        case requestArgsKey:
                            args[argMetadata.index] = request;
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await this.#argumentsResolver({
                                      data: await request?.[argMetadata.parser || "json"](),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case contextArgsKey:
                            args[argMetadata.index] = !argMetadata.key
                                ? context
                                : context.get(argMetadata.key);
                            break;
                        case requestHeadersArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? requestHeaders
                                : await this.#argumentsResolver({
                                      data: requestHeaders?.toJSON(),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case responseHeadersArgsKey:
                            args[argMetadata.index] = responseHeaders;
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await this.#argumentsResolver({
                                      data: requestHeaders?.get(argMetadata.key) || undefined,
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await this.#argumentsResolver({
                                      data: parameters?.[argMetadata.key],
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case routeModelArgsKey:
                            args[argMetadata.index] = routeModel;
                            break;
                        case httpServerArgsKey:
                            args[argMetadata.index] = httpServer;
                            break;
                        default:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? context.get(argMetadata.type)
                                : await this.#argumentsResolver({
                                      data: context.get(argMetadata.type),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                    }
                }

                const guardResult = await handler(...args);

                if (guardResult !== true) {
                    return guardResult;
                }
            }

            return true;
        } else if (type === "OPEN_INTERCEPTORS" || type === "CLOSE_INTERCEPTORS") {
            if (!routeModel) {
                return;
            }

            const strategy =
                type === "OPEN_INTERCEPTORS"
                    ? this.#resolutedOptions.pipelineStrategy.openInterceptors
                    : this.#resolutedOptions.pipelineStrategy.closeInterceptors;

            for (
                let i = strategy === "FIFO" ? 0 : handlers.length - 1;
                strategy === "FIFO" ? i < handlers.length : i > -1;
                strategy === "FIFO" ? i++ : i--
            ) {
                const args = [];
                const { func: handler, funcName: functionName, argumentsMetadata } = handlers[i];

                for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argMetadata.type) {
                        case requestArgsKey:
                            args[argMetadata.index] = request;
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await this.#argumentsResolver({
                                      data: await request?.[argMetadata.parser || "json"](),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case contextArgsKey:
                            args[argMetadata.index] = !argMetadata.key
                                ? context
                                : context.get(argMetadata.key);
                            break;
                        case requestHeadersArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? requestHeaders
                                : await this.#argumentsResolver({
                                      data: requestHeaders?.toJSON(),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await this.#argumentsResolver({
                                      data: requestHeaders?.get(argMetadata.key) || undefined,
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case responseHeadersArgsKey:
                            args[argMetadata.index] = responseHeaders;
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await this.#argumentsResolver({
                                      data: parameters?.[argMetadata.key] || undefined,
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                        case routeModelArgsKey:
                            args[argMetadata.index] = routeModel;
                            break;
                        case httpServerArgsKey:
                            args[argMetadata.index] = httpServer;
                            break;
                        default:
                            args[argMetadata.index] = !argMetadata.validationSchema
                                ? context.get(argMetadata.type)
                                : await this.#argumentsResolver({
                                      data: context.get(argMetadata.type),
                                      validationSchema: argMetadata.validationSchema,
                                      argumentIndex: argMetadata.index,
                                      funcName: functionName
                                  });
                            break;
                    }
                }

                await handler(...args);
            }
        } else if (type === "CONTROLLER") {
            if (!routeModel) {
                context
                    .setOptions({ isStatic: false })
                    .set(responseStatusArgsKey, 404)
                    .set(responseStatusTextArgsKey, "Not found.");

                return;
            }

            const controllerActionArguments: any[] = [];
            const {
                func: controllerAction,
                funcName: controllerActionName,
                argumentsMetadata: controllerActionArgumentsMetadata
            } = routeModel;

            for (const [_key, argMetadata] of Object.entries(controllerActionArgumentsMetadata)) {
                switch (argMetadata.type) {
                    case requestArgsKey:
                        controllerActionArguments[argMetadata.index] = request;
                        break;
                    case requestBodyArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? await request?.[argMetadata.parser || "json"]()
                            : await this.#argumentsResolver({
                                  data: await request?.[argMetadata.parser || "json"](),
                                  validationSchema: argMetadata.validationSchema,
                                  argumentIndex: argMetadata.index,
                                  funcName: controllerActionName
                              });
                        break;
                    case contextArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.key
                            ? context
                            : context.get(argMetadata.key);
                        break;
                    case requestHeadersArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? requestHeaders
                            : await this.#argumentsResolver({
                                  data: requestHeaders?.toJSON(),
                                  validationSchema: argMetadata.validationSchema,
                                  argumentIndex: argMetadata.index,
                                  funcName: controllerActionName
                              });
                        break;
                    case requestHeaderArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? requestHeaders?.get(argMetadata.key) || undefined
                            : await this.#argumentsResolver({
                                  data: requestHeaders?.get(argMetadata.key) || undefined,
                                  validationSchema: argMetadata.validationSchema,
                                  argumentIndex: argMetadata.index,
                                  funcName: controllerActionName
                              });
                        break;
                    case responseHeadersArgsKey:
                        controllerActionArguments[argMetadata.index] = responseHeaders;
                        break;
                    case paramArgsKey:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? parameters?.[argMetadata.key] || undefined
                            : await this.#argumentsResolver({
                                  data: parameters?.[argMetadata.key] || undefined,
                                  validationSchema: argMetadata.validationSchema,
                                  argumentIndex: argMetadata.index,
                                  funcName: controllerActionName
                              });
                        break;
                    case routeModelArgsKey:
                        controllerActionArguments[argMetadata.index] = routeModel;
                        break;
                    case httpServerArgsKey:
                        controllerActionArguments[argMetadata.index] = httpServer;
                        break;
                    default:
                        controllerActionArguments[argMetadata.index] = !argMetadata.validationSchema
                            ? context.get(argMetadata.type)
                            : await this.#argumentsResolver({
                                  data: context.get(argMetadata.type),
                                  validationSchema: argMetadata.validationSchema,
                                  argumentIndex: argMetadata.index,
                                  funcName: controllerActionName
                              });
                        break;
                }
            }

            context.set(responseBodyArgsKey, await controllerAction(...controllerActionArguments), {
                isStatic: false
            });
        }

        return;
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
        const inferedStatus = !status ? (!data ? 204 : 200) : status;
        const inferedStatusText = inferStatusText(inferedStatus);

        if (contentType.includes("application/json")) {
            return this.finalizeResponse(
                new Response(
                    !data
                        ? undefined
                        : data instanceof ReadableStream
                        ? data
                        : JSON.stringify(data),
                    {
                        status: inferedStatus,
                        statusText: inferedStatusText,
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
                        status: inferedStatus,
                        statusText: inferedStatusText,
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
                        status: inferedStatus,
                        statusText: inferedStatusText,
                        headers: headers
                    })
                );
            }

            throw new Error("Invalid data type for application/octet-stream");
        }

        if (contentType.includes("multipart/form-data")) {
            if (data instanceof FormData) {
                return this.finalizeResponse(
                    new Response(data, {
                        status: inferedStatus,
                        statusText: inferedStatusText,
                        headers: headers
                    })
                );
            }

            throw new Error("multipart/form-data requires FormData object");
        }

        return this.finalizeResponse(
            new Response(!data ? undefined : String(data), {
                status: inferedStatus,
                statusText: inferedStatusText,
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
}
