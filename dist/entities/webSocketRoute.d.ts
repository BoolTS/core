import type { TWebSocketEventHandlerMetadata } from "../decorators";
export declare class WebSocketRoute {
    readonly eventName: string;
    readonly metadata: TWebSocketEventHandlerMetadata;
    constructor({ eventName, metadata }: {
        eventName: string;
        metadata: TWebSocketEventHandlerMetadata;
    });
    bind(instance: Object): ThisType<WebSocketRoute>;
}
