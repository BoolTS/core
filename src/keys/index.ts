const prefix = "__boolTypescriptCore";

export const argumentsKey = Symbol.for(`__${prefix}:arguments__`);
export const webSocketEventArgumentsKey = Symbol.for(`__${prefix}:webSocketEventArguments__`);
export const configKey = Symbol.for(`__${prefix}:config__`);
export const controllerKey = Symbol.for(`__${prefix}:controller__`);
export const interceptorKey = Symbol.for(`__${prefix}:interceptor__`);
export const guardKey = Symbol.for(`__${prefix}:guard__`);
export const controllerHttpKey = Symbol.for(`__${prefix}:controller.http__`);
export const injectKey = Symbol.for(`__${prefix}:inject__`);
export const injectableKey = Symbol.for(`__${prefix}:injectable__`);
export const middlewareKey = Symbol.for(`__${prefix}:middleware__`);
export const moduleKey = Symbol.for(`__${prefix}:module__`);
export const containerKey = Symbol.for(`__${prefix}:container__`);
export const zodSchemaKey = Symbol.for(`__${prefix}:zodSchema__`);
export const webSocketKey = Symbol.for(`__${prefix}:webSocket__`);
export const webSocketEventKey = Symbol.for(`__${prefix}:webSocket:event__`);

export const webSocketServerArgsKey = Symbol.for(`__${prefix}:webSocketArguments:server__`);
export const webSocketConnectionArgsKey = Symbol.for(`__${prefix}:webSocketArguments:connection__`);
export const webSocketMessageArgsKey = Symbol.for(`__${prefix}:webSocketArguments:message__`);
export const webSocketCloseCodeArgsKey = Symbol.for(`__${prefix}:webSocketArguments:closeCode__`);
export const webSocketCloseReasonArgsKey = Symbol.for(
    `__${prefix}:webSocketArguments:closeReason__`
);

export const httpServerArgsKey = Symbol.for(`__${prefix}:httpArguments:server__`);
export const requestHeadersArgsKey = Symbol.for(`__${prefix}:httpArguments:requestHeaders__`);
export const requestHeaderArgsKey = Symbol.for(`__${prefix}:httpArguments:requestHeader__`);
export const requestBodyArgsKey = Symbol.for(`__${prefix}:httpArguments:requestBody__`);
export const paramsArgsKey = Symbol.for(`__${prefix}:httpArguments:params__`);
export const paramArgsKey = Symbol.for(`__${prefix}:httpArguments:param__`);
export const queryArgsKey = Symbol.for(`__${prefix}:httpArguments:query__`);
export const requestArgsKey = Symbol.for(`__${prefix}:httpArguments:request__`);
export const responseHeadersArgsKey = Symbol.for(`__${prefix}:httpArguments:responseHeaders__`);
export const contextArgsKey = Symbol.for(`__${prefix}:httpArguments:context__`);
export const routeModelArgsKey = Symbol.for(`__${prefix}:httpArguments:routeModel__`);
export const responseBodyArgsKey = Symbol.for(`__${prefix}:httpArguments:responseBody__`);
export const responseStatusArgsKey = Symbol.for(`__${prefix}:httpArguments:responseStatus__`);
export const responseStatusTextArgsKey = Symbol.for(
    `__${prefix}:httpArguments:responseStatusText__`
);
