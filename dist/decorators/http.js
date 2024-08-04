export const controllerRoutesKey = Symbol.for("__bool:controller.routes__");
const defaultDecorator = (path, method) => (target, methodName, descriptor) => {
    if (!(descriptor.value instanceof Function)) {
        throw Error(`${method} decorator only use for class method.`);
    }
    // Define controller metadata
    Reflect.defineMetadata(controllerRoutesKey, [
        ...(Reflect.getOwnMetadata(controllerRoutesKey, target.constructor) || []),
        {
            path: !path.startsWith("/") ? `/${path}` : path,
            httpMethod: method.toUpperCase(),
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
