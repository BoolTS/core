export const injectableKey = "__bool:injectable__";
export const Injectable = () => (target, context) => {
    Reflect.defineMetadata(injectableKey, undefined, target);
    return target;
};
export default Injectable;
