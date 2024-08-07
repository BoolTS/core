export const injectKey = "design:paramtypes";
export const Inject = (classDefinition) => {
    return (target, methodName, parameterIndex) => {
        const designParameterTypes = Reflect.getMetadata(injectKey, target) || [];
        designParameterTypes[parameterIndex] = classDefinition;
        Reflect.defineMetadata(injectKey, designParameterTypes, target);
    };
};
export default Inject;
