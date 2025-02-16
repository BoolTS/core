import type { IModule } from "../interfaces";

import { containerKey, dispatcherKey, guardKey, injectableKey, middlewareKey } from "../keys";

type TInstances = Array<new (...args: any[]) => any>;
type TLoaders<TConfig extends {} = {}> = Record<
    string | symbol,
    (args: { config: TConfig }) => [string | symbol, any] | Promise<[string | symbol, any]>
>;

export type TContainerOptions<TConfig extends {} = {}> =
    | (Required<{
          modules: TInstances;
      }> &
          Partial<{
              config: TConfig | (() => TConfig | Promise<TConfig>);
              dependencies: TInstances;
              loaders: TLoaders<TConfig>;
              middlewares: TInstances;
              guards: TInstances;
              dispatchers: TInstances;
          }>)
    | undefined;

export type TContainerMetadata<TConfig extends {} = {}> =
    | (Required<{
          modules: TInstances;
      }> &
          Partial<{
              config: TConfig | ((...args: any[]) => TConfig | Promise<TConfig>);
              dependencies: TInstances;
              loaders: TLoaders<TConfig>;
              middlewares: TInstances;
              guards: TInstances;
              dispatchers: TInstances;
          }>)
    | undefined;

export const Container =
    <TConfig extends {} = {}>(args?: TContainerOptions<TConfig>) =>
    <T extends { new (...args: any[]): IModule }>(target: T) => {
        const { middlewares, guards, dispatchers, dependencies } = args || {};

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

        if (dispatchers) {
            for (let i = 0; i < dispatchers.length; i++) {
                if (!Reflect.getOwnMetadataKeys(dispatchers[i]).includes(dispatcherKey)) {
                    throw Error(`${dispatchers[i].name} is not a dispatcher.`);
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
