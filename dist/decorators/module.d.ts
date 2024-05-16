export type TModuleOptions = Partial<{
    controllers: Array<new (...args: any[]) => unknown>;
    dependencies: Array<new (...args: any[]) => unknown>;
}> | undefined;
export declare const moduleKey = "__bool:module__";
export declare const Module: (args?: TModuleOptions) => <T extends new (...args: any[]) => {}>(target: T, context?: ClassDecoratorContext) => T;
export default Module;
