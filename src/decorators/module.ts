import type { IModule } from "../interfaces/module";
import { controllerKey } from "./controller";
import { dispatcherKey } from "./dispatcher";
import { guardKey } from "./guard";
import { injectableKey } from "./injectable";
import { middlewareKey } from "./middleware";

type TInstances = Array<new (...args: any[]) => any>;

export type TModuleOptions =
    | Partial<{
          options: Partial<{
              prefix: string;
              allowOrigins: string | Array<string>;
              allowMethods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
          }>;
          dependencies: TInstances;
          controllers: TInstances;
          middlewares: TInstances;
          guards: TInstances;
          beforeDispatchers: TInstances;
          afterDispatchers: TInstances;
      }>
    | undefined;

export type TModuleMetadata =
    | Partial<{
          options: Partial<{
              prefix: string;
              allowOrigins: string | Array<string>;
              allowMethods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
          }>;
          controllers: TInstances;
          dependencies: TInstances;
          middlewares: TInstances;
          guards: TInstances;
          beforeDispatchers: TInstances;
          afterDispatchers: TInstances;
      }>
    | undefined;

export const moduleKey = Symbol.for("__bool:module__");

export const Module =
    (args?: TModuleOptions) =>
    <T extends { new (...args: any[]): IModule }>(target: T) => {
        const { middlewares, guards, beforeDispatchers, controllers, afterDispatchers, dependencies } = args || {};

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

        if (beforeDispatchers) {
            for (let i = 0; i < beforeDispatchers.length; i++) {
                if (!Reflect.getOwnMetadataKeys(beforeDispatchers[i]).includes(dispatcherKey)) {
                    throw Error(`${beforeDispatchers[i].name} is not a dispatcher.`);
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

        if (afterDispatchers) {
            for (let i = 0; i < afterDispatchers.length; i++) {
                if (!Reflect.getOwnMetadataKeys(afterDispatchers[i]).includes(dispatcherKey)) {
                    throw Error(`${afterDispatchers[i].name} is not a dispatcher.`);
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
