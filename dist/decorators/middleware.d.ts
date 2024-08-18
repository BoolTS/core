import type { IMiddleware } from "../interfaces";
export type TMiddlewareMetadata = undefined;
export declare const middlewareKey: unique symbol;
export declare const Middleware: () => <T extends {
    new (...args: any[]): IMiddleware;
}>(target: T) => void;
export default Middleware;
