import {
    webSocketCloseCodeArgsKey,
    webSocketCloseReasonArgsKey,
    webSocketConnectionArgsKey,
    webSocketEventArgumentsKey,
    webSocketMessageArgsKey,
    webSocketServerArgsKey
} from "../keys";

export type TWebsocketArgumentsMetadata =
    | {
          index: number;
          type: typeof webSocketConnectionArgsKey;
      }
    | {
          index: number;
          type: typeof webSocketMessageArgsKey;
      }
    | {
          index: number;
          type: typeof webSocketServerArgsKey;
      }
    | {
          index: number;
          type: typeof webSocketCloseCodeArgsKey;
      }
    | {
          index: number;
          type: typeof webSocketCloseReasonArgsKey;
      };

export type TWebsocketArgumentsMetadataGroup = Record<string, TWebsocketArgumentsMetadata>;

export const WebSocketConnection =
    <T extends Object>() =>
    (target: T, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const webSocketEventArgumentsMetadata: TWebsocketArgumentsMetadataGroup =
            Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
            {};

        webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: webSocketConnectionArgsKey
        } satisfies Extract<
            TWebsocketArgumentsMetadata,
            {
                type: typeof webSocketConnectionArgsKey;
            }
        >;

        Reflect.defineMetadata(
            webSocketEventArgumentsKey,
            webSocketEventArgumentsMetadata,
            target.constructor,
            methodName
        );
    };

export const WebSocketServer =
    <T extends Object>() =>
    (target: T, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const webSocketEventArgumentsMetadata: TWebsocketArgumentsMetadataGroup =
            Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
            {};

        webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: webSocketServerArgsKey
        } satisfies Extract<
            TWebsocketArgumentsMetadata,
            {
                type: typeof webSocketServerArgsKey;
            }
        >;

        Reflect.defineMetadata(
            webSocketEventArgumentsKey,
            webSocketEventArgumentsMetadata,
            target.constructor,
            methodName
        );
    };

export const WebSocketCloseCode =
    <T extends Object>() =>
    (target: T, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const webSocketEventArgumentsMetadata: TWebsocketArgumentsMetadataGroup =
            Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
            {};

        webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: webSocketCloseCodeArgsKey
        } satisfies Extract<
            TWebsocketArgumentsMetadata,
            {
                type: typeof webSocketCloseCodeArgsKey;
            }
        >;

        Reflect.defineMetadata(
            webSocketEventArgumentsKey,
            webSocketEventArgumentsMetadata,
            target.constructor,
            methodName
        );
    };

export const WebSocketCloseReason =
    <T extends Object>() =>
    (target: T, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const webSocketEventArgumentsMetadata: TWebsocketArgumentsMetadataGroup =
            Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
            {};

        webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: webSocketCloseReasonArgsKey
        } satisfies Extract<
            TWebsocketArgumentsMetadata,
            {
                type: typeof webSocketCloseReasonArgsKey;
            }
        >;

        Reflect.defineMetadata(
            webSocketEventArgumentsKey,
            webSocketEventArgumentsMetadata,
            target.constructor,
            methodName
        );
    };

export const WebSocketMessage =
    <T extends Object>() =>
    (target: T, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const webSocketEventArgumentsMetadata: TWebsocketArgumentsMetadataGroup =
            Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
            {};

        webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: webSocketMessageArgsKey
        } satisfies Extract<
            TWebsocketArgumentsMetadata,
            {
                type: typeof webSocketMessageArgsKey;
            }
        >;

        Reflect.defineMetadata(
            webSocketEventArgumentsKey,
            webSocketEventArgumentsMetadata,
            target.constructor,
            methodName
        );
    };
