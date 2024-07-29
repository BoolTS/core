import * as Zod from "zod";

export const controllerRouteQueryKey = "__bool:controller.route::query__";

export const ZodSchema = (schema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const queryMetadata = Reflect.getOwnMetadata(controllerRouteQueryKey, target.constructor, methodName) || {};

        queryMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };

        Reflect.defineMetadata(controllerRouteQueryKey, queryMetadata, target.constructor, methodName);
    };
};
