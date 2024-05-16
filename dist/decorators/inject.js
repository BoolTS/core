export const injectKey = "design:paramtypes";
export const Inject = (constructor) => {
    return (target, parameterName, parameterIndex) => {
        const designParameterTypes = Reflect.getMetadata(injectKey, target.constructor) || [];
        designParameterTypes[parameterIndex] = constructor;
        Reflect.defineMetadata(injectKey, designParameterTypes, target.constructor);
    };
};
export default Inject;
