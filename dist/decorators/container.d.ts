import type { TConstructor } from "../ultils";
type TInstances = Array<new (...args: any[]) => any>;
type TLoaders<TConfig extends {} = {}> = Record<string | symbol, (args: {
    config: TConfig;
}) => [string | symbol, any] | Promise<[string | symbol, any]>>;
export type TContainerConfig<TConfig> = TConfig | (() => TConfig | Promise<TConfig>) | Readonly<{
    key: symbol;
    value: TConfig | (() => TConfig | Promise<TConfig>);
}>;
export type TContainerOptions<TConfig extends {} = {}> = Partial<{
    config: TContainerConfig<TConfig>;
    modules: TInstances;
    dependencies: TInstances;
    loaders: TLoaders<TConfig>;
    middlewares: TInstances;
    guards: TInstances;
}> | undefined;
export type TContainerMetadata<TConfig extends {} = {}> = Partial<{
    modules: TInstances;
    config: TContainerConfig<TConfig>;
    dependencies: TInstances;
    loaders: TLoaders<TConfig>;
    middlewares: TInstances;
    guards: TInstances;
}> | undefined;
export declare const Container: <TConfig extends {} = {}, K extends TConstructor<Object> = TConstructor<Object>>(args?: TContainerOptions<TConfig>) => (target: K) => void;
export default Container;
