import type { IMiddleware } from "../interfaces";
import { middlewareKey } from "../keys";

export type TMiddlewareMetadata = undefined;

export const Middleware =
    () =>
    <T extends { new (...args: any[]): IMiddleware }>(target: T) => {
        const metadata: TMiddlewareMetadata = undefined;

        Reflect.defineMetadata(middlewareKey, metadata, target);
    };

export default Middleware;
