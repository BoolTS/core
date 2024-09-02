import type { IController } from "../interfaces/controller";
import { controllerHttpKey, controllerKey } from "../keys";
import { type THttpMetadata } from "./http";

export type TControllerMetadata = Required<{
    prefix: string;
    httpMetadata: THttpMetadata;
}>;

export const Controller =
    (prefix: string) =>
    <T extends { new (...args: any[]): IController }>(target: T) => {
        const metadata: TControllerMetadata = {
            prefix: !prefix.startsWith("/") ? `/${prefix}` : prefix,
            httpMetadata: [...(Reflect.getOwnMetadata(controllerHttpKey, target.constructor) || [])]
        };

        Reflect.defineMetadata(controllerKey, metadata, target);
    };

export default Controller;
