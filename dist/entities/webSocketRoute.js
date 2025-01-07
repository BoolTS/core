export class WebSocketRoute {
    eventName;
    metadata;
    _context = undefined;
    constructor({ eventName, metadata }) {
        this.eventName = eventName;
        this.metadata = metadata;
    }
    bind(instance) {
        this._context = instance;
        return this;
    }
    execute() {
        return Object.freeze({
            methodName: this.metadata.methodName,
            descriptor: !this._context || typeof this.metadata.descriptor.value !== "function"
                ? this.metadata.descriptor
                : this.metadata.descriptor.value.bind(this._context),
            arguments: this.metadata.arguments
        });
    }
}
