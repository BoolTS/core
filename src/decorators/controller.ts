import { controllerHttpKey, type THttpMetadata } from "./http";

export type TControllerMetadata = Required<{
    prefix: string;
    httpMetadata: THttpMetadata;
}>;

export const controllerKey = Symbol.for("__bool:controller__");

export const Controller =
    (prefix: string) =>
    <T extends { new (...args: any[]): {} }>(target: T) => {
        const metadata: TControllerMetadata = {
            prefix: !prefix.startsWith("/") ? `/${prefix}` : prefix,
            httpMetadata: [...(Reflect.getOwnMetadata(controllerHttpKey, target.constructor) || [])]
        };

        Reflect.defineMetadata(controllerKey, metadata, target);
    };

export default Controller;
