import "reflect-metadata";
import { controllerKey, dispatcherKey, guardKey, injectableKey, injectKey, middlewareKey, webSocketKey } from "../keys";
export class Injector {
    _mapper = new Map();
    /**
     *
     * @param constructor
     */
    get(definition) {
        if (this._mapper.has(definition)) {
            return this._mapper.get(definition);
        }
        if (typeof definition !== "function") {
            return undefined;
        }
        const ownMetadataKeys = Reflect.getMetadataKeys(definition);
        if (![injectableKey, controllerKey, middlewareKey, guardKey, dispatcherKey, webSocketKey].some((value) => ownMetadataKeys.includes(value))) {
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }
        // Initialize dependencies injection
        const dependencies = Reflect.getOwnMetadata(injectKey, definition) || [];
        const injections = dependencies.map((dependency) => this.get(dependency));
        const instance = new definition(...injections);
        this._mapper.set(definition, instance);
        return instance;
    }
    /**
     *
     * @param key
     * @param value
     */
    set(key, value) {
        this._mapper.set(key, value);
    }
}
export default Injector;
