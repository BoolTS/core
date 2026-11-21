import type { IContext } from "../interfaces";
import { webSocketCloseCodeArgsKey, webSocketCloseReasonArgsKey, webSocketConnectionArgsKey, webSocketErrorArgsKey, webSocketMessageArgsKey, webSocketServerArgsKey } from "../constants/keys";
export type TWebsocketArgumentsMetadata<TValidationSchema = unknown> = {
    index: number;
    type: typeof webSocketConnectionArgsKey;
} | {
    index: number;
    type: typeof webSocketMessageArgsKey;
    validationSchema?: TValidationSchema | ((context: IContext) => Promise<TValidationSchema> | TValidationSchema);
} | {
    index: number;
    type: typeof webSocketServerArgsKey;
} | {
    index: number;
    type: typeof webSocketCloseCodeArgsKey;
} | {
    index: number;
    type: typeof webSocketCloseReasonArgsKey;
} | {
    index: number;
    type: typeof webSocketErrorArgsKey;
};
export type TWebsocketArgumentsMetadataGroup = Record<string, TWebsocketArgumentsMetadata>;
export declare const WebSocketConnection: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketServer: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketCloseCode: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketCloseReason: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketMessage: <T extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const WebSocketError: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
