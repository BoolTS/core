import type { IModule } from "../interfaces";

import { containerKey, guardKey, injectableKey, middlewareKey, moduleKey } from "../keys";

type TInstances = Array<new (...args: any[]) => any>;
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
          config: TContainerConfig<TConfig>;
          modules: TInstances;
          dependencies: TInstances;
          loaders: TLoaders<TConfig>;
          middlewares: TInstances;
          guards: TInstances;
      }>
    | undefined;

export type TContainerMetadata<TConfig extends {} = {}> =
    | Partial<{
          modules: TInstances;
          config: TContainerConfig<TConfig>;
          dependencies: TInstances;
          loaders: TLoaders<TConfig>;
          middlewares: TInstances;
          guards: TInstances;
      }>
    | undefined;

export const Container =
    <TConfig extends {} = {}>(args?: TContainerOptions<TConfig>) =>
    <T extends { new (...args: any[]): IModule }>(target: T) => {
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
