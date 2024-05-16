export const moduleKey = "__bool:module__";
export const Module = (args) => (target, context) => {
    Reflect.defineMetadata(moduleKey, args, target);
    return target;
};
export default Module;
