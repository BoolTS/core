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

export const httpArgumentsKey = Symbol.for("__bool:controller.http::arguments__");

export const RequestHeaders = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const headersMetadata = Reflect.getOwnMetadata(httpArgumentsKey, target.constructor, methodName) || {};

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

        Reflect.defineMetadata(httpArgumentsKey, headersMetadata, target.constructor, methodName);
    };
};

export const Body = (zodSchema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const bodyMetadata = Reflect.getOwnMetadata(httpArgumentsKey, target.constructor, methodName) || {};

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

        Reflect.defineMetadata(httpArgumentsKey, bodyMetadata, target.constructor, methodName);
    };
};

export const Params =
    (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(httpArgumentsKey, target.constructor, methodName) || {};

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

        Reflect.defineMetadata(httpArgumentsKey, paramsMetadata, target.constructor, methodName);
    };

export const Param = (key: string, zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(httpArgumentsKey, target.constructor, methodName) || {};

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

        Reflect.defineMetadata(httpArgumentsKey, paramsMetadata, target.constructor, methodName);
    };
};

export const Query = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(httpArgumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.params,
            zodSchema: zodSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: EArgumentTypes.params;
            }
        >;

        Reflect.defineMetadata(httpArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};

export const Request = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(httpArgumentsKey, target.constructor, methodName) || {};

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

        Reflect.defineMetadata(httpArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};

export const ResponseHeaders = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(httpArgumentsKey, target.constructor, methodName) || {};

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

        Reflect.defineMetadata(httpArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};
