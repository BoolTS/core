import type {
    TArgumentsMetadata,
    TControllerMetadata,
    THttpMetadata,
    TModuleMetadata,
    TWebSocketEventHandlerMetadata,
    TWebSocketMetadata
} from "../decorators";
import type { TWebSocketUpgradeData } from "../decorators/webSocket";
import type { IContext, IGuard, IMiddleware } from "../interfaces";
import type { IDispatcher } from "../interfaces/dispatcher";

import "reflect-metadata";

import Qs from "qs";
import * as Zod from "zod";

import { ETimeUnit, add as TimeAdd } from "@bool-ts/date-time";
import type { BunFile, Server } from "bun";
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
    contextArgsKey,
    controllerHttpKey,
    controllerKey,
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
    routeModelArgsKey,
    webSocketCloseCodeArgsKey,
    webSocketCloseReasonArgsKey,
    webSocketConnectionArgsKey,
    webSocketKey,
    webSocketMessageArgsKey,
    webSocketServerArgsKey
} from "../keys";
import { ansiText, isWebSocketUpgrade } from "../ultils";
import { Injector } from "./injector";

export type TGroupElementModel<
    TFuncName extends keyof TClass,
    TClass extends Object = Object,
    TFunc = TClass[TFuncName]
> = Readonly<{
    class: TClass;
    func: TFunc;
    funcName: TFuncName;
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
                headers: Record<string, string>;
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
    const routesMetadata = (Reflect.getOwnMetadata(controllerHttpKey, controllerConstructor) ||
        []) as THttpMetadata;
    const router = new HttpRouter(`/${prefix || ""}/${controllerMetadata.prefix}`);

    routesMetadata.forEach((routeMetadata) => {
        if (typeof routeMetadata.descriptor.value !== "function") {
            return;
        }

        const route = router.route(routeMetadata.path);
        const handler = routeMetadata.descriptor.value.bind(controller);
        const routeArgument = Object.freeze({
            class: controllerConstructor,
            funcName: routeMetadata.methodName,
            func: handler
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
        throw Error(`${webSocketConstructor.name} is not a controller.`);
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
            func: handler
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

const moduleResolution = async (
    module: new (...args: any[]) => unknown,
    options: TBoolFactoryOptions
) => {
    if (!Reflect.getOwnMetadataKeys(module).includes(moduleKey)) {
        throw Error(`${module.name} is not a module.`);
    }

    const injector = new Injector();
    const moduleMetadata = Reflect.getOwnMetadata(moduleKey, module) as TModuleMetadata;

    if (!moduleMetadata) {
        return;
    }

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
    } = moduleMetadata;

    const fullPrefix = `${options.prefix || ""}/${modulePrefix || ""}`;

    //#region [Configuration(s)]
    const { config } = Object.freeze({
        config: {
            ...(typeof options.config !== "function" ? options.config : await options.config()),
            ...(typeof moduleConfig !== "function"
                ? typeof moduleConfig !== "object"
                    ? undefined
                    : moduleConfig
                : await moduleConfig())
        }
    });
    //#endregion

    //#region [Register config like an injection]
    injector.set(configKey, config);
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

    middlewares &&
        middlewares.forEach((middleware) => {
            const instance = injector.get<IMiddleware>(middleware);

            if (instance.start && typeof instance.start === "function") {
                startMiddlewareGroup.push(
                    Object.freeze({
                        class: middleware as IMiddleware,
                        funcName: "start",
                        func: instance.start.bind(instance)
                    })
                );
            }

            if (instance.end && typeof instance.end === "function") {
                endMiddlewareGroup.push(
                    Object.freeze({
                        class: middleware as IMiddleware,
                        funcName: "end",
                        func: instance.end.bind(instance)
                    })
                );
            }
        });
    //#endregion

    //#region [Guard(s)]
    const guardGroup = !guards
        ? []
        : guards.map((guard) => {
              const guardInstance = injector.get<IGuard>(guard);

              return Object.freeze({
                  class: guard,
                  funcName: "enforce",
                  func: guardInstance.enforce.bind(guardInstance)
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

    dispatchers &&
        dispatchers.forEach((dispatcher) => {
            const instance = injector.get<IDispatcher>(dispatcher);

            if (instance.open && typeof instance.open === "function") {
                openDispatcherGroup.push(
                    Object.freeze({
                        class: dispatcher as IDispatcher,
                        funcName: "open",
                        func: instance.open.bind(instance)
                    })
                );
            }

            if (instance.close && typeof instance.close === "function") {
                closeDispatcherGroup.push(
                    Object.freeze({
                        class: dispatcher as IDispatcher,
                        funcName: "close",
                        func: instance.close.bind(instance)
                    })
                );
            }
        });
    //#endregion

    //#region [Controller(s)]
    const controllerRouterGroup = new HttpRouterGroup();

    controllers &&
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
                injector,
                prefix: fullPrefix
            })
        );
    //#endregion

    return Object.freeze({
        prefix: moduleMetadata.prefix,
        injector: injector,
        startMiddlewareGroup,
        endMiddlewareGroup,
        guardGroup,
        openDispatcherGroup,
        closeDispatcherGroup,
        controllerRouterGroup,
        webSocketHttpRouterGroup,
        webSocketRouterGroup
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
    const { request, server: _server } = bun;
    const {
        query,
        responseHeaders,
        route: { parameters, model },
        moduleResolution: {
            startMiddlewareGroup,
            endMiddlewareGroup,
            guardGroup,
            openDispatcherGroup,
            closeDispatcherGroup
        }
    } = bool;

    const context: Record<symbol, any> = {
        [requestHeadersArgsKey]: request.headers,
        [responseHeadersArgsKey]: responseHeaders,
        [queryArgsKey]: query,
        [paramsArgsKey]: parameters,
        [routeModelArgsKey]: model
    };

    const contextHook = {
        get(key) {
            return context[key];
        },
        set(key, value) {
            if (key in context) {
                throw Error(`${String(key)} already exists in context.`);
            }

            context[key] = value;
        }
    } satisfies IContext;

    // Execute start middleware(s)
    for (let i = 0; i < startMiddlewareGroup.length; i++) {
        const args = [];
        const collection = startMiddlewareGroup[i];
        const metadata: Record<string, TArgumentsMetadata> =
            Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};

        if (metadata) {
            for (const [_key, argsMetadata] of Object.entries(metadata)) {
                switch (argsMetadata.type) {
                    case requestArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request
                            : await argumentsResolution(
                                  request,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case requestBodyArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? await request[argsMetadata.parser || "json"]()
                            : await argumentsResolution(
                                  await request[argsMetadata.parser || "json"](),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case contextArgsKey:
                        args[argsMetadata.index] = !argsMetadata.key
                            ? contextHook
                            : contextHook.get(argsMetadata.key);
                        break;
                    case requestHeadersArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers
                            : await argumentsResolution(
                                  request.headers.toJSON(),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case responseHeadersArgsKey:
                        args[argsMetadata.index] = context[argsMetadata.type];
                        break;
                    case requestHeaderArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers.get(argsMetadata.key) || undefined
                            : await argumentsResolution(
                                  request.headers.get(argsMetadata.key) || undefined,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case paramArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[paramsArgsKey][argsMetadata.key] || undefined
                            : await argumentsResolution(
                                  context[paramsArgsKey][argsMetadata.key],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case routeModelArgsKey:
                        args[argsMetadata.index] = context[routeModelArgsKey];
                        break;
                    default:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? !(argsMetadata.type in context)
                                ? undefined
                                : context[argsMetadata.type]
                            : await argumentsResolution(
                                  !(argsMetadata.type in context)
                                      ? undefined
                                      : context[argsMetadata.type],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                }
            }
        }

        context[responseBodyArgsKey] = await collection.func(...args);

        if (context[responseBodyArgsKey] instanceof Response) {
            return responseConverter(context[responseBodyArgsKey]);
        }
    }

    // Execute guard(s)
    for (let i = 0; i < guardGroup.length; i++) {
        const args = [];
        const collection = guardGroup[i];
        const metadata: Record<string, TArgumentsMetadata> =
            Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};

        if (metadata) {
            for (const [_key, argsMetadata] of Object.entries(metadata)) {
                switch (argsMetadata.type) {
                    case requestArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request
                            : await argumentsResolution(
                                  request,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case requestBodyArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? await request[argsMetadata.parser || "json"]()
                            : await argumentsResolution(
                                  await request[argsMetadata.parser || "json"](),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case contextArgsKey:
                        args[argsMetadata.index] = !argsMetadata.key
                            ? contextHook
                            : contextHook.get(argsMetadata.key);
                        break;
                    case requestHeadersArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers
                            : await argumentsResolution(
                                  request.headers.toJSON(),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case responseHeadersArgsKey:
                        args[argsMetadata.index] = context[argsMetadata.type];
                        break;
                    case requestHeaderArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers.get(argsMetadata.key) || undefined
                            : await argumentsResolution(
                                  request.headers.get(argsMetadata.key) || undefined,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case paramArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[paramsArgsKey][argsMetadata.key] || undefined
                            : await argumentsResolution(
                                  context[paramsArgsKey][argsMetadata.key],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case routeModelArgsKey:
                        args[argsMetadata.index] = context[routeModelArgsKey];
                        break;
                    default:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[argsMetadata.type]
                            : await argumentsResolution(
                                  context[argsMetadata.type],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                }
            }
        }

        const guardResult = await collection.func(...args);

        if (typeof guardResult !== "boolean" || !guardResult) {
            throw new HttpClientError({
                httpCode: 401,
                message: "Unauthorization.",
                data: undefined
            });
        }
    }

    // Execute open dispatcher(s)
    for (let i = 0; i < openDispatcherGroup.length; i++) {
        const args = [];
        const collection = openDispatcherGroup[i];
        const metadata: Record<string, TArgumentsMetadata> =
            Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};

        if (metadata) {
            for (const [_key, argsMetadata] of Object.entries(metadata)) {
                switch (argsMetadata.type) {
                    case requestArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request
                            : await argumentsResolution(
                                  request,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case requestBodyArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? await request[argsMetadata.parser || "json"]()
                            : await argumentsResolution(
                                  await request[argsMetadata.parser || "json"](),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case contextArgsKey:
                        args[argsMetadata.index] = !argsMetadata.key
                            ? contextHook
                            : contextHook.get(argsMetadata.key);
                        break;
                    case requestHeadersArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers
                            : await argumentsResolution(
                                  request.headers.toJSON(),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case responseHeadersArgsKey:
                        args[argsMetadata.index] = context[argsMetadata.type];
                        break;
                    case requestHeaderArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers.get(argsMetadata.key) || undefined
                            : await argumentsResolution(
                                  request.headers.get(argsMetadata.key) || undefined,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case paramArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[paramsArgsKey][argsMetadata.key] || undefined
                            : await argumentsResolution(
                                  context[paramsArgsKey][argsMetadata.key],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case routeModelArgsKey:
                        args[argsMetadata.index] = context[routeModelArgsKey];
                        break;
                    default:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[argsMetadata.type]
                            : await argumentsResolution(
                                  context[argsMetadata.type],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                }
            }
        }

        context[responseBodyArgsKey] = await collection.func(...args);
    }

    // Execute controller action
    const controllerActionArguments: any[] = [];
    const controllerActionCollection = model;
    const controllerActionMetadata: Record<string, TArgumentsMetadata> =
        Reflect.getOwnMetadata(
            argumentsKey,
            controllerActionCollection.class,
            controllerActionCollection.funcName
        ) || {};

    if (controllerActionMetadata) {
        for (const [_key, argsMetadata] of Object.entries(controllerActionMetadata)) {
            switch (argsMetadata.type) {
                case requestArgsKey:
                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                        ? request
                        : await argumentsResolution(
                              request,
                              argsMetadata.zodSchema,
                              argsMetadata.index,
                              controllerActionCollection.funcName
                          );
                    break;
                case requestBodyArgsKey:
                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                        ? await request[argsMetadata.parser || "json"]()
                        : await argumentsResolution(
                              await request[argsMetadata.parser || "json"](),
                              argsMetadata.zodSchema,
                              argsMetadata.index,
                              controllerActionCollection.funcName
                          );
                    break;
                case contextArgsKey:
                    controllerActionArguments[argsMetadata.index] = !argsMetadata.key
                        ? contextHook
                        : contextHook.get(argsMetadata.key);
                    break;
                case requestHeadersArgsKey:
                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                        ? request.headers
                        : await argumentsResolution(
                              request.headers.toJSON(),
                              argsMetadata.zodSchema,
                              argsMetadata.index,
                              controllerActionCollection.funcName
                          );
                    break;
                case responseHeadersArgsKey:
                    controllerActionArguments[argsMetadata.index] = context[argsMetadata.type];
                    break;
                case requestHeaderArgsKey:
                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                        ? request.headers.get(argsMetadata.key) || undefined
                        : await argumentsResolution(
                              request.headers.get(argsMetadata.key) || undefined,
                              argsMetadata.zodSchema,
                              argsMetadata.index,
                              controllerActionCollection.funcName
                          );
                    break;
                case paramArgsKey:
                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                        ? context[paramsArgsKey][argsMetadata.key] || undefined
                        : await argumentsResolution(
                              context[paramsArgsKey][argsMetadata.key],
                              argsMetadata.zodSchema,
                              argsMetadata.index,
                              controllerActionCollection.funcName
                          );
                    break;
                case routeModelArgsKey:
                    controllerActionArguments[argsMetadata.index] = context[routeModelArgsKey];
                    break;
                default:
                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                        ? context[argsMetadata.type]
                        : await argumentsResolution(
                              context[argsMetadata.type],
                              argsMetadata.zodSchema,
                              argsMetadata.index,
                              controllerActionCollection.funcName
                          );
                    break;
            }
        }
    }

    context[responseBodyArgsKey] = await controllerActionCollection.func(
        ...controllerActionArguments
    );

    // Execute close dispatcher(s)
    for (let i = 0; i < closeDispatcherGroup.length; i++) {
        const args = [];
        const collection = closeDispatcherGroup[i];
        const metadata: Record<string, TArgumentsMetadata> =
            Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};

        if (metadata) {
            for (const [_key, argsMetadata] of Object.entries(metadata)) {
                switch (argsMetadata.type) {
                    case requestArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request
                            : await argumentsResolution(
                                  request,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case requestBodyArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? await request[argsMetadata.parser || "json"]()
                            : await argumentsResolution(
                                  await request[argsMetadata.parser || "json"](),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case contextArgsKey:
                        args[argsMetadata.index] = !argsMetadata.key
                            ? contextHook
                            : contextHook.get(argsMetadata.key);
                        break;
                    case requestHeadersArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers
                            : await argumentsResolution(
                                  request.headers.toJSON(),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case responseHeadersArgsKey:
                        args[argsMetadata.index] = context[argsMetadata.type];
                        break;
                    case requestHeaderArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers.get(argsMetadata.key) || undefined
                            : await argumentsResolution(
                                  request.headers.get(argsMetadata.key) || undefined,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case paramArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[paramsArgsKey][argsMetadata.key] || undefined
                            : await argumentsResolution(
                                  context[paramsArgsKey][argsMetadata.key],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case routeModelArgsKey:
                        args[argsMetadata.index] = context[routeModelArgsKey];
                        break;
                    default:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[argsMetadata.type]
                            : await argumentsResolution(
                                  context[argsMetadata.type],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                }
            }
        }

        await collection.func(...args);
    }

    if (context[responseBodyArgsKey] instanceof Response) {
        return responseConverter(context[responseBodyArgsKey]);
    }

    // Execute end middleware(s)
    for (let i = 0; i < endMiddlewareGroup.length; i++) {
        const args = [];
        const collection = endMiddlewareGroup[i];
        const metadata: Record<string, TArgumentsMetadata> =
            Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};

        if (metadata) {
            for (const [_key, argsMetadata] of Object.entries(metadata)) {
                switch (argsMetadata.type) {
                    case requestArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request
                            : await argumentsResolution(
                                  request,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case requestBodyArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? await request[argsMetadata.parser || "json"]()
                            : await argumentsResolution(
                                  await request[argsMetadata.parser || "json"](),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case contextArgsKey:
                        args[argsMetadata.index] = !argsMetadata.key
                            ? contextHook
                            : contextHook.get(argsMetadata.key);
                        break;
                    case requestHeadersArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers
                            : await argumentsResolution(
                                  request.headers.toJSON(),
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case responseHeadersArgsKey:
                        args[argsMetadata.index] = context[argsMetadata.type];
                        break;
                    case requestHeaderArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? request.headers.get(argsMetadata.key) || undefined
                            : await argumentsResolution(
                                  request.headers.get(argsMetadata.key) || undefined,
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case paramArgsKey:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? context[paramsArgsKey][argsMetadata.key] || undefined
                            : await argumentsResolution(
                                  context[paramsArgsKey][argsMetadata.key],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                    case routeModelArgsKey:
                        args[argsMetadata.index] = context[routeModelArgsKey];
                        break;
                    default:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? !(argsMetadata.type in context)
                                ? undefined
                                : context[argsMetadata.type]
                            : await argumentsResolution(
                                  !(argsMetadata.type in context)
                                      ? undefined
                                      : context[argsMetadata.type],
                                  argsMetadata.zodSchema,
                                  argsMetadata.index,
                                  collection.funcName
                              );
                        break;
                }
            }
        }

        context[responseBodyArgsKey] = await collection.func(...args);

        if (context[responseBodyArgsKey] instanceof Response) {
            return responseConverter(context[responseBodyArgsKey]);
        }
    }

    return responseConverter(
        new Response(
            !context[responseBodyArgsKey]
                ? undefined
                : JSON.stringify({
                      httpCode: 200,
                      message: "SUCCESS",
                      data: context[responseBodyArgsKey]
                  }),
            {
                status: !context[responseBodyArgsKey] ? 204 : 200,
                statusText: "SUCCESS",
                headers: context[responseHeadersArgsKey]
            }
        )
    );
};

export const BoolFactory = async (
    modules: Object | Array<Object>,
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

        const modulesConverted = !Array.isArray(modules) ? [modules] : modules;

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

        const moduleResolutions = await Promise.all(
            modulesConverted.map((moduleConverted) => moduleResolution(moduleConverted, options))
        );

        const availableModuleResolutions = moduleResolutions.filter(
            (moduleResolution) => typeof moduleResolution !== "undefined"
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

        const server = Bun.serve<TWebSocketUpgradeData>({
            port: options.port,
            fetch: async (request, server) => {
                const start = performance.now();
                const url = new URL(request.url);
                const query = Qs.parse(url.searchParams.toString(), options.queryParser);
                const origin = request.headers.get("origin") || "*";
                const method = request.method.toUpperCase();
                const responseHeaders = new Headers();

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

                    allowCredentials &&
                        responseHeaders.set("Access-Control-Allow-Credentials", "true");

                    responseHeaders.set("Access-Control-Allow-Methods", allowMethods.join(", "));
                    responseHeaders.set("Access-Control-Allow-Headers", allowHeaders.join(", "));
                    responseHeaders.set(
                        "Access-Control-Allow-Origin",
                        allowOrigins.includes("*")
                            ? "*"
                            : !allowOrigins.includes(origin)
                            ? allowOrigins[0]
                            : origin
                    );

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

                    for (const availableModuleResolution of availableModuleResolutions) {
                        const routeResult = availableModuleResolution.controllerRouterGroup.find(
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

                    return await httpFetcher(
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
