export const injectableKey = "__bool:injectable__";

export const Injectable = () => <T extends Object>(
    target: T,
    context?: ClassDecoratorContext
) => {
    Reflect.defineMetadata(injectableKey, undefined, target);

    return target;
}

export default Injectable;
