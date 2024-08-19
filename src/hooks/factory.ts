import "colors";
import "reflect-metadata";

import Qs from "qs";
import * as Zod from "zod";

import type { TModuleMetadata, TArgumentsMetadata, THttpMetadata, TControllerMetadata } from "../decorators";

import { Router, RouterGroup } from "../entities";
import { controllerHttpKey, controllerKey, argumentsKey, moduleKey, EArgumentTypes } from "../decorators";
import { HttpClientError, HttpServerError, jsonErrorInfer, type THttpMethods } from "../http";
import { Injector } from "./injector";
import type { IGuard, IMiddleware } from "../interfaces";
import type { IDispatcher } from "../interfaces/dispatcher";

export type TBoolFactoryOptions = Required<{
    port: number;
}> &
    Partial<{
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
        const routeArgument = {
            class: controllerConstructor,
            funcName: routeMetadata.methodName,
            func: handler
        };

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

export const BoolFactory = (target: new (...args: any[]) => unknown, options: TBoolFactoryOptions) => {
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

    const { middlewares, guards, beforeDispatchers, controllers, afterDispatchers, prefix: modulePrefix } = moduleMetadata;

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

    const { allowLogsMethods } = Object.freeze({
        allowLogsMethods: options?.log?.methods
    });

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
        fetch: async (request) => {
            const start = performance.now();
            const url = new URL(request.url);
            const reqHeaders = request.headers;
            const resHeaders = new Headers();

            try {
                // Execute middleware(s)
                for (let i = 0; i < middlewareGroup.length; i++) {
                    const middlewareArguments = [];
                    const middlewareCollection = middlewareGroup[i];
                    const middlewareMetadata: Record<string, TArgumentsMetadata> =
                        Reflect.getOwnMetadata(argumentsKey, middlewareCollection.class, middlewareCollection.funcName) || {};

                    if (middlewareMetadata) {
                        for (const [_key, argsMetadata] of Object.entries(middlewareMetadata)) {
                            switch (argsMetadata.type) {
                                case EArgumentTypes.requestHeaders:
                                    middlewareArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? reqHeaders
                                        : await argumentsResolution(
                                              reqHeaders,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              middlewareCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.body:
                                    middlewareArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? await request[argsMetadata.parser || "json"]()
                                        : await argumentsResolution(
                                              await request[argsMetadata.parser || "json"](),
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              middlewareCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.request:
                                    middlewareArguments[argsMetadata.index] = request;
                                    break;
                                case EArgumentTypes.responseHeaders:
                                    middlewareArguments[argsMetadata.index] = resHeaders;
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
                                case EArgumentTypes.requestHeaders:
                                    guardArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? reqHeaders
                                        : await argumentsResolution(
                                              reqHeaders,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              guardCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.body:
                                    guardArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? await request[argsMetadata.parser || "json"]()
                                        : await argumentsResolution(
                                              await request[argsMetadata.parser || "json"](),
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              guardCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.request:
                                    guardArguments[argsMetadata.index] = request;
                                    break;
                                case EArgumentTypes.responseHeaders:
                                    guardArguments[argsMetadata.index] = resHeaders;
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

                const params = result.params;
                const query = Qs.parse(url.search, options.queryParser);

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
                                case EArgumentTypes.requestHeaders:
                                    beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? reqHeaders
                                        : await argumentsResolution(
                                              reqHeaders,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              beforeDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.body:
                                    beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? await request[argsMetadata.parser || "json"]()
                                        : await argumentsResolution(
                                              await request[argsMetadata.parser || "json"](),
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              beforeDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.params:
                                    beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? params
                                        : await argumentsResolution(
                                              params,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              beforeDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.query:
                                    beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? query
                                        : await argumentsResolution(
                                              query,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              beforeDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.param:
                                    beforeDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? !(argsMetadata.key in params)
                                            ? undefined
                                            : params[argsMetadata.key]
                                        : await argumentsResolution(
                                              query,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              beforeDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.request:
                                    beforeDispatcherArguments[argsMetadata.index] = request;
                                    break;
                                case EArgumentTypes.responseHeaders:
                                    beforeDispatcherArguments[argsMetadata.index] = resHeaders;
                                    break;
                            }
                        }
                    }

                    await beforeDispatcherCollection.func(...beforeDispatcherArguments);
                }

                // Execute controller action
                for (let i = 0; i < result.handlers.length; i++) {
                    const controllerActionArguments = [];
                    const handler = result.handlers[i];
                    const handlerMetadata: Record<string, TArgumentsMetadata> =
                        Reflect.getOwnMetadata(argumentsKey, handler.class, handler.funcName) || {};

                    if (handlerMetadata) {
                        for (const [_key, argsMetadata] of Object.entries(handlerMetadata)) {
                            switch (argsMetadata.type) {
                                case EArgumentTypes.requestHeaders:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? reqHeaders
                                        : await argumentsResolution(
                                              reqHeaders,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              handler.funcName
                                          );
                                    break;
                                case EArgumentTypes.body:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? await request[argsMetadata.parser || "json"]()
                                        : await argumentsResolution(
                                              await request[argsMetadata.parser || "json"](),
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              handler.funcName
                                          );
                                    break;
                                case EArgumentTypes.params:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? params
                                        : await argumentsResolution(
                                              params,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              handler.funcName
                                          );
                                    break;
                                case EArgumentTypes.query:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? query
                                        : await argumentsResolution(
                                              query,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              handler.funcName
                                          );
                                    break;
                                case EArgumentTypes.param:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? !(argsMetadata.key in params)
                                            ? undefined
                                            : params[argsMetadata.key]
                                        : await argumentsResolution(
                                              query,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              handler.funcName
                                          );
                                    break;
                                case EArgumentTypes.request:
                                    controllerActionArguments[argsMetadata.index] = request;
                                    break;
                                case EArgumentTypes.responseHeaders:
                                    controllerActionArguments[argsMetadata.index] = resHeaders;
                                    break;
                            }
                        }
                    }

                    responseBody = await handler.func(...controllerActionArguments);
                }

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
                                case EArgumentTypes.requestHeaders:
                                    afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? reqHeaders
                                        : await argumentsResolution(
                                              reqHeaders,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              afterDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.body:
                                    afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? await request[argsMetadata.parser || "json"]()
                                        : await argumentsResolution(
                                              await request[argsMetadata.parser || "json"](),
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              afterDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.params:
                                    afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? params
                                        : await argumentsResolution(
                                              params,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              afterDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.query:
                                    afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? query
                                        : await argumentsResolution(
                                              query,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              afterDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.param:
                                    afterDispatcherArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? !(argsMetadata.key in params)
                                            ? undefined
                                            : params[argsMetadata.key]
                                        : await argumentsResolution(
                                              query,
                                              argsMetadata.zodSchema,
                                              argsMetadata.index,
                                              afterDispatcherCollection.funcName
                                          );
                                    break;
                                case EArgumentTypes.request:
                                    afterDispatcherArguments[argsMetadata.index] = request;
                                    break;
                                case EArgumentTypes.responseHeaders:
                                    afterDispatcherArguments[argsMetadata.index] = resHeaders;
                                    break;
                            }
                        }
                    }

                    await afterDispatcherCollection.func(...afterDispatcherArguments);
                }

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
                              headers: resHeaders
                          }
                      );
            } catch (error) {
                return jsonErrorInfer(error);
            } finally {
                if (allowLogsMethods) {
                    const end = performance.now();
                    const convertedPID = `${process.pid}`.yellow;
                    const convertedMethod = `${request.method.yellow}`.bgBlue;
                    const convertedReqIp = `${
                        request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "<Unknown>"
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
};

export default BoolFactory;
