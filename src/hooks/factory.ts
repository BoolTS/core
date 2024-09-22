import type { TArgumentsMetadata, TControllerMetadata, THttpMetadata, TModuleMetadata } from "../decorators";
import type { IContext, IGuard, IMiddleware } from "../interfaces";
import type { IDispatcher } from "../interfaces/dispatcher";

import "colors";
import "reflect-metadata";

import Qs from "qs";
import * as Zod from "zod";

import type { Server } from "bun";
import { Router, RouterGroup } from "../entities";
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
    routeModelArgsKey
} from "../keys";
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
    }>;

export const responseConverter = (response: Response) => {
    response.headers.set("X-Powered-By", "Bool Typescript");

    return response;
};

export const controllerCreator = (
    controllerConstructor: new (...args: any[]) => unknown,
    group: RouterGroup,
    injector: Injector,
    prefix?: string
) => {
    if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(controllerKey)) {
        throw Error(`${controllerConstructor.name} is not a controller.`);
    }

    const controller = injector.get(controllerConstructor);

    if (!controller) {
        throw Error("Can not initialize controller.");
    }

    const controllerMetadata: TControllerMetadata = Reflect.getOwnMetadata(controllerKey, controllerConstructor) || {
        prefix: "/",
        httpMetadata: []
    };
    const routesMetadata = (Reflect.getOwnMetadata(controllerHttpKey, controllerConstructor) || []) as THttpMetadata;
    const router = new Router(`/${prefix || ""}/${controllerMetadata.prefix}`);

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

    return group.add(router);
};

export const argumentsResolution = async (
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

export const moduleResolution = async (module: new (...args: any[]) => unknown, options: TBoolFactoryOptions) => {
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
        prefix: modulePrefix,
        config: moduleConfig
    } = moduleMetadata;

    // Configuration(s)
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

    // Register config like an injection
    injector.set(configKey, config);

    if (loaders) {
        const loaderFunctions = [];

        for (const [key, func] of Object.entries(loaders)) {
            loaderFunctions.push(async () => {
                try {
                    const result = await func({ config });
                    console.info(`INFO! Loader [${key}] initialized successfully.`);
                    return result;
                } catch (error) {
                    console.error(`WARNING! Loader [${key}] initialization failed.`);
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

    // Dependencies
    !dependencies || dependencies.map((dependency) => injector.get(dependency));

    // Middleware(s)
    const startMiddlewareGroup: Array<TGroupElementModel<"start", IMiddleware, NonNullable<IMiddleware["start"]>>> = [];
    const endMiddlewareGroup: Array<TGroupElementModel<"end", IMiddleware, NonNullable<IMiddleware["end"]>>> = [];

    if (middlewares) {
        for (let i = 0; i < middlewares.length; i++) {
            const instance = injector.get<IMiddleware>(middlewares[i]);

            if (instance.start && typeof instance.start === "function") {
                startMiddlewareGroup.push(
                    Object.freeze({
                        class: middlewares[i] as IMiddleware,
                        funcName: "start",
                        func: instance.start.bind(instance)
                    })
                );
            }

            if (instance.end && typeof instance.end === "function") {
                endMiddlewareGroup.push(
                    Object.freeze({
                        class: middlewares[i] as IMiddleware,
                        funcName: "end",
                        func: instance.end.bind(instance)
                    })
                );
            }
        }
    }

    // Guard(s)
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

    // Before dispatcher(s)
    const openDispatcherGroup: Array<TGroupElementModel<"open", IDispatcher, NonNullable<IDispatcher["open"]>>> = [];
    const closeDispatcherGroup: Array<TGroupElementModel<"close", IDispatcher, NonNullable<IDispatcher["close"]>>> = [];

    if (dispatchers) {
        for (let i = 0; i < dispatchers.length; i++) {
            const instance = injector.get<IDispatcher>(dispatchers[i]);

            if (instance.open && typeof instance.open === "function") {
                openDispatcherGroup.push(
                    Object.freeze({
                        class: dispatchers[i] as IDispatcher,
                        funcName: "open",
                        func: instance.open.bind(instance)
                    })
                );
            }

            if (instance.close && typeof instance.close === "function") {
                closeDispatcherGroup.push(
                    Object.freeze({
                        class: dispatchers[i] as IDispatcher,
                        funcName: "close",
                        func: instance.close.bind(instance)
                    })
                );
            }
        }
    }

    // Controller(s)
    const routerGroup = new RouterGroup();

    controllers &&
        controllers.map((controllerConstructor) =>
            controllerCreator(controllerConstructor, routerGroup, injector, `${options.prefix || ""}/${modulePrefix || ""}`)
        );

    return Object.freeze({
        prefix: moduleMetadata.prefix,
        injector: injector,
        startMiddlewareGroup,
        endMiddlewareGroup,
        guardGroup,
        openDispatcherGroup,
        closeDispatcherGroup,
        routerGroup
    });
};

const fetcher = async (
    bun: Required<{
        request: Request;
        server: Server;
    }>,
    bool: Required<{
        query: Record<string, unknown>;
        route: NonNullable<ReturnType<RouterGroup["find"]>>;
        moduleResolution: NonNullable<Awaited<ReturnType<typeof moduleResolution>>>;
    }>,
    options: TBoolFactoryOptions
) => {
    const {
        query,
        route: { parameters, model },
        moduleResolution: { startMiddlewareGroup, endMiddlewareGroup, guardGroup, openDispatcherGroup, closeDispatcherGroup }
    } = bool;
    const { request, server: _server } = bun;

    const context: Record<symbol, any> = {
        [requestHeadersArgsKey]: request.headers,
        [responseHeadersArgsKey]: new Headers(),
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
                        args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
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
                    case routeModelArgsKey:
                        break;
                    default:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? !(argsMetadata.type in context)
                                ? undefined
                                : context[argsMetadata.type]
                            : await argumentsResolution(
                                  !(argsMetadata.type in context) ? undefined : context[argsMetadata.type],
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
                        args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
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
                    case routeModelArgsKey:
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
                        args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
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
        Reflect.getOwnMetadata(argumentsKey, controllerActionCollection.class, controllerActionCollection.funcName) || {};

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

    context[responseBodyArgsKey] = await controllerActionCollection.func(...controllerActionArguments);

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
                        args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
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
                        args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
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
                    case routeModelArgsKey:
                        break;
                    default:
                        args[argsMetadata.index] = !argsMetadata.zodSchema
                            ? !(argsMetadata.type in context)
                                ? undefined
                                : context[argsMetadata.type]
                            : await argumentsResolution(
                                  !(argsMetadata.type in context) ? undefined : context[argsMetadata.type],
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

    if (context[responseBodyArgsKey] instanceof Response) {
        return responseConverter(context[responseBodyArgsKey]);
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
    modules: new (...args: any[]) => unknown | Array<new (...args: any[]) => unknown>,
    options: TBoolFactoryOptions
) => {
    try {
        const modulesConverted = !Array.isArray(modules) ? [modules] : modules;
        const { allowLogsMethods } = Object.freeze({
            allowLogsMethods: options?.log?.methods
        });

        const moduleResolutions = await Promise.all(
            modulesConverted.map((moduleConverted) => moduleResolution(moduleConverted, options))
        );

        const availableModuleResolutions = moduleResolutions.filter(
            (moduleResolution) => typeof moduleResolution !== "undefined"
        );

        const prefixs = [
            ...new Set(availableModuleResolutions.map((availableModuleResolution) => availableModuleResolution.prefix))
        ];

        if (prefixs.length !== availableModuleResolutions.length) {
            throw Error(`Module prefix should be unique.`);
        }

        Bun.serve({
            port: options.port,
            fetch: async (request, server) => {
                const start = performance.now();
                const url = new URL(request.url);
                const query = Qs.parse(url.searchParams.toString(), options.queryParser);

                try {
                    let collection:
                        | undefined
                        | Required<{
                              route: NonNullable<ReturnType<RouterGroup["find"]>>;
                              resolution: NonNullable<Awaited<ReturnType<typeof moduleResolution>>>;
                          }>;

                    for (let i = 0; i < availableModuleResolutions.length; i++) {
                        const routeResult = availableModuleResolutions[i].routerGroup.find(
                            url.pathname,
                            request.method as keyof THttpMethods
                        );

                        if (routeResult) {
                            collection = Object.freeze({
                                route: routeResult,
                                resolution: availableModuleResolutions[i]
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
                                })
                            )
                        );
                    }

                    return await fetcher(
                        {
                            request,
                            server
                        },
                        {
                            query: query,
                            route: collection.route,
                            moduleResolution: collection.resolution
                        },
                        options
                    );
                } catch (error) {
                    options.debug && console.error(error);

                    return responseConverter(jsonErrorInfer(error));
                } finally {
                    if (allowLogsMethods) {
                        const end = performance.now();
                        const convertedPID = `${process.pid}`.yellow;
                        const convertedMethod = `${request.method.yellow}`.bgBlue;
                        const convertedReqIp = `${
                            request.headers.get("x-forwarded-for") ||
                            request.headers.get("x-real-ip") ||
                            server.requestIP(request)?.address ||
                            "<Unknown>"
                        }`.yellow;
                        const convertedTime = `${Math.round((end - start + Number.EPSILON) * 10 ** 2) / 10 ** 2}ms`.yellow;

                        allowLogsMethods.includes(request.method.toUpperCase() as (typeof allowLogsMethods)[number]) &&
                            console.info(
                                `PID: ${convertedPID} - Method: ${convertedMethod} - IP: ${convertedReqIp} - ${
                                    new URL(request.url).pathname.blue
                                } - Time: ${convertedTime}`
                            );
                    }
                }
            }
        });
    } catch (error) {
        options.debug && console.error(error);
        throw error;
    }
};

export default BoolFactory;
