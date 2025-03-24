import type { IInterceptor } from "../interfaces";

import { interceptorKey } from "../keys";

export type TInterceptorMetadata = undefined;

export const Interceptor =
    () =>
    <T extends { new (...args: any[]): IInterceptor }>(target: T) => {
        const metadata: TInterceptorMetadata = undefined;

        Reflect.defineMetadata(interceptorKey, metadata, target);
    };

export default Interceptor;
