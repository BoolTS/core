export const controllerRoutesKey = "__bool:controller.routes__";
/**
 *
 * @param path
 * @returns
 */
export const Get = (path = "/") => (target, methodName, descriptor) => {
    if (typeof descriptor.value !== "function") {
        throw Error("Get decorator only use for method.");
    }
    Reflect.defineMetadata(controllerRoutesKey, [
        ...Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: "GET",
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
};
/**
 *
 * @param path
 * @returns
 */
export const Post = (path = "/") => (target, methodName, descriptor) => {
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
};
/**
 *
 * @param path
 * @returns
 */
export const Put = (path = "/") => (target, methodName, descriptor) => {
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
};
/**
 *
 * @param path
 * @returns
 */
export const Patch = (path = "/") => (target, methodName, descriptor) => {
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
};
/**
 *
 * @param path
 * @returns
 */
export const Delete = (path = "/") => (target, methodName, descriptor) => {
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
};
/**
 *
 * @param path
 * @returns
 */
export const Options = (path = "/") => (target, methodName, descriptor) => {
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
};
export default {
    Get,
    Post,
    Put,
    Patch,
    Delete
};
