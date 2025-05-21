import type { TArgumentsMetadataCollection } from "./arguments";
export type TRoute = {
    path: string;
    httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    methodName: string;
    descriptor: TypedPropertyDescriptor<any>;
    argumentsMetadata: TArgumentsMetadataCollection;
};
export type THttpMetadata = Array<TRoute>;
/**
 *
 * @param path
 * @returns
 */
export declare const Get: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Post: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Put: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Patch: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Delete: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Options: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
declare const _default: {
    Get: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
    Post: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
    Put: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
    Patch: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
    Delete: <T, K extends Object>(path?: string) => (target: K, methodName: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
};
export default _default;
