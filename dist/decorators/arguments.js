import * as Zod from "zod";
import { argumentsKey, contextArgsKey, paramArgsKey, paramsArgsKey, queryArgsKey, requestArgsKey, requestBodyArgsKey, requestHeaderArgsKey, requestHeadersArgsKey, responseHeadersArgsKey, routeModelArgsKey } from "../keys";
export const RequestHeaders = (schema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const requestHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    requestHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: requestHeadersArgsKey,
        zodSchema: schema
    };
    Reflect.defineMetadata(argumentsKey, requestHeadersMetadata, target.constructor, methodName);
};
export const RequestHeader = (key, schema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const requestHeaderMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    requestHeaderMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: requestHeaderArgsKey,
        key: key,
        zodSchema: schema
    };
    Reflect.defineMetadata(argumentsKey, requestHeaderMetadata, target.constructor, methodName);
};
export const RequestBody = (schema, parser) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const bodyMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: requestBodyArgsKey,
        zodSchema: schema,
        parser: parser
    };
    Reflect.defineMetadata(argumentsKey, bodyMetadata, target.constructor, methodName);
};
export const Params = (schema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: paramsArgsKey,
        zodSchema: schema
    };
    Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
};
export const Param = (key, schema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const paramMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    paramMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: paramArgsKey,
        key: key,
        zodSchema: schema
    };
    Reflect.defineMetadata(argumentsKey, paramMetadata, target.constructor, methodName);
};
export const Query = (schema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    queryMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: queryArgsKey,
        zodSchema: schema
    };
    Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
};
export const Request = (schema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const requestMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    requestMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: requestArgsKey,
        zodSchema: schema
    };
    Reflect.defineMetadata(argumentsKey, requestMetadata, target.constructor, methodName);
};
export const ResponseHeaders = () => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: responseHeadersArgsKey
    };
    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
export const Context = (key) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: contextArgsKey,
        key: key
    };
    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
export const RouteModel = () => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: routeModelArgsKey
    };
    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
