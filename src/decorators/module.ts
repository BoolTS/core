export type TModuleOptions = Partial<{
    controllers: Array<new (...args: any[]) => unknown>;
    dependencies: Array<new (...args: any[]) => unknown>;
}> | undefined;

export const moduleKey = "__bool:module__";

export const Module = (
    args?: TModuleOptions
) => <T extends { new(...args: any[]): {} }>(
    target: T,
    context?: ClassDecoratorContext
) => {
        Reflect.defineMetadata(moduleKey, args, target);

        return target;
    }

export default Module;
