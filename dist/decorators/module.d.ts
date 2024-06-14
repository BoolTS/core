export type TModuleOptions = Partial<{
    prefix: string;
    controllers: Array<new (...args: any[]) => unknown>;
    dependencies: Array<new (...args: any[]) => unknown>;
    allowOrigins: string | Array<string>;
    allowMethods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
}> | undefined;
export declare const moduleKey = "__bool:module__";
export declare const Module: (args?: TModuleOptions) => <T extends new (...args: any[]) => {}>(target: T, context?: ClassDecoratorContext) => T;
export default Module;
