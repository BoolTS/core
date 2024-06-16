import { HttpClientError, HttpServerError } from "../http";
import { AsyncFunction } from "../ultils";
import { controllerRouteZodSchemaKey } from "./zodSchema";

export interface IControllerRoute {
    path: string;
    httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    methodName: string;
    descriptor: PropertyDescriptor;
}


export const controllerRoutesKey = "__bool:controller.routes__";


const defaultDecorator = (
    path: string,
    method: "Get" | "Post" | "Put" | "Patch" | "Delete" | "Options"
) => (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
) => {
        if (!(descriptor.value instanceof Function)) {
            throw Error(`${method} decorator only use for method.`);
        }

        // Define controller metadata
        Reflect.defineMetadata(controllerRoutesKey, [
            ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: method.toUpperCase(),
                methodName: methodName,
                descriptor: descriptor
            }
        ], target.constructor);

        // Define route parameters zod validation
        const currentMethod = descriptor.value;
        const isAsync = descriptor.value instanceof AsyncFunction;

        if (!isAsync) {
            descriptor.value = function () {
                const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

                if (zodSchemaMetadata) {
                    for (const zodSchemaProp in zodSchemaMetadata) {
                        const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                        try {
                            const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);

                            if (!validation.success) {
                                throw new HttpClientError({
                                    httpCode: 400,
                                    message: `Validation at the [${methodName}] method fails at positional argument [${tmpZodMetadata.index}].`,
                                    data: validation.error.issues
                                });
                            }

                            arguments[tmpZodMetadata.index] = validation.data;
                        }
                        catch (error) {
                            if (error instanceof HttpClientError) {
                                throw error;
                            }

                            throw new HttpServerError({
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
            }
        }
        else {
            descriptor.value = async function () {
                const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

                if (zodSchemaMetadata) {
                    for (const zodSchemaProp in zodSchemaMetadata) {
                        const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                        try {
                            const validation = await tmpZodMetadata.schema.safeParseAsync(arguments[tmpZodMetadata.index]);

                            if (!validation.success) {
                                throw new HttpClientError({
                                    httpCode: 400,
                                    message: `Validation at the [${methodName}] method fails at positional argument [${tmpZodMetadata.index}].`,
                                    data: validation.error.issues
                                });
                            }

                            arguments[tmpZodMetadata.index] = validation.data;
                        }
                        catch (error) {
                            if (error instanceof HttpClientError) {
                                throw error;
                            }

                            throw new HttpServerError({
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
            }
        }
    }

/**
 * 
 * @param path 
 * @returns 
 */
export const Get = (
    path = "/"
) => defaultDecorator(path, "Get");


/**
 * 
 * @param path 
 * @returns 
 */
export const Post = (
    path = "/"
) => defaultDecorator(path, "Post");


/**
 * 
 * @param path 
 * @returns 
 */
export const Put = (
    path = "/"
) => defaultDecorator(path, "Put");


/**
 * 
 * @param path 
 * @returns 
 */
export const Patch = (
    path = "/"
) => defaultDecorator(path, "Patch");


/**
 * 
 * @param path 
 * @returns 
 */
export const Delete = (
    path = "/"
) => defaultDecorator(path, "Delete");


/**
 * 
 * @param path 
 * @returns 
 */
export const Options = (
    path = "/"
) => defaultDecorator(path, "Options");

export default {
    Get,
    Post,
    Put,
    Patch,
    Delete
};

