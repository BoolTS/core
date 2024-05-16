import { injectableKey } from "./injectable";


export const controllerKey = "__bool:controller__";

export const Controller = (
    prefix: string
) => <T extends Object>(
    target: T,
    context?: ClassDecoratorContext
) => {
        Reflect.defineMetadata(controllerKey, !prefix.startsWith("/") ? `/${prefix}` : prefix, target);
        Reflect.defineMetadata(injectableKey, undefined, target);

        return target;
    }

export default Controller;
