export type TRoute = {
    path: string;
    httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    methodName: string;
    descriptor: PropertyDescriptor;
};
export type THttpMetadata = Array<TRoute>;
export declare const controllerHttpKey: unique symbol;
/**
 *
 * @param path
 * @returns
 */
export declare const Get: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Post: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Put: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Patch: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Delete: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
/**
 *
 * @param path
 * @returns
 */
export declare const Options: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
declare const _default: {
    Get: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
    Post: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
    Put: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
    Patch: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
    Delete: (path?: string) => (target: Object, methodName: string, descriptor: PropertyDescriptor) => void;
};
export default _default;
