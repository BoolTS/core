import type { TConstructor } from "../ultils";
export type TInterceptorMetadata = undefined;
export declare const Interceptor: <T extends TConstructor<Object>>() => (target: T) => void;
export default Interceptor;
