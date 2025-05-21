import type { TConstructor } from "../ultils";
export type TMiddlewareMetadata = undefined;
export declare const Middleware: <T extends TConstructor<Object>>() => (target: T) => void;
export default Middleware;
