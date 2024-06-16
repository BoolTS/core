export const injectKey = "design:paramtypes";

export const Inject = <T extends Object>(
    classDefinition: { new(...args: any[]): T }
) => {
    return (
        target: Object,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) => {
        const designParameterTypes: any[] = Reflect.getMetadata(injectKey, target) || [];

        designParameterTypes[parameterIndex] = classDefinition;

        Reflect.defineMetadata(injectKey, designParameterTypes, target);
    }
}

export default Inject;
