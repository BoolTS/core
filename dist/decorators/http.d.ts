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
export declare const Get: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Post: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Put: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Patch: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Delete: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Options: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
declare const _default: {
    Get: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
    Post: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
    Put: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
    Patch: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
    Delete: <T extends Object, K>(path?: string) => (target: T, methodName: string | symbol, descriptor: TypedPropertyDescriptor<K>) => void;
};
export default _default;
