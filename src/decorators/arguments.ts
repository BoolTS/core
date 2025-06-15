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

export type TArgumentsMetadata<TValidationSchema = unknown> =
    | {
          index: number;
          type: typeof requestHeadersArgsKey;
          validationSchema?: TValidationSchema;
      }
    | {
          index: number;
          type: typeof requestHeaderArgsKey;
          key: string;
          validationSchema?: TValidationSchema;
      }
    | {
          index: number;
          type: typeof requestBodyArgsKey;
          validationSchema?: TValidationSchema;
          parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
      }
    | {
          index: number;
          type: typeof paramsArgsKey;
          validationSchema?: TValidationSchema;
      }
    | {
          index: number;
          type: typeof paramArgsKey;
          key: string;
          validationSchema?: TValidationSchema;
      }
    | {
          index: number;
          type: typeof queryArgsKey;
          validationSchema?: TValidationSchema;
      }
    | {
          index: number;
          type: typeof requestArgsKey;
          validationSchema?: TValidationSchema;
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
    <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestHeadersArgsKey,
            validationSchema: validationSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestHeadersArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const RequestHeader =
    <TTarget extends Object, TValidationSchema = unknown>(
        key: string,
        validationSchema?: TValidationSchema
    ) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestHeaderArgsKey,
            key: key,
            validationSchema: validationSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestHeaderArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const RequestBody =
    <TTarget extends Object, TValidationSchema = unknown>(
        validationSchema?: TValidationSchema,
        parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text"
    ) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestBodyArgsKey,
            validationSchema: validationSchema,
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
    <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: paramsArgsKey,
            validationSchema: validationSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof paramsArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Param =
    <TTarget extends Object, TValidationSchema = unknown>(
        key: string,
        validationSchema?: TValidationSchema
    ) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: paramArgsKey,
            key: key,
            validationSchema: validationSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof paramArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Query =
    <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: queryArgsKey,
            validationSchema: validationSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof queryArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const Request =
    <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const metadata: TArgumentsMetadataCollection =
            Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};

        metadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: requestArgsKey,
            validationSchema: validationSchema
        } satisfies Extract<
            TArgumentsMetadata,
            {
                type: typeof requestArgsKey;
            }
        >;

        Reflect.defineMetadata(argumentsKey, metadata, target.constructor, methodName);
    };

export const ResponseHeaders =
    <TTarget extends Object>() =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
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
    <TTarget extends Object>(key?: symbol) =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
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
    <TTarget extends Object>() =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
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
    <TTarget extends Object>() =>
    (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => {
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
