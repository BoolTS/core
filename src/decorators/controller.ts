import type { IController } from "../interfaces";
import type { THttpMetadata } from "./http";

import { controllerHttpKey, controllerKey } from "../keys";

export type TControllerMetadata = Required<{
    prefix: string;
    httpMetadata: THttpMetadata;
}>;

export const Controller =
    (prefix?: string) =>
    <T extends { new (...args: any[]): IController }>(target: T) => {
        const metadata: TControllerMetadata = {
            prefix: !prefix?.startsWith("/") ? `/${prefix || ""}` : prefix,
            httpMetadata: [...(Reflect.getOwnMetadata(controllerHttpKey, target) || [])]
        };

        Reflect.defineMetadata(controllerKey, metadata, target);
    };

export default Controller;
