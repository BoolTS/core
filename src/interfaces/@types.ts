import type { BunFile } from "bun";
import type { TArgumentsMetadataCollection, TWebSocketEventHandlerMetadata } from "../decorators";
import type { HttpRouterGroup, THttpRouteModel, WebSocketRouterGroup } from "../entities";
import type { THttpMethods } from "../http";
import type { ICustomValidator } from "./customValidator";
import type { IGuard } from "./guard";
import type { IInterceptor } from "./interceptor";
import type { IMiddleware } from "./middleware";

import { parse as QsParse } from "qs";

export type THandlerMetadata<
    TClass extends Object = Object,
    TFuncName extends keyof TClass = keyof TClass,
    TFunc = TClass[TFuncName]
> = Readonly<{
    class: TClass;
    func: TFunc;
    funcName: TFuncName;
    argumentsMetadata: TArgumentsMetadataCollection;
}>;

export type TStartMiddlewareHandlers = THandlerMetadata<
    IMiddleware,
    "start",
    NonNullable<IMiddleware["start"]>
>[];

export type TEndMiddlewareHandlers = THandlerMetadata<
    IMiddleware,
    "end",
    NonNullable<IMiddleware["end"]>
>[];

export type TGuardHandlers = THandlerMetadata<IGuard, "enforce", NonNullable<IGuard["enforce"]>>[];

export type TOpenInterceptorHandlers = THandlerMetadata<
    IInterceptor,
    "open",
    NonNullable<IInterceptor["open"]>
>[];

export type TCloseInterceptorHandlers = THandlerMetadata<
    IInterceptor,
    "close",
    NonNullable<IInterceptor["close"]>
>[];

export type TControllerHandlers = THttpRouteModel[];

export type TStartMiddlewaresPipe = {
    type: "START_MIDDLEWARES";
    handlers: TStartMiddlewareHandlers;
};

export type TEndMiddlewaresPipe = {
    type: "END_MIDDLEWARES";
    handlers: TEndMiddlewareHandlers;
};

export type TGuardsPipe = {
    type: "GUARDS";
    handlers: TGuardHandlers;
};

export type TOpenInterceptorsPipe = {
    type: "OPEN_INTERCEPTORS";
    handlers: TOpenInterceptorHandlers;
};

export type TCloseInterceptorsPipe = {
    type: "CLOSE_INTERCEPTORS";
    handlers: TCloseInterceptorHandlers;
};

export type TControllerPipe = {
    type: "CONTROLLER";
    handlers?: undefined;
};

export type TPipesEnforcerUnion =
    | TStartMiddlewaresPipe
    | TEndMiddlewaresPipe
    | TGuardsPipe
    | TOpenInterceptorsPipe
    | TCloseInterceptorsPipe
    | TControllerPipe;

export type TParamsType = Record<string, string>;

export type TApplicationOptions<AllowedMethods extends Array<THttpMethods> = Array<THttpMethods>> =
    Required<{
        port: number;
    }> &
        Partial<{
            config: Record<string | symbol, any> | (() => Record<string | symbol, any>);
            idleTimeoutInSeconds: number;
            prefix: string;
            debug: boolean;
            log: Partial<{
                methods: AllowedMethods;
            }>;
            queryParser: Parameters<typeof QsParse>[1];
            static: Required<{
                path: string;
            }> &
                Partial<{
                    headers: TParamsType;
                    cacheTimeInSeconds: number;
                }>;
            cors: Partial<{
                credentials: boolean;
                origins: string | Array<string>;
                methods: Array<THttpMethods>;
                headers: Array<string>;
            }>;
            pipelineStrategy: {
                type: "SIMPLE";
                targets: Partial<{
                    middlewares: "FIFO" | "FILO";
                    interceptors: "FIFO" | "FILO";
                }>;
            };
        }>;

export type TStaticMap = Map<
    string,
    Readonly<{
        expiredAt: Date;
        file: BunFile;
    }>
>;

export type TResolutedOptions = Readonly<{
    allowLogsMethods: Array<THttpMethods>;
    allowOrigins: Array<string>;
    allowMethods: Array<THttpMethods>;
    allowHeaders: Array<string>;
    allowCredentials: boolean;
    staticOption?: Required<{
        path: string;
    }> &
        Partial<{
            headers: TParamsType;
            cacheTimeInSeconds: number;
        }>;
    pipelineStrategy: Required<{
        startMiddlewares: "FIFO" | "FILO";
        endMiddlewares: "FIFO" | "FILO";
        openInterceptors: "FIFO" | "FILO";
        closeInterceptors: "FIFO" | "FILO";
    }>;
}>;

export type TWebSocketUpgradeData = {
    pathname: string;
    method: string;
    query: Record<string, unknown>;
};

export type TPreLaunch =
    | undefined
    | Readonly<{
          startMiddlewareHandlers: TStartMiddlewareHandlers;
          endMiddlewareHandlers: TEndMiddlewareHandlers;
          controllerRouterGroup: HttpRouterGroup;
          webSocketHttpRouterGroup: HttpRouterGroup;
          webSocketRouterGroup: WebSocketRouterGroup;
          webSocketsMap: Map<string, TWebSocketEventHandlerMetadata>;
      }>;

export type TValidator = undefined | ICustomValidator;
