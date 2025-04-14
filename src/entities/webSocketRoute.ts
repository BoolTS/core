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
        if (this._context && typeof this.metadata.descriptor.value === "function") {
            this.metadata.descriptor.value = this.metadata.descriptor.value.bind(this._context);
        }

        return Object.freeze({
            methodName: this.metadata.methodName,
            descriptor: this.metadata.descriptor,
            arguments: this.metadata.arguments
        });
    }
}
