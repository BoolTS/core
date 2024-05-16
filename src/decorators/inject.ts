export const injectKey = "design:paramtypes";

export const Inject = <T>(
    constructor: new (...args: any[]) => T
) => {
    return (
        target: Object,
        parameterName: string | Symbol | undefined,
        parameterIndex: number
    ) => {
        const designParameterTypes: any[] = Reflect.getMetadata(injectKey, target.constructor) || [];

        designParameterTypes[parameterIndex] = constructor;

        Reflect.defineMetadata(injectKey, designParameterTypes, target.constructor);
    }
}

export default Inject;
