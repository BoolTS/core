import { injectableKey } from "./injectable";

export const controllerKey = Symbol.for("__bool:controller__");

export const Controller =
    (prefix: string) =>
    <T extends Object>(target: T) => {
        Reflect.defineMetadata(controllerKey, !prefix.startsWith("/") ? `/${prefix}` : prefix, target);
        Reflect.defineMetadata(injectableKey, undefined, target);

        return target;
    };

export default Controller;
