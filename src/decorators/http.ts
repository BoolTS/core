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
    <T extends Object, K>(
        path: string,
        method: "Get" | "Post" | "Put" | "Patch" | "Delete" | "Options"
    ) =>
    (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => {
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
export const Get = <T extends Object, K>(path = "/") => defaultDecorator<T, K>(path, "Get");

/**
 *
 * @param path
 * @returns
 */
export const Post = <T extends Object, K>(path = "/") => defaultDecorator<T, K>(path, "Post");

/**
 *
 * @param path
 * @returns
 */
export const Put = <T extends Object, K>(path = "/") => defaultDecorator<T, K>(path, "Put");

/**
 *
 * @param path
 * @returns
 */
export const Patch = <T extends Object, K>(path = "/") => defaultDecorator<T, K>(path, "Patch");

/**
 *
 * @param path
 * @returns
 */
export const Delete = <T extends Object, K>(path = "/") => defaultDecorator<T, K>(path, "Delete");

/**
 *
 * @param path
 * @returns
 */
export const Options = <T extends Object, K>(path = "/") => defaultDecorator<T, K>(path, "Options");

export default {
    Get,
    Post,
    Put,
    Patch,
    Delete
};
