export const injectableKey = Symbol.for("__bool:injectable__");

export const Injectable =
    () =>
    <T extends Object>(target: T) =>
        Reflect.defineMetadata(injectableKey, undefined, target);

export default Injectable;
