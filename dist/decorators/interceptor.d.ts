import type { IInterceptor } from "../interfaces";
export type TInterceptorMetadata = undefined;
export declare const Interceptor: () => <T extends {
    new (...args: any[]): IInterceptor;
}>(target: T) => void;
export default Interceptor;
