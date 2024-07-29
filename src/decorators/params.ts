import * as Zod from "zod";

export const controllerRouteParmasKey = "__bool:controller.route::params__";

export const ZodSchema = (schema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const paramsMetadata = Reflect.getOwnMetadata(controllerRouteParmasKey, target.constructor, methodName) || {};

        paramsMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };

        Reflect.defineMetadata(controllerRouteParmasKey, paramsMetadata, target.constructor, methodName);
    };
};
