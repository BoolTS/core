import type { IMiddleware } from "../interfaces";
import { middlewareKey } from "../keys";

export type TMiddlewareMetadata = undefined;

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
