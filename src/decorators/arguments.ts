import * as Zod from "zod";
import {
    argumentsKey,
    bodyArgsKey,
    contextArgsKey,
    paramArgsKey,
    paramsArgsKey,
    queryArgsKey,
    requestArgsKey,
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
      }
    | {
          index: number;
          type: typeof contextArgsKey;
          key?: symbol;
      }
    | {
          index: number;
          type: typeof routeModelArgsKey;
      };

export const RequestHeaders =
    (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const requestHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        requestHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestHeadersArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestHeadersArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, requestHeadersMetadata, target.constructor, methodName);
    };

export const RequestHeader =
    (key: string, schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const requestHeaderMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        requestHeaderMetadata[`argumentIndexes.${parameterIndex}`] = {
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

        Reflect.defineMetadata(argumentsKey, requestHeaderMetadata, target.constructor, methodName);
    };

export const Body =
    (schema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") =>
    (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const bodyMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: bodyArgsKey,
            zodSchema: schema,
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
    (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: paramsArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof paramsArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
    };

export const Param =
    (key: string, schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        paramMetadata[`argumentIndexes.${parameterIndex}`] = {
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

        Reflect.defineMetadata(argumentsKey, paramMetadata, target.constructor, methodName);
    };

export const Query =
    (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: queryArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof queryArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };

export const Request =
    (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const requestMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        requestMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestArgsKey,
            zodSchema: schema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, requestMetadata, target.constructor, methodName);
    };

export const ResponseHeaders = () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
    if (!methodName) {
        return;
    }

    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: responseHeadersArgsKey
    } satisfies Extract<
        TArgumentsMetadata,
        {
            type: typeof responseHeadersArgsKey;
        }
    >;

    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};

export const Context = (key?: symbol) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
    if (!methodName) {
        return;
    }

    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: contextArgsKey,
        key: key
    } satisfies Extract<
        TArgumentsMetadata,
        {
            type: typeof contextArgsKey;
        }
    >;

    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};

export const RouteModel = () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
    if (!methodName) {
        return;
    }

    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: routeModelArgsKey
    } satisfies Extract<
        TArgumentsMetadata,
        {
            type: typeof routeModelArgsKey;
        }
    >;

    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
