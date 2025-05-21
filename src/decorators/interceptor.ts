import { interceptorKey } from "../keys";
import type { TConstructor } from "../ultils";

export type TInterceptorMetadata = undefined;

export const Interceptor =
    <T extends TConstructor<Object>>() =>
    (target: T) => {
        const metadata: TInterceptorMetadata = undefined;

        Reflect.defineMetadata(interceptorKey, metadata, target);
    };

export default Interceptor;
