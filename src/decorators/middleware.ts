export type TMiddlewareMetadata = undefined;

export const middlewareKey = Symbol.for("__bool:middleware__");

export const Middleware =
    () =>
    <T extends { new (...args: any[]): {} }>(target: T) => {
        Reflect.defineMetadata(middlewareKey, undefined, target);
    };

export default Middleware;
