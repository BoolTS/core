import { injectKey } from "../keys";

export const Inject = <T extends Object>(definition: { new (...args: any[]): T } | string | symbol) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        const designParameterTypes: any[] = Reflect.getMetadata(injectKey, target) || [];

        designParameterTypes[parameterIndex] = definition;

        Reflect.defineMetadata(injectKey, designParameterTypes, target);
    };
};

export default Inject;
