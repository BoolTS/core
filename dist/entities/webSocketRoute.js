export class WebSocketRoute {
    eventName;
    metadata;
    constructor({ eventName, metadata }) {
        this.eventName = eventName;
        this.metadata = metadata;
    }
    bind(instance) {
        if (typeof this.metadata.descriptor.value !== "function") {
            return this;
        }
        this.metadata.descriptor.value = this.metadata.descriptor.value.bind(instance);
        return this;
    }
}
