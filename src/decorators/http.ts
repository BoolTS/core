import type { TArgumentsMetadataCollection } from "./arguments";

import { argumentsKey, controllerHttpKey } from "../keys";

export type TRoute = {
    path: string;
    httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    methodName: string;
    descriptor: TypedPropertyDescriptor<any>;
    argumentsMetadata: TArgumentsMetadataCollection;
};

export type THttpMetadata = Array<TRoute>;

const defaultDecorator =
    (path: string, method: "Get" | "Post" | "Put" | "Patch" | "Delete" | "Options") =>
    (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if (!(descriptor?.value instanceof Function)) {
            throw Error(`${method} decorator only use for class method.`);
        }

        const argumentsMetadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        const metadata: THttpMetadata = [
            ...(Reflect.getOwnMetadata(controllerHttpKey, target.constructor) || []),
            {
                path: !path.startsWith("/") ? `/${path}` : path,
                httpMethod: method.toUpperCase(),
                methodName: methodName,
                descriptor: descriptor,
                argumentsMetadata: argumentsMetadata
            }
        ];

        // Define controller metadata
        Reflect.defineMetadata(controllerHttpKey, metadata, target.constructor);
    };

/**
 *
 * @param path
 * @returns
 */
export const Get = (path = "/") => defaultDecorator(path, "Get");

/**
 *
 * @param path
 * @returns
 */
export const Post = (path = "/") => defaultDecorator(path, "Post");

/**
 *
 * @param path
 * @returns
 */
export const Put = (path = "/") => defaultDecorator(path, "Put");

/**
 *
 * @param path
 * @returns
 */
export const Patch = (path = "/") => defaultDecorator(path, "Patch");

/**
 *
 * @param path
 * @returns
 */
export const Delete = (path = "/") => defaultDecorator(path, "Delete");

/**
 *
 * @param path
 * @returns
 */
export const Options = (path = "/") => defaultDecorator(path, "Options");

export default {
    Get,
    Post,
    Put,
    Patch,
    Delete
};
