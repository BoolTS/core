import type { IModule } from "../interfaces/module";
type TInstances = Array<new (...args: any[]) => any>;
export type TModuleOptions = Partial<{
    config: Record<string | symbol, any> | (() => Record<string | symbol, any> | Promise<Record<string | symbol, any>>);
    prefix: string;
    dependencies: TInstances;
    controllers: TInstances;
    middlewares: TInstances;
    guards: TInstances;
    beforeDispatchers: TInstances;
    afterDispatchers: TInstances;
}> | undefined;
export type TModuleMetadata = Partial<{
    config: Record<string | symbol, any> | (() => Record<string | symbol, any> | Promise<Record<string | symbol, any>>);
    prefix: string;
    controllers: TInstances;
    dependencies: TInstances;
    middlewares: TInstances;
    guards: TInstances;
    beforeDispatchers: TInstances;
    afterDispatchers: TInstances;
}> | undefined;
export declare const moduleKey: unique symbol;
export declare const Module: (args?: TModuleOptions) => <T extends {
    new (...args: any[]): IModule;
}>(target: T) => void;
export default Module;
