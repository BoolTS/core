import type { IModule } from "../interfaces";
type TInstances = Array<new (...args: any[]) => any>;
type TLoaders<TConfig extends {} = {}> = Record<string | symbol, (args: {
    config: TConfig;
}) => [string | symbol, any] | Promise<[string | symbol, any]>>;
export type TModuleConfig<TConfig> = TConfig | (() => TConfig | Promise<TConfig>) | Readonly<{
    key: symbol;
    value: TConfig | (() => TConfig | Promise<TConfig>);
}>;
export type TModuleOptions<TConfig extends {} = {}> = Partial<{
    config: TModuleConfig<TConfig>;
    prefix: string;
    dependencies: TInstances;
    loaders: TLoaders<TConfig>;
    middlewares: TInstances;
    guards: TInstances;
    controllers: TInstances;
    dispatchers: TInstances;
    webSockets: TInstances;
}> | undefined;
export type TModuleMetadata<TConfig extends {} = {}> = Partial<{
    config: TModuleConfig<TConfig>;
    prefix: string;
    dependencies: TInstances;
    loaders: TLoaders<TConfig>;
    middlewares: TInstances;
    guards: TInstances;
    controllers: TInstances;
    dispatchers: TInstances;
    webSockets: TInstances;
}> | undefined;
export declare const Module: <TConfig extends {} = {}>(args?: TModuleOptions<TConfig>) => <T extends {
    new (...args: any[]): IModule;
}>(target: T) => void;
export default Module;
