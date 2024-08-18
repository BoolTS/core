import type { IMiddleware } from "../interfaces";

export type TMiddlewareMetadata = undefined;

export const middlewareKey = Symbol.for("__bool:middleware__");

export const Middleware =
    () =>
    <T extends { new (...args: any[]): IMiddleware }>(target: T) => {
        if (!("enforce" in target.prototype) || typeof target.prototype.enforce !== "function") {
            return;
        }

        const metadata: TMiddlewareMetadata = undefined;

        Reflect.defineMetadata(middlewareKey, metadata, target);
    };

export default Middleware;
