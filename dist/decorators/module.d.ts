import type { IModule } from "../interfaces/module";
type TInstances = Array<new (...args: any[]) => any>;
export type TModuleOptions = Partial<{
    options: Partial<{
        prefix: string;
        allowOrigins: string | Array<string>;
        allowMethods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
    dependencies: TInstances;
    controllers: TInstances;
    middlewares: TInstances;
    guards: TInstances;
    beforeDispatchers: TInstances;
    afterDispatchers: TInstances;
}> | undefined;
export type TModuleMetadata = Partial<{
    options: Partial<{
        prefix: string;
        allowOrigins: string | Array<string>;
        allowMethods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
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
