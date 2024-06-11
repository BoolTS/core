"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.controllerRoutesKey = void 0;
exports.controllerRoutesKey = "__bool:controller.routes__";
/**
 *
 * @param path
 * @returns
 */
const Get = (path = "/") => (target, methodName, descriptor) => {
    if (typeof descriptor.value !== "function") {
        throw Error("Get decorator only use for method.");
    }
    Reflect.defineMetadata(exports.controllerRoutesKey, [
        ...Reflect.getOwnMetadata(exports.controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: "GET",
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
};
exports.Get = Get;
/**
 *
 * @param path
 * @returns
 */
const Post = (path = "/") => (target, methodName, descriptor) => {
    if (typeof descriptor.value !== "function") {
        throw Error("Post decorator only use for method.");
    }
    Reflect.defineMetadata(exports.controllerRoutesKey, [
        ...Reflect.getOwnMetadata(exports.controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: "POST",
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
};
exports.Post = Post;
/**
 *
 * @param path
 * @returns
 */
const Put = (path = "/") => (target, methodName, descriptor) => {
    if (typeof descriptor.value !== "function") {
        throw Error("Put decorator only use for method.");
    }
    Reflect.defineMetadata(exports.controllerRoutesKey, [
        ...Reflect.getOwnMetadata(exports.controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: "PUT",
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
};
exports.Put = Put;
/**
 *
 * @param path
 * @returns
 */
const Patch = (path = "/") => (target, methodName, descriptor) => {
    if (typeof descriptor.value !== "function") {
        throw Error("Patch decorator only use for method.");
    }
    Reflect.defineMetadata(exports.controllerRoutesKey, [
        ...Reflect.getOwnMetadata(exports.controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: "PATCH",
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
};
exports.Patch = Patch;
/**
 *
 * @param path
 * @returns
 */
const Delete = (path = "/") => (target, methodName, descriptor) => {
    if (typeof descriptor.value !== "function") {
        throw Error("Delete decorator only use for method.");
    }
    Reflect.defineMetadata(exports.controllerRoutesKey, [
        ...Reflect.getOwnMetadata(exports.controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: "DELETE",
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
};
exports.Delete = Delete;
/**
 *
 * @param path
 * @returns
 */
const Options = (path = "/") => (target, methodName, descriptor) => {
    if (typeof descriptor.value !== "function") {
        throw Error("Options decorator only use for method.");
    }
    Reflect.defineMetadata(exports.controllerRoutesKey, [
        ...Reflect.getOwnMetadata(exports.controllerRoutesKey, target.constructor) || [],
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: "OPTIONS",
            methodName: methodName,
            descriptor: descriptor
        }
    ], target.constructor);
};
exports.Options = Options;
exports.default = {
    Get: exports.Get,
    Post: exports.Post,
    Put: exports.Put,
    Patch: exports.Patch,
    Delete: exports.Delete
};
