import type { TConstructor } from "../ultils";
type TLoaders<TConfig extends {} = {}> = Record<string | symbol, (args: {
    config: TConfig;
}) => [string | symbol, any] | Promise<[string | symbol, any]>>;
export type TContainerConfig<TConfig> = TConfig | (() => TConfig | Promise<TConfig>) | Readonly<{
    key: symbol;
    value: TConfig | (() => TConfig | Promise<TConfig>);
}>;
export type TContainerOptions<TConfig extends {} = {}> = Partial<{
    loaders: TLoaders<TConfig>;
    config: TContainerConfig<TConfig>;
    modules: Array<TConstructor<unknown>>;
    dependencies: Array<TConstructor<unknown>>;
    middlewares: Array<TConstructor<unknown>>;
    guards: Array<TConstructor<unknown>>;
}> | undefined;
export type TContainerMetadata<TConfig extends {} = {}> = Partial<{
    loaders: TLoaders<TConfig>;
    config: TContainerConfig<TConfig>;
    modules: Array<TConstructor<unknown>>;
    dependencies: Array<TConstructor<unknown>>;
    middlewares: Array<TConstructor<unknown>>;
    guards: Array<TConstructor<unknown>>;
}> | undefined;
export declare const Container: <TConfig extends {} = {}, K extends TConstructor<Object> = TConstructor<Object>>(args?: TContainerOptions<TConfig>) => (target: K) => void;
export default Container;
