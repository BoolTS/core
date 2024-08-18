export const injectableKey = Symbol.for("__bool:injectable__");
export const Injectable = () => (target) => Reflect.defineMetadata(injectableKey, undefined, target);
export default Injectable;
