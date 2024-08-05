import * as Zod from "zod";

export enum EArgumentTypes {
    headers = "HEADERS",
    body = "BODY",
    params = "PARAMS",
    param = "PARAM",
    query = "QUERY",
    request = "REQUEST",
    responseHeaders = "RESPONSE_HEADERS"
}

export type TMetadata =
    | {
          index: number;
          type: EArgumentTypes.headers;
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

export const controllerActionArgumentsKey = Symbol.for("__bool:controller.action::arguments__");

export const Headers = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const headersMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        headersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.headers,
            zodSchema: zodSchema
        } satisfies Extract<
            TMetadata,
            {
                type: EArgumentTypes.headers;
            }
        >;

        Reflect.defineMetadata(controllerActionArgumentsKey, headersMetadata, target.constructor, methodName);
    };
};

export const Body = (zodSchema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const bodyMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.body,
            zodSchema: zodSchema,
            parser: parser
        } satisfies Extract<
            TMetadata,
            {
                type: EArgumentTypes.body;
            }
        >;

        Reflect.defineMetadata(controllerActionArgumentsKey, bodyMetadata, target.constructor, methodName);
    };
};

export const Params = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.params,
            zodSchema: zodSchema
        } satisfies Extract<
            TMetadata,
            {
                type: EArgumentTypes.params;
            }
        >;

        Reflect.defineMetadata(controllerActionArgumentsKey, paramsMetadata, target.constructor, methodName);
    };
};

export const Param = (key: string, zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.param,
            key: key,
            zodSchema: zodSchema
        } satisfies Extract<
            TMetadata,
            {
                type: EArgumentTypes.param;
            }
        >;

        Reflect.defineMetadata(controllerActionArgumentsKey, paramsMetadata, target.constructor, methodName);
    };
};

export const Query = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.params,
            zodSchema: zodSchema
        } satisfies Extract<
            TMetadata,
            {
                type: EArgumentTypes.params;
            }
        >;

        Reflect.defineMetadata(controllerActionArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};

export const Request = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.request,
            zodSchema: zodSchema
        } satisfies Extract<
            TMetadata,
            {
                type: EArgumentTypes.request;
            }
        >;

        Reflect.defineMetadata(controllerActionArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};

export const ResponseHeaders = (zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.responseHeaders,
            zodSchema: zodSchema
        } satisfies Extract<
            TMetadata,
            {
                type: EArgumentTypes.responseHeaders;
            }
        >;

        Reflect.defineMetadata(controllerActionArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};
