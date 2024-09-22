import type { IModule } from "../interfaces/module";
import { controllerKey, dispatcherKey, guardKey, injectableKey, middlewareKey, moduleKey } from "../keys";

type TInstances = Array<new (...args: any[]) => any>;
type TLoaders<TConfig extends {} = {}> = Record<
    string | symbol,
    (args: { config: TConfig }) => [string | symbol, any] | Promise<[string | symbol, any]>
>;

export type TModuleOptions<TConfig extends {} = {}> =
    | Partial<{
          config: TConfig | (() => TConfig | Promise<TConfig>);
          prefix: string;
          dependencies: TInstances;
          loaders: TLoaders<TConfig>;
          middlewares: TInstances;
          guards: TInstances;
          controllers: TInstances;
          dispatchers: TInstances;
      }>
    | undefined;

export type TModuleMetadata<TConfig extends {} = {}> =
    | Partial<{
          config: TConfig | ((...args: any[]) => TConfig | Promise<TConfig>);
          prefix: string;
          dependencies: TInstances;
          loaders: TLoaders<TConfig>;
          middlewares: TInstances;
          guards: TInstances;
          controllers: TInstances;
          dispatchers: TInstances;
      }>
    | undefined;

export const Module =
    <TConfig extends {} = {}>(args?: TModuleOptions<TConfig>) =>
    <T extends { new (...args: any[]): IModule }>(target: T) => {
        const { middlewares, guards, dispatchers, controllers, dependencies } = args || {};

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

        if (controllers) {
            for (let i = 0; i < controllers.length; i++) {
                if (!Reflect.getOwnMetadataKeys(controllers[i]).includes(controllerKey)) {
                    throw Error(`${controllers[i].name} is not a controller.`);
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

        Reflect.defineMetadata(moduleKey, args, target);
    };

export default Module;
