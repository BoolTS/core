import * as Zod from "zod";

export enum EArgumentTypes {
    requestHeaders = "REQUEST_HEADERS",
    body = "BODY",
    params = "PARAMS",
    param = "PARAM",
    query = "QUERY",
    request = "REQUEST",
    responseHeaders = "RESPONSE_HEADERS"
}

export type TArgumentsMetadata =
    | {
          index: number;
          type: EArgumentTypes.requestHeaders;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: EArgumentTypes.body;
          zodSchema?: Zod.Schema;
          parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
      }
    | {
          index: number;
          type: EArgumentTypes.params;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: EArgumentTypes.param;
          key: string;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: EArgumentTypes.query;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: EArgumentTypes.request;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: EArgumentTypes.responseHeaders;
          zodSchema?: Zod.Schema;
      };

export const argumentsKey = Symbol.for("__bool:arguments__");

export const RequestHeaders = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const headersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        headersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.requestHeaders,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.requestHeaders;
            }
        >;

        Reflect.defineMetadata(argumentsKey, headersMetadata, target.constructor, methodName);
    };
};

export const Body = (zodSchema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const bodyMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.body,
            zodSchema: zodSchema,
            parser: parser
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.body;
            }
        >;

        Reflect.defineMetadata(argumentsKey, bodyMetadata, target.constructor, methodName);
    };
};

export const Params =
    (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.params,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.params;
            }
        >;

        Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
    };

export const Param = (key: string, zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.param,
            key: key,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.param;
            }
        >;

        Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
    };
};

export const Query = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.query,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.query;
            }
        >;

        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };
};

export const Request = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.request,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.request;
            }
        >;

        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };
};

export const ResponseHeaders = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.responseHeaders,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.responseHeaders;
            }
        >;

        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };
};
