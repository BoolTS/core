import { interceptorKey } from "../constants/keys";
import type { TConstructor } from "../utils";

export type TInterceptorMetadata = undefined;

export const Interceptor =
    <T extends TConstructor<Object>>() =>
    (target: T) => {
        const metadata: TInterceptorMetadata = undefined;

        Reflect.defineMetadata(interceptorKey, metadata, target);
    };

export default Interceptor;
