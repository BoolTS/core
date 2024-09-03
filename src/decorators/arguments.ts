import * as Zod from "zod";
import {
    argumentsKey,
    bodyArgsKey,
    contextArgsKey,
    paramArgsKey,
    paramsArgsKey,
    queryArgsKey,
    requestArgsKey,
    requestHeadersArgsKey,
    responseHeadersArgsKey
} from "../keys";

export type TArgumentsMetadata =
    | {
          index: number;
          type: typeof requestHeadersArgsKey;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof bodyArgsKey;
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
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: typeof contextArgsKey;
          injectKey?: symbol;
      };

export const RequestHeaders =
    (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const requestHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        requestHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestHeadersArgsKey,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestHeadersArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, requestHeadersMetadata, target.constructor, methodName);
    };

export const Body =
    (zodSchema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const bodyMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: bodyArgsKey,
            zodSchema: zodSchema,
            parser: parser
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof bodyArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, bodyMetadata, target.constructor, methodName);
    };

export const Params =
    (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: paramsArgsKey,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof paramsArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
    };

export const Param =
    (key: string, zodSchema?: Zod.Schema) =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        paramMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: paramArgsKey,
            key: key,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof paramArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, paramMetadata, target.constructor, methodName);
    };

export const Query =
    (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: queryArgsKey,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof queryArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };

export const Request =
    (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const requestMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        requestMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestArgsKey,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, requestMetadata, target.constructor, methodName);
    };

export const ResponseHeaders =
    (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: responseHeadersArgsKey,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof responseHeadersArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
    };

export const Context =
    (injectKey?: symbol) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: contextArgsKey,
            injectKey: injectKey
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof contextArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
    };
