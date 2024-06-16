"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.controllerRoutesKey = void 0;
const http_1 = require("../http");
const ultils_1 = require("../ultils");
const zodSchema_1 = require("./zodSchema");
exports.controllerRoutesKey = "__bool:controller.routes__";
const defaultDecorator = (path, method) => (target, methodName, descriptor) => {
    if (!(descriptor.value instanceof Function)) {
        throw Error(`${method} decorator only use for method.`);
    }
    // Define controller metadata
    Reflect.defineMetadata(exports.controllerRoutesKey, [
        ...Reflect.getOwnMetadata(exports.controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: method.toUpperCase(),
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
    // Define route parameters zod validation
    const currentMethod = descriptor.value;
    const isAsync = descriptor.value instanceof ultils_1.AsyncFunction;
    if (!isAsync) {
        descriptor.value = function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(zodSchema_1.controllerRouteZodSchemaKey, target.constructor, methodName);
            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];
                    try {
                        const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);
                        if (!validation.success) {
                            throw new http_1.HttpClientError({
                                httpCode: 400,
                                message: `Validation at the [${methodName}] method fails at positional argument [${tmpZodMetadata.index}].`,
                                data: validation.error.issues
                            });
                        }
                    }
                    catch (error) {
                        if (error instanceof http_1.HttpClientError) {
                            throw error;
                        }
                        throw new http_1.HttpServerError({
                            httpCode: 500,
                            message: `Validation at the [${methodName}] method error at positional argument [${tmpZodMetadata.index}].`,
                            data: !(error instanceof Error) ? error : [{
                                    message: error.message,
                                    code: error.name,
                                    cause: error.cause
                                }]
                        });
                    }
                }
            }
            return currentMethod.apply(this, arguments);
        };
    }
    else {
        descriptor.value = async function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(zodSchema_1.controllerRouteZodSchemaKey, target.constructor, methodName);
            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];
                    try {
                        const validation = await tmpZodMetadata.schema.safeParseAsync(arguments[tmpZodMetadata.index]);
                        if (!validation.success) {
                            throw new http_1.HttpClientError({
                                httpCode: 400,
                                message: `Validation at the [${methodName}] method fails at positional argument [${tmpZodMetadata.index}].`,
                                data: validation.error.issues
                            });
                        }
                    }
                    catch (error) {
                        if (error instanceof http_1.HttpClientError) {
                            throw error;
                        }
                        throw new http_1.HttpServerError({
                            httpCode: 500,
                            message: `Validation at the [${methodName}] method error at positional argument [${tmpZodMetadata.index}].`,
                            data: !(error instanceof Error) ? error : [{
                                    message: error.message,
                                    code: error.name,
                                    cause: error.cause
                                }]
                        });
                    }
                }
            }
            return currentMethod.apply(this, arguments);
        };
    }
};
/**
 *
 * @param path
 * @returns
 */
const Get = (path = "/") => defaultDecorator(path, "Get");
exports.Get = Get;
/**
 *
 * @param path
 * @returns
 */
const Post = (path = "/") => defaultDecorator(path, "Post");
exports.Post = Post;
/**
 *
 * @param path
 * @returns
 */
const Put = (path = "/") => defaultDecorator(path, "Put");
exports.Put = Put;
/**
 *
 * @param path
 * @returns
 */
const Patch = (path = "/") => defaultDecorator(path, "Patch");
exports.Patch = Patch;
/**
 *
 * @param path
 * @returns
 */
const Delete = (path = "/") => defaultDecorator(path, "Delete");
exports.Delete = Delete;
/**
 *
 * @param path
 * @returns
 */
const Options = (path = "/") => defaultDecorator(path, "Options");
exports.Options = Options;
exports.default = {
    Get: exports.Get,
    Post: exports.Post,
    Put: exports.Put,
    Patch: exports.Patch,
    Delete: exports.Delete
};
