import "colors";
import "reflect-metadata";
import Qs from "qs";
import * as Zod from "zod";
import { Router, RouterGroup } from "../entities";
import { controllerKey, controllerRoutesKey, moduleKey } from "../decorators";
import { HttpClientError, HttpServerError, jsonErrorInfer } from "../http";
import { Injector } from "./injector";
import { controllerActionArgumentsKey, EArgumentTypes } from "../decorators/arguments";
export const controllerCreator = (controllerConstructor, group) => {
    if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(controllerKey)) {
        throw Error(`${controllerConstructor.name} is not a controller.`);
    }
    const controller = Injector.get(controllerConstructor);
    if (!controller) {
        throw Error("Can not initialize controller.");
    }
    const controllerMetadata = Reflect.getOwnMetadata(controllerKey, controllerConstructor) || "/";
    const routesMetadata = (Reflect.getOwnMetadata(controllerRoutesKey, controllerConstructor) ||
        []);
    const router = new Router(controllerMetadata);
    routesMetadata.forEach((routeMetadata) => {
        if (typeof routeMetadata.descriptor.value !== "function") {
            return;
        }
        const route = router.route(`/${routeMetadata.path}`);
        const handler = routeMetadata.descriptor.value.bind(controller);
        const routeArgument = {
            constructor: controllerConstructor,
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
export const controllerActionArgumentsResolution = async (data, zodSchema, argumentIndex, funcName) => {
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
    }
    catch (error) {
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
export const BoolFactory = (target, options) => {
    if (!Reflect.getOwnMetadataKeys(target).includes(moduleKey)) {
        throw Error(`${target.name} is not a module.`);
    }
    const moduleMetadata = Reflect.getOwnMetadata(moduleKey, target);
    const allowOrigins = !moduleMetadata?.allowOrigins
        ? ["*"]
        : typeof moduleMetadata.allowOrigins !== "string"
            ? moduleMetadata.allowOrigins
            : [moduleMetadata.allowOrigins];
    const allowMethods = !moduleMetadata?.allowMethods
        ? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        : moduleMetadata.allowMethods;
    const { allowLogsMethods } = Object.freeze({
        allowLogsMethods: !options?.log?.methods ? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : options.log.methods
    });
    const routerGroup = new RouterGroup();
    moduleMetadata?.controllers &&
        moduleMetadata.controllers.map((controllerConstructor) => controllerCreator(controllerConstructor, routerGroup));
    Bun.serve({
        port: options.port,
        async fetch(request) {
            const start = performance.now();
            const url = new URL(request.url);
            try {
                const headers = request.headers;
                const origin = headers.get("origin");
                const response = new Response();
                if (!allowOrigins.includes("*")) {
                    if (!origin) {
                        throw new HttpClientError({
                            httpCode: 403,
                            message: "Origin not found.",
                            data: {
                                origin: {
                                    code: "origin:invalid:0x00001",
                                    message: "Origin not found."
                                }
                            }
                        });
                    }
                    if (!allowOrigins.includes(origin)) {
                        throw new HttpClientError({
                            httpCode: 403,
                            message: "Invalid origin.",
                            data: {
                                origin: {
                                    code: "origin:invalid:0x00002",
                                    message: "Invalid origin."
                                }
                            }
                        });
                    }
                }
                response.headers.set("Access-Control-Allow-Origin", origin || "*");
                response.headers.set("Access-Control-Allow-Headers", "*");
                response.headers.set("Access-Control-Allow-Credentials", "true");
                response.headers.set("Access-Control-Allow-Methods", allowMethods.join(", "));
                if (!allowMethods.includes(request.method.toUpperCase())) {
                    throw new HttpClientError({
                        httpCode: 405,
                        message: "Method Not Allowed.",
                        data: undefined
                    });
                }
                const result = routerGroup.find(url.pathname, request.method);
                if (!result) {
                    throw new HttpClientError({
                        httpCode: 404,
                        message: "Route not found.",
                        data: undefined
                    });
                }
                const params = result.params;
                const query = Qs.parse(url.search, options.queryParser);
                for (let i = 0; i < result.handlers.length; i++) {
                    const handler = result.handlers[i];
                    const handlerMetadata = (Reflect.getOwnMetadata(controllerActionArgumentsKey, handler.constructor, handler.funcName) || {});
                    const controllerActionArguments = [];
                    if (handlerMetadata) {
                        for (const [_key, argsMetadata] of Object.entries(handlerMetadata)) {
                            switch (argsMetadata.type) {
                                case EArgumentTypes.headers:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? headers
                                        : await controllerActionArgumentsResolution(headers, argsMetadata.zodSchema, argsMetadata.index, handler.funcName);
                                    break;
                                case EArgumentTypes.body:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? await request[argsMetadata.parser || "json"]()
                                        : await controllerActionArgumentsResolution(await request[argsMetadata.parser || "json"](), argsMetadata.zodSchema, argsMetadata.index, handler.funcName);
                                    break;
                                case EArgumentTypes.params:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? params
                                        : await controllerActionArgumentsResolution(params, argsMetadata.zodSchema, argsMetadata.index, handler.funcName);
                                    break;
                                case EArgumentTypes.query:
                                    controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema
                                        ? query
                                        : await controllerActionArgumentsResolution(query, argsMetadata.zodSchema, argsMetadata.index, handler.funcName);
                                    break;
                            }
                        }
                    }
                    const response = await handler.func(...controllerActionArguments);
                    if (response instanceof Response) {
                        return response;
                    }
                }
                return response;
            }
            catch (error) {
                return jsonErrorInfer(error);
            }
            finally {
                const end = performance.now();
                const convertedPID = `${process.pid}`.yellow;
                const convertedMethod = `${request.method.yellow}`.bgBlue;
                const convertedReqIp = `${request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "<Unknown>"}`.yellow;
                const convertedTime = `${Math.round((end - start + Number.EPSILON) * 10 ** 2) / 10 ** 2}ms`.yellow;
                allowLogsMethods.includes(request.method.toUpperCase()) &&
                    console.info(`PID: ${convertedPID} - Method: ${convertedMethod} - IP: ${convertedReqIp} - ${url.pathname.blue} - Time: ${convertedTime}`);
            }
        }
    });
};
export default BoolFactory;
