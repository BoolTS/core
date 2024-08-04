import * as Zod from "zod";

export enum EArgumentTypes {
    headers = "HEADERS",
    body = "BODY",
    params = "PARAMS",
    query = "QUERY"
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
          key?: string;
          zodSchema?: Zod.Schema;
      }
    | {
          index: number;
          type: EArgumentTypes.query;
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

export const Params = (key?: string, zodSchema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};

        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.params,
            key: key,
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
