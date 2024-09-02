import { injectKey } from "../keys";
export const Inject = (definition) => {
    return (target, methodName, parameterIndex) => {
        const designParameterTypes = Reflect.getMetadata(injectKey, target) || [];
        designParameterTypes[parameterIndex] = definition;
        Reflect.defineMetadata(injectKey, designParameterTypes, target);
    };
};
export default Inject;
