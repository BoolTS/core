import type { TConstructor } from "../utils";
import type { TModuleMetadata } from "./module";

import {
    containerKey,
    guardKey,
    injectableKey,
    interceptorKey,
    middlewareKey,
    moduleKey
} from "../constants/keys";

type TLoaders<TConfig extends {} = {}> = Record<
    string | symbol,
    (args: { config: TConfig }) => [string | symbol, unknown] | Promise<[string | symbol, unknown]>
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
          prefix: string;
          loaders: TLoaders<TConfig>;
          config: TContainerConfig<TConfig>;
          modules: Array<TConstructor<unknown>>;
          dependencies: Array<TConstructor<unknown>>;
          middlewares: Array<TConstructor<unknown>>;
          guards: Array<TConstructor<unknown>>;
          interceptors: Array<TConstructor<unknown>>;
      }>
    | undefined;

export type TContainerMetadata<TConfig extends {} = {}> =
    | Partial<{
          prefix: string;
          loaders: TLoaders<TConfig>;
          config: TContainerConfig<TConfig>;
          modules: Array<TConstructor<unknown>>;
          dependencies: Array<TConstructor<unknown>>;
          middlewares: Array<TConstructor<unknown>>;
          guards: Array<TConstructor<unknown>>;
          interceptors: Array<TConstructor<unknown>>;
      }>
    | undefined;

export const Container =
    <TConfig extends {} = {}, K extends TConstructor<Object> = TConstructor<Object>>(
        args?: TContainerOptions<TConfig>
    ) =>
    (target: K) => {
        const { modules, middlewares, guards, interceptors, dependencies } = args || {};

        if (Reflect.hasOwnMetadata(moduleKey, target)) {
            throw new Error(
                `Conflict detected! ${target.name} class cannot be both a Module and a Container.`
            );
        }

        if (modules) {
            const modulePrefixes: string[] = [];

            for (const module of modules) {
                if (!Reflect.getOwnMetadataKeys(module).includes(moduleKey)) {
                    throw Error(`[${module.name}] is not a module.`);
                }

                const moduleMetadata: TModuleMetadata = Reflect.getOwnMetadata(moduleKey, module);

                if (modulePrefixes.includes(moduleMetadata?.prefix || "")) {
                    throw new Error(`Duplicated prefix of module [${module.name}].`);
                }
            }
        }

        if (middlewares) {
            for (const middleware of middlewares) {
                if (!Reflect.getOwnMetadataKeys(middleware).includes(middlewareKey)) {
                    throw Error(`[${middleware.name}] is not a middleware.`);
                }
            }
        }

        if (guards) {
            for (const guard of guards) {
                if (!Reflect.getOwnMetadataKeys(guard).includes(guardKey)) {
                    throw Error(`[${guard.name}] is not a guard.`);
                }
            }
        }

        if (interceptors) {
            for (const interceptor of interceptors) {
                if (!Reflect.getOwnMetadataKeys(interceptor).includes(interceptorKey)) {
                    throw Error(`${interceptor.name} is not a middleware.`);
                }
            }
        }

        if (dependencies) {
            for (const dependency of dependencies) {
                if (!Reflect.getOwnMetadataKeys(dependency).includes(injectableKey)) {
                    throw Error(`${dependency.name} is not an injectable.`);
                }
            }
        }

        Reflect.defineMetadata(containerKey, args, target);
    };

export default Container;
