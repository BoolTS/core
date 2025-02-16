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
export declare const Get: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Post: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Put: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Patch: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Delete: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Options: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
declare const _default: {
    Get: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    Post: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    Put: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    Patch: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    Delete: (path?: string) => (target: Object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
};
export default _default;
