export const injectKey = "design:paramtypes";
export const Inject = (classDefinition) => {
    return (target, parameterName, parameterIndex) => {
        const designParameterTypes = Reflect.getMetadata(injectKey, target.constructor) || [];
        designParameterTypes[parameterIndex] = classDefinition.constructor;
        Reflect.defineMetadata(injectKey, designParameterTypes, target.constructor);
    };
};
export default Inject;
