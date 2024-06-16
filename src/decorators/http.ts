import { HttpClientError } from "../http";
import { controllerRouteZodSchemaKey } from "./zodSchema";

export interface IControllerRoute {
    path: string;
    httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    methodName: string;
    descriptor: PropertyDescriptor;
}


export const controllerRoutesKey = "__bool:controller.routes__";

/**
 * 
 * @param path 
 * @returns 
 */
export const Get = (
    path = "/"
) => (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
) => {
        if (typeof descriptor.value !== "function") {
            throw Error("Get decorator only use for method.");
        }

        // Define controller metadata
        Reflect.defineMetadata(controllerRoutesKey, [
            ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: "GET",
                methodName: methodName,
                descriptor: descriptor
            }
        ], target.constructor);

        // Define route parameters zod validation
        const currentMethod = descriptor.value;

        descriptor.value = function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                    const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);

                    if (!validation.success) {
                        throw new HttpClientError({
                            httpCode: 400,
                            data: validation.error.issues
                        })
                    }
                }
            }

            return currentMethod.apply(this, arguments);
        }
    }


/**
 * 
 * @param path 
 * @returns 
 */
export const Post = (
    path = "/"
) => (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
) => {
        if (typeof descriptor.value !== "function") {
            throw Error("Post decorator only use for method.");
        }

        Reflect.defineMetadata(controllerRoutesKey, [
            ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: "POST",
                methodName: methodName,
                descriptor: descriptor
            }
        ], target.constructor);

        // Define route parameters zod validation
        const currentMethod = descriptor.value;

        descriptor.value = function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                    const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);

                    if (!validation.success) {
                        throw new HttpClientError({
                            httpCode: 400,
                            data: validation.error.issues
                        })
                    }
                }
            }

            return currentMethod.apply(this, arguments);
        }
    }


/**
 * 
 * @param path 
 * @returns 
 */
export const Put = (
    path = "/"
) => (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
) => {
        if (typeof descriptor.value !== "function") {
            throw Error("Put decorator only use for method.");
        }

        Reflect.defineMetadata(controllerRoutesKey, [
            ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: "PUT",
                methodName: methodName,
                descriptor: descriptor
            }
        ], target.constructor);

        // Define route parameters zod validation
        const currentMethod = descriptor.value;

        descriptor.value = function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                    const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);

                    if (!validation.success) {
                        throw new HttpClientError({
                            httpCode: 400,
                            data: validation.error.issues
                        })
                    }
                }
            }

            return currentMethod.apply(this, arguments);
        }
    }


/**
 * 
 * @param path 
 * @returns 
 */
export const Patch = (
    path = "/"
) => (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
) => {
        if (typeof descriptor.value !== "function") {
            throw Error("Patch decorator only use for method.");
        }

        Reflect.defineMetadata(controllerRoutesKey, [
            ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: "PATCH",
                methodName: methodName,
                descriptor: descriptor
            }
        ], target.constructor);

        // Define route parameters zod validation
        const currentMethod = descriptor.value;

        descriptor.value = function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                    const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);

                    if (!validation.success) {
                        throw new HttpClientError({
                            httpCode: 400,
                            data: validation.error.issues
                        })
                    }
                }
            }

            return currentMethod.apply(this, arguments);
        }
    }


/**
 * 
 * @param path 
 * @returns 
 */
export const Delete = (
    path = "/"
) => (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
) => {
        if (typeof descriptor.value !== "function") {
            throw Error("Delete decorator only use for method.");
        }

        Reflect.defineMetadata(controllerRoutesKey, [
            ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: "DELETE",
                methodName: methodName,
                descriptor: descriptor
            }
        ], target.constructor);

        // Define route parameters zod validation
        const currentMethod = descriptor.value;

        descriptor.value = function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                    const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);

                    if (!validation.success) {
                        throw new HttpClientError({
                            httpCode: 400,
                            data: validation.error.issues
                        })
                    }
                }
            }

            return currentMethod.apply(this, arguments);
        }
    }


/**
 * 
 * @param path 
 * @returns 
 */
export const Options = (
    path = "/"
) => (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
) => {
        if (typeof descriptor.value !== "function") {
            throw Error("Options decorator only use for method.");
        }

        Reflect.defineMetadata(controllerRoutesKey, [
            ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: "OPTIONS",
                methodName: methodName,
                descriptor: descriptor
            }
        ], target.constructor);

        // Define route parameters zod validation
        const currentMethod = descriptor.value;

        descriptor.value = function () {
            const zodSchemaMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName);

            if (zodSchemaMetadata) {
                for (const zodSchemaProp in zodSchemaMetadata) {
                    const tmpZodMetadata = zodSchemaMetadata[zodSchemaProp];

                    const validation = tmpZodMetadata.schema.safeParse(arguments[tmpZodMetadata.index]);

                    if (!validation.success) {
                        throw new HttpClientError({
                            httpCode: 400,
                            data: validation.error.issues
                        })
                    }
                }
            }

            return currentMethod.apply(this, arguments);
        }
    }

export default {
    Get,
    Post,
    Put,
    Patch,
    Delete
};

