import * as Zod from "zod";
export var EArgumentTypes;
(function (EArgumentTypes) {
    EArgumentTypes["requestHeaders"] = "REQUEST_HEADERS";
    EArgumentTypes["body"] = "BODY";
    EArgumentTypes["params"] = "PARAMS";
    EArgumentTypes["param"] = "PARAM";
    EArgumentTypes["query"] = "QUERY";
    EArgumentTypes["request"] = "REQUEST";
    EArgumentTypes["responseHeaders"] = "RESPONSE_HEADERS";
})(EArgumentTypes || (EArgumentTypes = {}));
export const argumentsKey = Symbol.for("__bool:arguments__");
export const RequestHeaders = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const headersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
        headersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.requestHeaders,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(argumentsKey, headersMetadata, target.constructor, methodName);
    };
};
export const Body = (zodSchema, parser) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const bodyMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
        bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.body,
            zodSchema: zodSchema,
            parser: parser
        };
        Reflect.defineMetadata(argumentsKey, bodyMetadata, target.constructor, methodName);
    };
};
export const Params = (zodSchema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: EArgumentTypes.params,
        zodSchema: zodSchema
    };
    Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
};
export const Param = (key, zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.param,
            key: key,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
    };
};
export const Query = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.query,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };
};
export const Request = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.request,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };
};
export const ResponseHeaders = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.responseHeaders,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
    };
};
