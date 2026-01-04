import type { TConstructor } from "../utils";

import { middlewareKey } from "../constants/keys";

export type TMiddlewareMetadata = undefined;

export const Middleware =
    <T extends TConstructor<Object>>() =>
    (target: T) => {
        const metadata: TMiddlewareMetadata = undefined;

        Reflect.defineMetadata(middlewareKey, metadata, target);
    };

export default Middleware;
