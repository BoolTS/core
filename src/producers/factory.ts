import type { BunFile, Server } from "bun";
import type {
    TContainerMetadata,
    TControllerMetadata,
    TModuleMetadata,
    TWebSocketEventHandlerMetadata,
    TWebSocketMetadata
} from "../decorators";
import type { TArgumentsMetadataCollection } from "../decorators/arguments";
import type { TWebSocketUpgradeData } from "../decorators/webSocket";
import type { IGuard, IMiddleware } from "../interfaces";
import type { IDispatcher } from "../interfaces/dispatcher";

import "reflect-metadata";

import Qs from "qs";
import * as Zod from "zod";

import { ETimeUnit, add as TimeAdd } from "@bool-ts/date-time";
import {
    HttpRouter,
    HttpRouterGroup,
    WebSocketRoute,
    WebSocketRouter,
    WebSocketRouterGroup
} from "../entities";
import { HttpClientError, HttpServerError, jsonErrorInfer, type THttpMethods } from "../http";
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
import { Injector } from "./injector";

export type TParamsType = Record<string, string>;

export type TGroupElementModel<
    TFuncName extends keyof TClass,
    TClass extends Object = Object,
    TFunc = TClass[TFuncName]
> = Readonly<{
    class: TClass;
    func: TFunc;
    funcName: TFuncName;
    argumentsMetadata: TArgumentsMetadataCollection;
}>;

export type TBoolFactoryOptions = Required<{
    port: number;
}> &
    Partial<{
        config: Record<string | symbol, any> | (() => Record<string | symbol, any>);
        prefix: string;
        debug: boolean;
        log: Partial<{
            methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
        }>;
        queryParser: Parameters<typeof Qs.parse>[1];
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
            methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
            headers: Array<string>;
        }>;
    }>;

const DEFAULT_STATIC_CACHE_TIME_IN_SECONDS = 900;

const responseConverter = (response: Response) => {
    response.headers.set("X-Powered-By", "Bool Typescript");

    return response;
};

const controllerCreator = ({
    controllerConstructor,
    httpRouterGroup,
    injector,
    prefix
}: Readonly<{
    controllerConstructor: new (...args: any[]) => unknown;
    httpRouterGroup: HttpRouterGroup;
    injector: Injector;
    prefix?: string;
}>) => {
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

    const router = new HttpRouter(`/${prefix || ""}/${controllerMetadata.prefix}`);

    controllerMetadata.httpMetadata.forEach((routeMetadata) => {
        if (typeof routeMetadata.descriptor.value !== "function") {
            return;
        }

        const route = router.route(routeMetadata.path);
        const handler = routeMetadata.descriptor.value.bind(controller);
        const routeArgument = Object.freeze({
            class: controllerConstructor,
            funcName: routeMetadata.methodName,
            func: handler,
            argumentsMetadata: routeMetadata.argumentsMetadata
        });

        switch (routeMetadata.httpMethod) {
            case "GET":
                return route.get(routeArgument);
            case "POST":
                return route.post(routeArgument);
            case "PUT":
                return route.put(routeArgument);
            case "PATCH":
                return route.patch(routeArgument);
            case "DELETE":
                return route.delete(routeArgument);
            case "OPTIONS":
                return route.options(routeArgument);
        }
    });

    return httpRouterGroup.add(router);
};

const webSocketCreator = ({
    injector,
    httpRouterGroup,
    prefix,
    webSocketRouterGroup,
    webSocketConstructor
}: Readonly<{
    webSocketConstructor: new (...args: any[]) => unknown;
    httpRouterGroup: HttpRouterGroup;
    webSocketRouterGroup: WebSocketRouterGroup;
    injector: Injector;
    prefix?: string;
}>): Readonly<{
    httpRouterGroup: HttpRouterGroup;
    webSocketRouterGroup: WebSocketRouterGroup;
}> => {
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
    const router = new HttpRouter(fullPrefix);

    for (const [_key, httpMetadata] of Object.entries(webSocketMetadata.http)) {
        if (typeof httpMetadata.descriptor?.value !== "function") {
            continue;
        }

        const route = router.route(httpMetadata.path);
        const handler = httpMetadata.descriptor.value.bind(webSocket);
        const routeArgument = Object.freeze({
            class: webSocketConstructor,
            funcName: httpMetadata.methodName,
            func: handler,
            argumentsMetadata: httpMetadata.argumentsMetadata
        });

        switch (httpMetadata.httpMethod) {
            case "GET":
                route.get(routeArgument);
                break;
            case "POST":
                route.post(routeArgument);
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
};

const argumentsResolution = async (
    data: unknown,
    zodSchema: Zod.Schema,
    argumentIndex: number,
    funcName: string | symbol
) => {
    try {
        const validation = await zodSchema.safeParseAsync(data);

        if (!validation.success) {
            throw new HttpClientError({
                httpCode: 400,
                message: `Validation at the [${funcName.toString()}] method fails at positional argument [${argumentIndex}].`,
                data: validation.error.issues
            });
        }

        return validation.data;
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
};

const containerResolution = async ({
    containerClass,
    options,
    extendInjector
}: {
    containerClass: new (...args: any[]) => unknown;
    options: TBoolFactoryOptions;
    extendInjector: Injector;
}) => {
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
                    Reflect.getOwnMetadata(argumentsKey, middleware, "start") || {};

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
    const guardGroup: Array<TGroupElementModel<"enforce", IGuard, NonNullable<IGuard["enforce"]>>> =
        !guards
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
};

const moduleResolution = async ({
    moduleClass,
    options,
    extendInjector
}: {
    moduleClass: new (...args: any[]) => unknown;
    options: TBoolFactoryOptions;
    extendInjector: Injector;
}) => {
    if (!Reflect.getOwnMetadataKeys(moduleClass).includes(moduleKey)) {
        throw Error(`${moduleClass.name} is not a module.`);
    }

    const injector = new Injector(extendInjector);
    const moduleMetadata: TModuleMetadata = Reflect.getOwnMetadata(moduleKey, moduleClass);

    const {
        loaders,
        middlewares,
        guards,
        dispatchers,
        controllers,
        dependencies,
        webSockets,
        prefix: modulePrefix,
        config: moduleConfig
    } = moduleMetadata || {};

    const fullPrefix = `${options.prefix || ""}/${modulePrefix || ""}`;

    //#region [Configuration(s)]
    const { config } = Object.freeze({
        config: {
            ...(typeof options.config !== "function" ? options.config : await options.config()),
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
                    Reflect.getOwnMetadata(argumentsKey, middleware, "start") || {};

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
    const guardGroup: Array<TGroupElementModel<"enforce", IGuard, NonNullable<IGuard["enforce"]>>> =
        !guards
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

    //#region [Before dispatcher(s)]
    const openDispatcherGroup: Array<
        TGroupElementModel<"open", IDispatcher, NonNullable<IDispatcher["open"]>>
    > = [];
    const closeDispatcherGroup: Array<
        TGroupElementModel<"close", IDispatcher, NonNullable<IDispatcher["close"]>>
    > = [];

    !dispatchers ||
        dispatchers.forEach((dispatcher) => {
            const instance = injector.get<IDispatcher>(dispatcher);

            if (instance.open && typeof instance.open === "function") {
                const argumentsMetadata: TArgumentsMetadataCollection =
                    Reflect.getOwnMetadata(argumentsKey, dispatcher, "open") || {};

                openDispatcherGroup.push(
                    Object.freeze({
                        class: dispatcher as IDispatcher,
                        funcName: "open",
                        func: instance.open.bind(instance),
                        argumentsMetadata: argumentsMetadata
                    })
                );
            }

            if (instance.close && typeof instance.close === "function") {
                const argumentsMetadata: TArgumentsMetadataCollection =
                    Reflect.getOwnMetadata(argumentsKey, dispatcher, "close") || {};

                closeDispatcherGroup.push(
                    Object.freeze({
                        class: dispatcher as IDispatcher,
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
            controllerCreator({
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
            webSocketCreator({
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
        openDispatcherGroup: openDispatcherGroup,
        closeDispatcherGroup: closeDispatcherGroup,
        controllerRouterGroup: controllerRouterGroup,
        webSocketHttpRouterGroup: webSocketHttpRouterGroup,
        webSocketRouterGroup: webSocketRouterGroup
    });
};

const webSocketFetcher = async (
    bun: Required<{
        request: Request;
        server: Server;
    }>,
    bool: Required<{
        responseHeaders: Headers;
        query: Record<string, unknown>;
        route: NonNullable<ReturnType<HttpRouterGroup["find"]>>;
        moduleResolution: NonNullable<Awaited<ReturnType<typeof moduleResolution>>>;
    }>
) => {
    const { request, server } = bun;
    const {
        query,
        responseHeaders,
        route: { model }
    } = bool;

    // Execute controller action
    const isUpgrade = await model.func(...[server, request, query]);

    if (typeof isUpgrade !== "boolean") {
        return responseConverter(
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
        return responseConverter(
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
};

const httpFetcher = async (
    bool: Required<{}> &
        Partial<{
            route: NonNullable<ReturnType<HttpRouterGroup["find"]>>;
            resolutedMap:
                | Partial<NonNullable<Awaited<ReturnType<typeof containerResolution>>>>
                | Partial<NonNullable<Awaited<ReturnType<typeof moduleResolution>>>>;
            context: Context;
        }>
) => {
    const { context: outerContext, route, resolutedMap } = bool;

    const context = (!outerContext ? new Context() : new Context(outerContext)).setOptions({
        isStatic: true
    });

    if (route) {
        context.set(paramsArgsKey, route.parameters).set(routeModelArgsKey, route.model);
    }

    const httpServer = context.get<Server | null | undefined>(httpServerArgsKey) || undefined,
        request = context.get<Request | null | undefined>(requestArgsKey) || undefined,
        requestHeaders = context.get<Headers | null | undefined>(requestHeaderArgsKey) || undefined,
        responseHeaders =
            context.get<Headers | null | undefined>(responseHeadersArgsKey) || undefined,
        parameters = context.get<TParamsType | null | undefined>(paramsArgsKey) || undefined,
        routeModel =
            context.get<
                NonNullable<ReturnType<HttpRouterGroup["find"]>>["model"] | null | undefined
            >(routeModelArgsKey) || undefined;

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
                                : context.get(argMetadata.key);
                            break;
                        case requestArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? request
                                : await argumentsResolution(
                                      request,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await argumentsResolution(
                                      await request?.[argMetadata.parser || "json"](),
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestHeadersArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders
                                : await argumentsResolution(
                                      requestHeaders?.toJSON(),
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await argumentsResolution(
                                      requestHeaders?.get(argMetadata.key) || undefined,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await argumentsResolution(
                                      parameters?.[argMetadata.key] || undefined,
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? !context.has(argMetadata.type)
                                    ? undefined
                                    : context.get(argMetadata.type)
                                : await argumentsResolution(
                                      !(argMetadata.type in context)
                                          ? undefined
                                          : context.get(argMetadata.type),
                                      argMetadata.zodSchema,
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
                const { func: handler, funcName: functionName, argumentsMetadata } = guardGroup[i];

                for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argMetadata.type) {
                        case requestArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? request
                                : await argumentsResolution(
                                      request,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await argumentsResolution(
                                      await request?.[argMetadata.parser || "json"](),
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders
                                : await argumentsResolution(
                                      requestHeaders?.toJSON(),
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case responseHeadersArgsKey:
                            args[argMetadata.index] = responseHeaders;
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await argumentsResolution(
                                      requestHeaders?.get(argMetadata.key) || undefined,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await argumentsResolution(
                                      parameters?.[argMetadata.key],
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? !context.has(argMetadata.type)
                                    ? undefined
                                    : context.get(argMetadata.type)
                                : await argumentsResolution(
                                      context.get(argMetadata.type),
                                      argMetadata.zodSchema,
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

    if (routeModel) {
        if (
            resolutedMap &&
            "openDispatcherGroup" in resolutedMap &&
            resolutedMap.openDispatcherGroup
        ) {
            const { openDispatcherGroup } = resolutedMap;

            // Execute open dispatcher(s)
            for (let i = 0; i < openDispatcherGroup.length; i++) {
                const args = [];
                const {
                    func: handler,
                    funcName: functionName,
                    argumentsMetadata
                } = openDispatcherGroup[i];

                for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argMetadata.type) {
                        case requestArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? request
                                : await argumentsResolution(
                                      request,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await argumentsResolution(
                                      await request?.[argMetadata.parser || "json"](),
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders
                                : await argumentsResolution(
                                      requestHeaders?.toJSON(),
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await argumentsResolution(
                                      requestHeaders?.get(argMetadata.key) || undefined,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case responseHeadersArgsKey:
                            args[argMetadata.index] = responseHeaders;
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await argumentsResolution(
                                      parameters?.[argMetadata.key] || undefined,
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? !context.has(argMetadata.type)
                                    ? undefined
                                    : context.get(argMetadata.type)
                                : await argumentsResolution(
                                      context.get(argMetadata.type),
                                      argMetadata.zodSchema,
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
                    controllerActionArguments[argMetadata.index] = !argMetadata.zodSchema
                        ? request
                        : await argumentsResolution(
                              request,
                              argMetadata.zodSchema,
                              argMetadata.index,
                              controllerActionName
                          );
                    break;
                case requestBodyArgsKey:
                    controllerActionArguments[argMetadata.index] = !argMetadata.zodSchema
                        ? await request?.[argMetadata.parser || "json"]()
                        : await argumentsResolution(
                              await request?.[argMetadata.parser || "json"](),
                              argMetadata.zodSchema,
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
                    controllerActionArguments[argMetadata.index] = !argMetadata.zodSchema
                        ? requestHeaders
                        : await argumentsResolution(
                              requestHeaders?.toJSON(),
                              argMetadata.zodSchema,
                              argMetadata.index,
                              controllerActionName
                          );
                    break;
                case requestHeaderArgsKey:
                    controllerActionArguments[argMetadata.index] = !argMetadata.zodSchema
                        ? requestHeaders?.get(argMetadata.key) || undefined
                        : await argumentsResolution(
                              requestHeaders?.get(argMetadata.key) || undefined,
                              argMetadata.zodSchema,
                              argMetadata.index,
                              controllerActionName
                          );
                    break;
                case responseHeadersArgsKey:
                    controllerActionArguments[argMetadata.index] = responseHeaders;
                    break;
                case paramArgsKey:
                    controllerActionArguments[argMetadata.index] = !argMetadata.zodSchema
                        ? parameters?.[argMetadata.key] || undefined
                        : await argumentsResolution(
                              parameters?.[argMetadata.key] || undefined,
                              argMetadata.zodSchema,
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
                    controllerActionArguments[argMetadata.index] = !argMetadata.zodSchema
                        ? !context.has(argMetadata.type)
                            ? undefined
                            : context.get(argMetadata.type)
                        : await argumentsResolution(
                              context.get(argMetadata.type),
                              argMetadata.zodSchema,
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
            "closeDispatcherGroup" in resolutedMap &&
            resolutedMap.closeDispatcherGroup
        ) {
            const { closeDispatcherGroup } = resolutedMap;

            // Execute close dispatcher(s)
            for (let i = 0; i < closeDispatcherGroup.length; i++) {
                const args = [];
                const {
                    func: handler,
                    funcName: functionName,
                    argumentsMetadata
                } = closeDispatcherGroup[i];

                for (const [_key, argMetadata] of Object.entries(argumentsMetadata)) {
                    switch (argMetadata.type) {
                        case requestArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? request
                                : await argumentsResolution(
                                      request,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await argumentsResolution(
                                      await request?.[argMetadata.parser || "json"](),
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders
                                : await argumentsResolution(
                                      requestHeaders?.toJSON(),
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case responseHeadersArgsKey:
                            args[argMetadata.index] = context.get(argMetadata.type);
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await argumentsResolution(
                                      requestHeaders?.get(argMetadata.key) || undefined,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await argumentsResolution(
                                      parameters?.[argMetadata.key] || undefined,
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? !context.has(argMetadata.type)
                                    ? undefined
                                    : context.get(argMetadata.type)
                                : await argumentsResolution(
                                      context.get(argMetadata.type),
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? request
                                : await argumentsResolution(
                                      request,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case requestBodyArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? await request?.[argMetadata.parser || "json"]()
                                : await argumentsResolution(
                                      await request?.[argMetadata.parser || "json"](),
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders
                                : await argumentsResolution(
                                      requestHeaders?.toJSON(),
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case responseHeadersArgsKey:
                            args[argMetadata.index] = context.get(argMetadata.type);
                            break;
                        case requestHeaderArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? requestHeaders?.get(argMetadata.key) || undefined
                                : await argumentsResolution(
                                      requestHeaders?.get(argMetadata.key) || undefined,
                                      argMetadata.zodSchema,
                                      argMetadata.index,
                                      functionName
                                  );
                            break;
                        case paramArgsKey:
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? parameters?.[argMetadata.key] || undefined
                                : await argumentsResolution(
                                      parameters?.[argMetadata.key] || undefined,
                                      argMetadata.zodSchema,
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
                            args[argMetadata.index] = !argMetadata.zodSchema
                                ? !context.has(argMetadata.type)
                                    ? undefined
                                    : context.get(argMetadata.type)
                                : await argumentsResolution(
                                      !(argMetadata.type in context)
                                          ? undefined
                                          : context.get(argMetadata.type),
                                      argMetadata.zodSchema,
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
};

export const BoolFactory = async (
    classConstructor: new (...args: any[]) => unknown,
    options: TBoolFactoryOptions
) => {
    try {
        const staticMap: Map<
            string,
            Readonly<{
                expiredAt: Date;
                file: BunFile;
            }>
        > = new Map();

        const {
            allowLogsMethods,
            staticOption,
            allowOrigins,
            allowMethods,
            allowCredentials,
            allowHeaders
        } = Object.freeze({
            allowLogsMethods: options?.log?.methods,
            staticOption: options.static,
            allowOrigins: !options.cors?.origins
                ? ["*"]
                : typeof options.cors.origins !== "string"
                ? options.cors.origins.includes("*") || options.cors.origins.length < 1
                    ? ["*"]
                    : options.cors.origins
                : [options.cors.origins !== "*" ? options.cors.origins : "*"],
            allowMethods: options.cors?.methods || [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
            ],
            allowCredentials: !options.cors?.credentials ? false : true,
            allowHeaders:
                !options.cors?.headers || options.cors.headers.includes("*")
                    ? ["*"]
                    : options.cors.headers
        });

        const inputedConstructorKeys = Reflect.getOwnMetadataKeys(classConstructor);

        if (
            !inputedConstructorKeys.includes(containerKey) &&
            !inputedConstructorKeys.includes(moduleKey)
        ) {
            throw Error(
                `Can not detect! ${classConstructor.name} class is not a container or module.`
            );
        }

        const injector = new Injector();

        const containerMetadata: TContainerMetadata = !inputedConstructorKeys.includes(containerKey)
            ? undefined
            : Reflect.getOwnMetadata(containerKey, classConstructor);

        const modulesConverted = !inputedConstructorKeys.includes(containerKey)
            ? [classConstructor]
            : containerMetadata?.modules || [];

        const resolutedContainer = !containerMetadata
            ? undefined
            : await containerResolution({
                  containerClass: classConstructor,
                  options: options,
                  extendInjector: injector
              });

        const resolutedModules = await Promise.all(
            modulesConverted.map((moduleConverted) =>
                moduleResolution({
                    moduleClass: moduleConverted,
                    options: options,
                    extendInjector: !resolutedContainer ? injector : resolutedContainer.injector
                })
            )
        );

        const availableModuleResolutions = resolutedModules.filter(
            (resolutedModule) => typeof resolutedModule !== "undefined"
        );

        const prefixs = [
            ...new Set(
                availableModuleResolutions.map(
                    (availableModuleResolution) => availableModuleResolution.prefix
                )
            )
        ];

        if (prefixs.length !== availableModuleResolutions.length) {
            throw Error("Module prefix should be unique.");
        }

        const webSocketsMap = new Map<string, TWebSocketEventHandlerMetadata>();

        for (const availableModuleResolution of availableModuleResolutions) {
            const webSocketMap = availableModuleResolution.webSocketRouterGroup.execute();

            for (const [key, metadata] of webSocketMap.entries()) {
                webSocketsMap.set(key, metadata);
            }
        }

        const server = Bun.serve<TWebSocketUpgradeData, {}>({
            port: options.port,
            fetch: async (request, server) => {
                const start = performance.now(),
                    url = new URL(request.url),
                    query = Qs.parse(url.searchParams.toString(), options.queryParser),
                    origin = request.headers.get("origin") || "*",
                    method = request.method.toUpperCase(),
                    responseHeaders = new Headers();

                let context = new Context()
                    .setOptions({ isStatic: true })
                    .set(httpServerArgsKey, server)
                    .set(requestHeaderArgsKey, request.headers)
                    .set(responseHeadersArgsKey, responseHeaders)
                    .set(queryArgsKey, query);

                try {
                    const isUpgradable = isWebSocketUpgrade(request);

                    let collection:
                        | undefined
                        | Required<{
                              route: NonNullable<ReturnType<HttpRouterGroup["find"]>>;
                              resolution: NonNullable<Awaited<ReturnType<typeof moduleResolution>>>;
                          }>;

                    if (isUpgradable) {
                        for (const availableModuleResolution of availableModuleResolutions) {
                            const routeResult =
                                availableModuleResolution.webSocketHttpRouterGroup.find(
                                    url.pathname,
                                    request.method as keyof THttpMethods
                                );

                            if (routeResult) {
                                collection = Object.freeze({
                                    route: routeResult,
                                    resolution: availableModuleResolution
                                });
                                break;
                            }
                        }

                        if (!collection) {
                            return responseConverter(
                                new Response(
                                    JSON.stringify({
                                        httpCode: 404,
                                        message: "Route not found",
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

                        const upgradeResult = await webSocketFetcher(
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
                        return responseConverter(
                            new Response(undefined, {
                                status: 405,
                                statusText: "Method Not Allowed.",
                                headers: responseHeaders
                            })
                        );
                    }

                    if (request.method.toUpperCase() === "OPTIONS") {
                        return responseConverter(
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
                        const { path, headers, cacheTimeInSeconds } = staticOption;
                        const pathname = `${path}/${url.pathname}`;
                        const cachedFile = staticMap.get(pathname);

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

                                return responseConverter(
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
                                staticMap.delete(pathname);
                            }

                            const file = !isExpired ? cachedFile.file : Bun.file(pathname);
                            const isFileExists = await file.exists();

                            if (isFileExists) {
                                staticMap.set(
                                    pathname,
                                    Object.freeze({
                                        expiredAt: TimeAdd(
                                            new Date(),
                                            typeof cacheTimeInSeconds !== "number"
                                                ? DEFAULT_STATIC_CACHE_TIME_IN_SECONDS
                                                : cacheTimeInSeconds,
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

                                return responseConverter(
                                    new Response(await file.arrayBuffer(), {
                                        status: 200,
                                        statusText: "SUCCESS",
                                        headers: responseHeaders
                                    })
                                );
                            }
                        }
                    }

                    if (resolutedContainer) {
                        const { context: newContext } = await httpFetcher({
                            context: context,
                            resolutedMap: {
                                injector: resolutedContainer.injector,
                                startMiddlewareGroup: resolutedContainer.startMiddlewareGroup,
                                guardGroup: resolutedContainer.guardGroup
                            }
                        });

                        context = newContext;
                    }

                    for (const availableModuleResolution of availableModuleResolutions) {
                        const routeResult = availableModuleResolution.controllerRouterGroup.find(
                            url.pathname,
                            method as keyof THttpMethods
                        );

                        if (routeResult) {
                            collection = Object.freeze({
                                route: routeResult,
                                resolution: availableModuleResolution
                            });
                            break;
                        }
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
                                    message: "Route not found",
                                    data: undefined
                                })
                            );
                    } else {
                        const { context: newContext } = await httpFetcher({
                            context: context,
                            route: collection.route,
                            resolutedMap: collection.resolution
                        });

                        context = newContext;
                    }

                    if (resolutedContainer) {
                        const { context: newContext } = await httpFetcher({
                            context: context,
                            resolutedMap: {
                                injector: resolutedContainer.injector,
                                endMiddlewareGroup: resolutedContainer.endMiddlewareGroup
                            }
                        });

                        context = newContext;
                    }

                    context.setOptions({ isStatic: false });

                    const latestResponseHeaders =
                            context.get<Headers | null | undefined>(responseHeadersArgsKey) ||
                            new Headers(),
                        latestResponseBody = context.get<BodyInit>(responseBodyArgsKey) || null,
                        latestResponseStatus = context.get<unknown>(responseStatusArgsKey) || 200,
                        latestResponseStatusText =
                            context.get<unknown>(responseStatusArgsKey) || 200;

                    return responseConverter(
                        new Response(latestResponseBody, {
                            status:
                                typeof latestResponseStatus !== "number"
                                    ? 200
                                    : latestResponseStatus,
                            statusText:
                                typeof latestResponseStatusText !== "string"
                                    ? undefined
                                    : latestResponseStatusText,
                            headers: latestResponseHeaders
                        })
                    );
                } catch (error) {
                    options.debug && console.error(error);

                    return responseConverter(jsonErrorInfer(error, responseHeaders));
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
                close: (connection, code: number, reason: string) => {
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
    } catch (error) {
        options.debug && console.error(error);
        throw error;
    }
};

export default BoolFactory;
