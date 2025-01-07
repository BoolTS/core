import type { TWebSocketEventHandlerMetadata } from "../decorators";

export class WebSocketRoute {
    public readonly eventName: string;
    public readonly metadata: TWebSocketEventHandlerMetadata;
    private _context: Object | undefined = undefined;

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
        this._context = instance;

        return this;
    }

    public execute(): Readonly<TWebSocketEventHandlerMetadata> {
        return Object.freeze({
            methodName: this.metadata.methodName,
            descriptor:
                !this._context || typeof this.metadata.descriptor.value !== "function"
                    ? this.metadata.descriptor
                    : this.metadata.descriptor.value.bind(this._context),
            arguments: this.metadata.arguments
        });
    }
}
