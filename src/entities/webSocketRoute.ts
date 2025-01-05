import type { TWebSocketEventHandlerMetadata } from "../decorators";

export class WebSocketRoute {
    public readonly eventName: string;
    public readonly metadata: TWebSocketEventHandlerMetadata;

    constructor({
        eventName,
        metadata
    }: {
        eventName: string;
        metadata: TWebSocketEventHandlerMetadata;
    }) {
        this.eventName = eventName;
        this.metadata = metadata;
    }

    public bind(instance: Object): ThisType<WebSocketRoute> {
        if (typeof this.metadata.descriptor.value !== "function") {
            return this;
        }

        this.metadata.descriptor.value = this.metadata.descriptor.value.bind(instance);

        return this;
    }
}
