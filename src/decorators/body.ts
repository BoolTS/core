import * as Zod from "zod";

export const controllerRouteBodyKey = "__bool:controller.route::body__";

export const ZodSchema = (schema?: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const bodyMetadata = Reflect.getOwnMetadata(controllerRouteBodyKey, target.constructor, methodName) || {};

        bodyMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };

        Reflect.defineMetadata(controllerRouteBodyKey, bodyMetadata, target.constructor, methodName);
    };
};
