import * as Zod from "zod";
import {
    argumentsKey,
    contextArgsKey,
    httpServerArgsKey,
    paramArgsKey,
    paramsArgsKey,
    queryArgsKey,
    requestArgsKey,
    requestBodyArgsKey,
    requestHeaderArgsKey,
    requestHeadersArgsKey,
    responseHeadersArgsKey,
    routeModelArgsKey
} from "../keys";

export type TArgumentsMetadata =
    | {
          index: number;
          type: typeof requestHeadersArgsKey;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof requestHeaderArgsKey;
          key: string;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof requestBodyArgsKey;
          zodSchema?: Zod.Schema;
          parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
      }
    | {
          index: number;
          type: typeof paramsArgsKey;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof paramArgsKey;
          key: string;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof queryArgsKey;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof requestArgsKey;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof responseHeadersArgsKey;
      }
    | {
          index: number;
          type: typeof contextArgsKey;
          key?: symbol;
      }
    | {
          index: number;
          type: typeof routeModelArgsKey;
      }
    | {
          index: number;
          type: typeof httpServerArgsKey;
      };

export type TArgumentsMetadataCollection = Record<`argumentIndexes.${number}`, TArgumentsMetadata>;

export const RequestHeaders =
    (schema?: Zod.Schema) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestHeadersArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestHeadersArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const RequestHeader =
    (key: string, schema?: Zod.Schema) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestHeaderArgsKey,
            key: key,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestHeaderArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const RequestBody =
    (schema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestBodyArgsKey,
            zodSchema: schema,
            parser: parser
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestBodyArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Params =
    (schema?: Zod.Schema) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: paramsArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof paramsArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Param =
    (key: string, schema?: Zod.Schema) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: paramArgsKey,
            key: key,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof paramArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Query =
    (schema?: Zod.Schema) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: queryArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof queryArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Request =
    (schema?: Zod.Schema) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const ResponseHeaders =
    () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: responseHeadersArgsKey
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof responseHeadersArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Context =
    (key?: symbol) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: contextArgsKey,
            key: key
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof contextArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const RouteModel =
    () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: routeModelArgsKey
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof routeModelArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const HttpServer =
    () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: httpServerArgsKey
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof httpServerArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };
