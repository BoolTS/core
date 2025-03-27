import { webSocketCloseCodeArgsKey, webSocketCloseReasonArgsKey, webSocketConnectionArgsKey, webSocketMessageArgsKey, webSocketServerArgsKey } from "../keys";
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
export declare const WebSocketConnection: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketServer: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketCloseCode: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketCloseReason: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketMessage: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
