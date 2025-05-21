import type { TConstructor } from "../ultils";
import type { THttpMetadata } from "./http";

import { controllerHttpKey, controllerKey } from "../keys";

export type TControllerMetadata = Required<{
    prefix: string;
    httpMetadata: THttpMetadata;
}>;

export const Controller =
    <T extends TConstructor<Object>>(prefix?: string) =>
    (target: T) => {
        const metadata: TControllerMetadata = {
            prefix: !prefix?.startsWith("/") ? `/${prefix || ""}` : prefix,
            httpMetadata: [...(Reflect.getOwnMetadata(controllerHttpKey, target) || [])]
        };

        Reflect.defineMetadata(controllerKey, metadata, target);
    };

export default Controller;
