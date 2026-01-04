import { webSocketCloseCodeArgsKey, webSocketCloseReasonArgsKey, webSocketConnectionArgsKey, webSocketMessageArgsKey, webSocketServerArgsKey } from "../constants/keys";
export type TWebsocketArgumentsMetadata = {
    index: number;
    type: typeof webSocketConnectionArgsKey;
} | {
    index: number;
    type: typeof webSocketMessageArgsKey;
} | {
    index: number;
    type: typeof webSocketServerArgsKey;
} | {
    index: number;
    type: typeof webSocketCloseCodeArgsKey;
} | {
    index: number;
    type: typeof webSocketCloseReasonArgsKey;
};
export type TWebsocketArgumentsMetadataGroup = Record<string, TWebsocketArgumentsMetadata>;
export declare const WebSocketConnection: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketServer: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketCloseCode: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketCloseReason: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketMessage: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
