import type { TConstructor } from "../ultils";

import {
    containerKey,
    controllerKey,
    guardKey,
    injectableKey,
    interceptorKey,
    middlewareKey,
    moduleKey,
    webSocketKey
} from "../keys";

type TInstances = Array<new (...args: any[]) => any>;
type TLoaders<TConfig extends {} = {}> = Record<
    string | symbol,
    (args: { config: TConfig }) => [string | symbol, unknown] | Promise<[string | symbol, unknown]>
>;
export type TModuleConfig<TConfig> =
    | TConfig
    | (() => TConfig | Promise<TConfig>)
    | Readonly<{
          key: symbol;
          value: TConfig | (() => TConfig | Promise<TConfig>);
      }>;

export type TModuleOptions<TConfig extends {} = {}> =
    | Partial<{
          config: TModuleConfig<TConfig>;
          prefix: string;
          dependencies: TInstances;
          loaders: TLoaders<TConfig>;
          middlewares: TInstances;
          guards: TInstances;
          controllers: TInstances;
          interceptors: TInstances;
          webSockets: TInstances;
      }>
    | undefined;

export type TModuleMetadata<TConfig extends {} = {}> =
    | Partial<{
          config: TModuleConfig<TConfig>;
          prefix: string;
          dependencies: TInstances;
          loaders: TLoaders<TConfig>;
          middlewares: TInstances;
          guards: TInstances;
          controllers: TInstances;
          interceptors: TInstances;
          webSockets: TInstances;
      }>
    | undefined;

export const Module =
    <TConfig extends {} = {}, K extends TConstructor<Object> = TConstructor<Object>>(
        args?: TModuleOptions<TConfig>
    ) =>
    (target: K) => {
        if (Reflect.hasOwnMetadata(containerKey, target)) {
            throw new Error(
                `Conflict detected! ${target.name} class cannot be both a Module and a Container.`
            );
        }

        const { middlewares, guards, interceptors, controllers, dependencies, webSockets } =
            args || {};

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

        if (interceptors) {
            for (let i = 0; i < interceptors.length; i++) {
                if (!Reflect.getOwnMetadataKeys(interceptors[i]).includes(interceptorKey)) {
                    throw Error(`${interceptors[i].name} is not a interceptor.`);
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

        if (webSockets) {
            for (let i = 0; i < webSockets.length; i++) {
                if (!Reflect.getOwnMetadataKeys(webSockets[i]).includes(webSocketKey)) {
                    throw Error(`${webSockets[i].name} is not a websocket gateway.`);
                }
            }
        }

        Reflect.defineMetadata(moduleKey, args, target);
    };

export default Module;
