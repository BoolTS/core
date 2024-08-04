export const moduleKey = Symbol.for("__bool:module__");
export const Module = (args) => (target) => {
    Reflect.defineMetadata(moduleKey, args, target);
    return target;
};
export default Module;
