import type { TConstructor } from "../ultils";

import { containerKey, guardKey, injectableKey, middlewareKey, moduleKey } from "../keys";

type TLoaders<TConfig extends {} = {}> = Record<
    string | symbol,
    (args: { config: TConfig }) => [string | symbol, any] | Promise<[string | symbol, any]>
>;
export type TContainerConfig<TConfig> =
    | TConfig
    | (() => TConfig | Promise<TConfig>)
    | Readonly<{
          key: symbol;
          value: TConfig | (() => TConfig | Promise<TConfig>);
      }>;

export type TContainerOptions<TConfig extends {} = {}> =
    | Partial<{
          loaders: TLoaders<TConfig>;
          config: TContainerConfig<TConfig>;
          modules: Array<TConstructor<unknown>>;
          dependencies: Array<TConstructor<unknown>>;
          middlewares: Array<TConstructor<unknown>>;
          guards: Array<TConstructor<unknown>>;
      }>
    | undefined;

export type TContainerMetadata<TConfig extends {} = {}> =
    | Partial<{
          loaders: TLoaders<TConfig>;
          config: TContainerConfig<TConfig>;
          modules: Array<TConstructor<unknown>>;
          dependencies: Array<TConstructor<unknown>>;
          middlewares: Array<TConstructor<unknown>>;
          guards: Array<TConstructor<unknown>>;
      }>
    | undefined;

export const Container =
    <TConfig extends {} = {}, K extends TConstructor<Object> = TConstructor<Object>>(
        args?: TContainerOptions<TConfig>
    ) =>
    (target: K) => {
        const { modules, middlewares, guards, dependencies } = args || {};

        if (Reflect.hasOwnMetadata(moduleKey, target)) {
            throw new Error(
                `Conflict detected! ${target.name} class cannot be both a Module and a Container.`
            );
        }

        if (modules) {
            for (let i = 0; i < modules.length; i++) {
                if (!Reflect.getOwnMetadataKeys(modules[i]).includes(moduleKey)) {
                    throw Error(`${modules[i].name} is not a module.`);
                }
            }
        }

        if (middlewares) {
            for (let i = 0; i < middlewares.length; i++) {
                if (!Reflect.getOwnMetadataKeys(middlewares[i]).includes(middlewareKey)) {
                    throw Error(`${middlewares[i].name} is not a middleware.`);
                }
            }
        }

        if (middlewares) {
            for (let i = 0; i < middlewares.length; i++) {
                if (!Reflect.getOwnMetadataKeys(middlewares[i]).includes(middlewareKey)) {
                    throw Error(`${middlewares[i].name} is not a middleware.`);
                }
            }
        }

        if (guards) {
            for (let i = 0; i < guards.length; i++) {
                if (!Reflect.getOwnMetadataKeys(guards[i]).includes(guardKey)) {
                    throw Error(`${guards[i].name} is not a guard.`);
                }
            }
        }

        if (dependencies) {
            for (let i = 0; i < dependencies.length; i++) {
                if (!Reflect.getOwnMetadataKeys(dependencies[i]).includes(injectableKey)) {
                    throw Error(`${dependencies[i].name} is not an injectable.`);
                }
            }
        }

        Reflect.defineMetadata(containerKey, args, target);
    };

export default Container;
