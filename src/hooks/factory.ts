import type { TArgumentsMetadata, TControllerMetadata, THttpMetadata, TModuleMetadata } from "../decorators";
import type { IContext, IGuard, IMiddleware } from "../interfaces";
import type { IDispatcher } from "../interfaces/dispatcher";

import "colors";
import "reflect-metadata";

import Qs from "qs";
import * as Zod from "zod";

import { Router, RouterGroup } from "../entities";
import { HttpClientError, HttpServerError, jsonErrorInfer, type THttpMethods } from "../http";
import {
    argumentsKey,
    bodyArgsKey,
    configKey,
    contextArgsKey,
    controllerHttpKey,
    controllerKey,
    moduleKey,
    paramArgsKey,
    paramsArgsKey,
    queryArgsKey,
    requestArgsKey,
    requestHeaderArgsKey,
    requestHeadersArgsKey,
    responseHeadersArgsKey,
    routeModelArgsKey
} from "../keys";
import { Injector } from "./injector";

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

export const controllerCreator = (
    controllerConstructor: new (...args: any[]) => unknown,
    group: RouterGroup,
    prefix?: string
) => {
    if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(controllerKey)) {
        throw Error(`${controllerConstructor.name} is not a controller.`);
    }

    const controller = Injector.get(controllerConstructor);

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

export const BoolFactory = async (target: new (...args: any[]) => unknown, options: TBoolFactoryOptions) => {
    try {
        if (!Reflect.getOwnMetadataKeys(target).includes(moduleKey)) {
            throw Error(`${target.name} is not a module.`);
        }

        const moduleMetadata = Reflect.getOwnMetadata(moduleKey, target) as TModuleMetadata;

        if (!moduleMetadata) {
            return Bun.serve({
                port: options.port,
                fetch: () => new Response()
            });
        }

        const {
            loaders,
            middlewares,
            guards,
            beforeDispatchers,
            controllers,
            afterDispatchers,
            dependencies,
            prefix: modulePrefix,
            config: moduleConfig
        } = moduleMetadata;

        // Configuration(s)
        const { allowLogsMethods, config } = Object.freeze({
            allowLogsMethods: options?.log?.methods,
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
        Injector.set(configKey, config);

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
                Injector.set(key, value);
            }
        }

        // Dependencies
        !dependencies || dependencies.map((dependency) => Injector.get(dependency));

        // Middleware(s)
        const middlewareGroup = !middlewares
            ? []
            : middlewares.map((middleware) => {
                  const middlewareInstance = Injector.get<IMiddleware>(middleware);

                  return Object.freeze({
                      class: middleware,
                      funcName: "enforce",
                      func: middlewareInstance.enforce.bind(middlewareInstance)
                  });
              });

        // Guard(s)
        const guardGroup = !guards
            ? []
            : guards.map((guard) => {
                  const guardInstance = Injector.get<IGuard>(guard);

                  return Object.freeze({
                      class: guard,
                      funcName: "enforce",
                      func: guardInstance.enforce.bind(guardInstance)
                  });
              });

        // Before dispatcher(s)
        const beforeDispatcherGroup = !beforeDispatchers
            ? []
            : beforeDispatchers.map((beforeDispatcher) => {
                  const beforeDispatcherInstance = Injector.get<IDispatcher>(beforeDispatcher);

                  return Object.freeze({
                      class: beforeDispatcher,
                      funcName: "execute",
                      func: beforeDispatcherInstance.execute.bind(beforeDispatcherInstance)
                  });
              });

        // Controller(s)
        const routerGroup = new RouterGroup();

        controllers &&
            controllers.map((controllerConstructor) =>
                controllerCreator(controllerConstructor, routerGroup, `${options.prefix || ""}/${modulePrefix || ""}`)
            );

        // After dispatcher(s)
        const afterDispatcherGroup = !afterDispatchers
            ? []
            : afterDispatchers.map((afterDispatcher) => {
                  const afterDispatcherInstance = Injector.get<IDispatcher>(afterDispatcher);

                  return Object.freeze({
                      class: afterDispatcher,
                      funcName: "execute",
                      func: afterDispatcherInstance.execute.bind(afterDispatcherInstance)
                  });
              });

        Bun.serve({
            port: options.port,
            fetch: async (request, server) => {
                const { headers } = request;
                const start = performance.now();
                const url = new URL(request.url);

                const context: Record<symbol, any> = {
                    [requestHeadersArgsKey]: headers,
                    [responseHeadersArgsKey]: new Headers(),
                    [queryArgsKey]: Qs.parse(url.searchParams.toString(), options.queryParser)
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

                try {
                    // Execute middleware(s)
                    for (let i = 0; i < middlewareGroup.length; i++) {
                        const middlewareArguments = [];
                        const middlewareCollection = middlewareGroup[i];
                        const middlewareMetadata: Record<string, TArgumentsMetadata> =
                            Reflect.getOwnMetadata(argumentsKey, middlewareCollection.class, middlewareCollection.funcName) ||
                            {};

                        if (middlewareMetadata) {
                            for (const [_key, argsMetadata] of Object.entries(middlewareMetadata)) {
                                switch (argsMetadata.type) {
                                    case requestArgsKey:
                                        middlewareArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? request
                                            : await argumentsResolution(
                                                  request,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  middlewareCollection.funcName
                                              );
                                        break;
                                    case bodyArgsKey:
                                        middlewareArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? await request[argsMetadata.parser || "json"]()
                                            : await argumentsResolution(
                                                  await request[argsMetadata.parser || "json"](),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  middlewareCollection.funcName
                                              );
                                        break;
                                    case contextArgsKey:
                                        middlewareArguments[argsMetadata.index] = !argsMetadata.key
                                            ? contextHook
                                            : contextHook.get(argsMetadata.key);
                                        break;
                                    case requestHeadersArgsKey:
                                        middlewareArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers
                                            : await argumentsResolution(
                                                  headers.toJSON(),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  middlewareCollection.funcName
                                              );
                                        break;
                                    case responseHeadersArgsKey:
                                        middlewareArguments[argsMetadata.index] = context[argsMetadata.type];
                                        break;
                                    case requestHeaderArgsKey:
                                        middlewareArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers.get(argsMetadata.key) || undefined
                                            : await argumentsResolution(
                                                  headers.get(argsMetadata.key) || undefined,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  middlewareCollection.funcName
                                              );
                                        break;
                                    case routeModelArgsKey:
                                        break;
                                    default:
                                        middlewareArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? !(argsMetadata.type in context)
                                                ? undefined
                                                : context[argsMetadata.type]
                                            : await argumentsResolution(
                                                  !(argsMetadata.type in context) ? undefined : context[argsMetadata.type],
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  middlewareCollection.funcName
                                              );
                                        break;
                                }
                            }
                        }

                        const middlewareResult = await middlewareCollection.func(...middlewareArguments);

                        if (!(middlewareResult instanceof Response)) {
                            continue;
                        }

                        return middlewareResult;
                    }

                    // Execute guard(s)
                    for (let i = 0; i < guardGroup.length; i++) {
                        const guardArguments = [];
                        const guardCollection = guardGroup[i];
                        const guardMetadata: Record<string, TArgumentsMetadata> =
                            Reflect.getOwnMetadata(argumentsKey, guardCollection.class, guardCollection.funcName) || {};

                        if (guardMetadata) {
                            for (const [_key, argsMetadata] of Object.entries(guardMetadata)) {
                                switch (argsMetadata.type) {
                                    case requestArgsKey:
                                        guardArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? request
                                            : await argumentsResolution(
                                                  request,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  guardCollection.funcName
                                              );
                                        break;
                                    case bodyArgsKey:
                                        guardArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? await request[argsMetadata.parser || "json"]()
                                            : await argumentsResolution(
                                                  await request[argsMetadata.parser || "json"](),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  guardCollection.funcName
                                              );
                                        break;
                                    case contextArgsKey:
                                        guardArguments[argsMetadata.index] = !argsMetadata.key
                                            ? contextHook
                                            : contextHook.get(argsMetadata.key);
                                        break;
                                    case requestHeadersArgsKey:
                                        guardArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers
                                            : await argumentsResolution(
                                                  headers.toJSON(),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  guardCollection.funcName
                                              );
                                        break;
                                    case responseHeadersArgsKey:
                                        guardArguments[argsMetadata.index] = context[argsMetadata.type];
                                        break;
                                    case requestHeaderArgsKey:
                                        guardArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers.get(argsMetadata.key) || undefined
                                            : await argumentsResolution(
                                                  headers.get(argsMetadata.key) || undefined,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  guardCollection.funcName
                                              );
                                        break;
                                    case routeModelArgsKey:
                                        break;
                                    default:
                                        guardArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? context[argsMetadata.type]
                                            : await argumentsResolution(
                                                  context[argsMetadata.type],
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  guardCollection.funcName
                                              );
                                        break;
                                }
                            }
                        }

                        const guardResult = await guardCollection.func(...guardArguments);

                        if (typeof guardResult !== "boolean" || !guardResult) {
                            throw new HttpClientError({
                                httpCode: 401,
                                message: "Unauthorization.",
                                data: undefined
                            });
                        }
                    }

                    const result = routerGroup.find(url.pathname, request.method as keyof THttpMethods);

                    if (!result) {
                        throw new HttpClientError({
                            httpCode: 404,
                            message: "Route not found.",
                            data: undefined
                        });
                    }

                    context[paramsArgsKey] = result.parameters;
                    context[routeModelArgsKey] = result.model;

                    let responseBody = undefined;

                    // Execute before dispatcher(s)
                    for (let i = 0; i < beforeDispatcherGroup.length; i++) {
                        const beforeDispatcherArguments = [];
                        const beforeDispatcherCollection = beforeDispatcherGroup[i];
                        const beforeDispatcherMetadata: Record<string, TArgumentsMetadata> =
                            Reflect.getOwnMetadata(
                                argumentsKey,
                                beforeDispatcherCollection.class,
                                beforeDispatcherCollection.funcName
                            ) || {};

                        if (beforeDispatcherMetadata) {
                            for (const [_key, argsMetadata] of Object.entries(beforeDispatcherMetadata)) {
                                switch (argsMetadata.type) {
                                    case requestArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? request
                                            : await argumentsResolution(
                                                  request,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  beforeDispatcherCollection.funcName
                                              );
                                        break;
                                    case bodyArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? await request[argsMetadata.parser || "json"]()
                                            : await argumentsResolution(
                                                  await request[argsMetadata.parser || "json"](),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  beforeDispatcherCollection.funcName
                                              );
                                        break;
                                    case contextArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.key
                                            ? contextHook
                                            : contextHook.get(argsMetadata.key);
                                        break;
                                    case requestHeadersArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers
                                            : await argumentsResolution(
                                                  headers.toJSON(),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  beforeDispatcherCollection.funcName
                                              );
                                        break;
                                    case responseHeadersArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = context[argsMetadata.type];
                                        break;
                                    case requestHeaderArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers.get(argsMetadata.key) || undefined
                                            : await argumentsResolution(
                                                  headers.get(argsMetadata.key) || undefined,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  beforeDispatcherCollection.funcName
                                              );
                                        break;
                                    case paramArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? context[paramArgsKey][argsMetadata.key] || undefined
                                            : await argumentsResolution(
                                                  context[paramArgsKey][argsMetadata.key],
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  beforeDispatcherCollection.funcName
                                              );
                                        break;
                                    case routeModelArgsKey:
                                        beforeDispatcherArguments[argsMetadata.index] = context[routeModelArgsKey];
                                        break;
                                    default:
                                        beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? context[argsMetadata.type]
                                            : await argumentsResolution(
                                                  context[argsMetadata.type],
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  beforeDispatcherCollection.funcName
                                              );
                                        break;
                                }
                            }
                        }

                        await beforeDispatcherCollection.func(...beforeDispatcherArguments);
                    }

                    // Execute controller action
                    const controllerActionArguments: any[] = [];
                    const controllerActionCollection = result.model;
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
                                case bodyArgsKey:
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
                                        ? headers
                                        : await argumentsResolution(
                                              headers.toJSON(),
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
                                        ? headers.get(argsMetadata.key) || undefined
                                        : await argumentsResolution(
                                              headers.get(argsMetadata.key) || undefined,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              controllerActionCollection.funcName
                                          );
                                    break;
                                case paramArgsKey:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? context[paramArgsKey][argsMetadata.key] || undefined
                                        : await argumentsResolution(
                                              context[paramArgsKey][argsMetadata.key],
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

                    responseBody = await controllerActionCollection.func(...controllerActionArguments);

                    // Execute after dispatcher(s)
                    for (let i = 0; i < afterDispatcherGroup.length; i++) {
                        const afterDispatcherArguments = [];
                        const afterDispatcherCollection = afterDispatcherGroup[i];
                        const afterDispatcherMetadata: Record<string, TArgumentsMetadata> =
                            Reflect.getOwnMetadata(
                                argumentsKey,
                                afterDispatcherCollection.class,
                                afterDispatcherCollection.funcName
                            ) || {};

                        if (afterDispatcherMetadata) {
                            for (const [_key, argsMetadata] of Object.entries(afterDispatcherMetadata)) {
                                switch (argsMetadata.type) {
                                    case requestArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? request
                                            : await argumentsResolution(
                                                  request,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  afterDispatcherCollection.funcName
                                              );
                                        break;
                                    case bodyArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? await request[argsMetadata.parser || "json"]()
                                            : await argumentsResolution(
                                                  await request[argsMetadata.parser || "json"](),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  afterDispatcherCollection.funcName
                                              );
                                        break;
                                    case contextArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = !argsMetadata.key
                                            ? contextHook
                                            : contextHook.get(argsMetadata.key);
                                        break;
                                    case requestHeadersArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers
                                            : await argumentsResolution(
                                                  headers.toJSON(),
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  afterDispatcherCollection.funcName
                                              );
                                        break;
                                    case responseHeadersArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = context[argsMetadata.type];
                                        break;
                                    case requestHeaderArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? headers.get(argsMetadata.key) || undefined
                                            : await argumentsResolution(
                                                  headers.get(argsMetadata.key) || undefined,
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  afterDispatcherCollection.funcName
                                              );
                                        break;
                                    case paramArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? context[paramArgsKey][argsMetadata.key] || undefined
                                            : await argumentsResolution(
                                                  context[paramArgsKey][argsMetadata.key],
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  afterDispatcherCollection.funcName
                                              );
                                        break;
                                    case routeModelArgsKey:
                                        afterDispatcherArguments[argsMetadata.index] = context[routeModelArgsKey];
                                        break;
                                    default:
                                        afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                            ? context[argsMetadata.type]
                                            : await argumentsResolution(
                                                  context[argsMetadata.type],
                                                  argsMetadata.zodSchema,
                                                  argsMetadata.index,
                                                  afterDispatcherCollection.funcName
                                              );
                                        break;
                                }
                            }
                        }

                        await afterDispatcherCollection.func(...afterDispatcherArguments);
                    }

                    // Set default header(s)
                    context[responseHeadersArgsKey].set("X-Powered-By", "Bool Typescript");

                    return responseBody instanceof Response
                        ? responseBody
                        : new Response(
                              !responseBody
                                  ? undefined
                                  : JSON.stringify({
                                        httpCode: 200,
                                        message: "SUCCESS",
                                        data: responseBody
                                    }),
                              {
                                  status: !responseBody ? 204 : 200,
                                  statusText: "SUCCESS",
                                  headers: context[responseHeadersArgsKey]
                              }
                          );
                } catch (error) {
                    options.debug && console.error(error);

                    // Set default header(s)
                    context[responseHeadersArgsKey].set("X-Powered-By", "Bool Typescript");

                    return jsonErrorInfer(error, context[responseHeadersArgsKey]);
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
                                `PID: ${convertedPID} - Method: ${convertedMethod} - IP: ${convertedReqIp} - ${url.pathname.blue} - Time: ${convertedTime}`
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
