import type { IModule } from "../interfaces";
type TInstances = Array<new (...args: any[]) => any>;
type TLoaders<TConfig extends {} = {}> = Record<string | symbol, (args: {
    config: TConfig;
}) => [string | symbol, any] | Promise<[string | symbol, any]>>;
export type TContainerOptions<TConfig extends {} = {}> = (Required<{
    modules: TInstances;
}> & Partial<{
    config: TConfig | (() => TConfig | Promise<TConfig>);
    dependencies: TInstances;
    loaders: TLoaders<TConfig>;
    middlewares: TInstances;
    guards: TInstances;
    dispatchers: TInstances;
}>) | undefined;
export type TContainerMetadata<TConfig extends {} = {}> = (Required<{
    modules: TInstances;
}> & Partial<{
    config: TConfig | ((...args: any[]) => TConfig | Promise<TConfig>);
    dependencies: TInstances;
    loaders: TLoaders<TConfig>;
    middlewares: TInstances;
    guards: TInstances;
    dispatchers: TInstances;
}>) | undefined;
export declare const Container: <TConfig extends {} = {}>(args?: TContainerOptions<TConfig>) => <T extends {
    new (...args: any[]): IModule;
}>(target: T) => void;
export default Container;
