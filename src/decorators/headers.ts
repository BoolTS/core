import * as Zod from "zod";

export const controllerRouteHeadersKey = "__bool:controller.route::headers__";

export const ZodSchema = (schema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const headersMetadata = Reflect.getOwnMetadata(controllerRouteHeadersKey, target.constructor, methodName) || {};

        headersMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };

        Reflect.defineMetadata(controllerRouteHeadersKey, headersMetadata, target.constructor, methodName);
    };
};
