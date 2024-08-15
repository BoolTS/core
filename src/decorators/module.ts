import type {} from "./controller";
import { injectableKey } from "./injectable";

type TInstances = Array<new (...args: any[]) => unknown>;

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
    <T extends { new (...args: any[]): {} }>(target: T) => {
        Reflect.defineMetadata(moduleKey, args, target);
    };

export default Module;
