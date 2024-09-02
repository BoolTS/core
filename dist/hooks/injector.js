import "reflect-metadata";
import { injectableKey, controllerKey, middlewareKey, guardKey, dispatcherKey, injectKey } from "../keys";
export const Injector = new (class {
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
        if (![injectableKey, controllerKey, middlewareKey, guardKey, dispatcherKey].some((value) => ownMetadataKeys.includes(value))) {
            console.error(definition);
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }
        // Initialize dependencies injection
        const dependencies = Reflect.getOwnMetadata(injectKey, definition) || [];
        const injections = dependencies.map((dependency) => Injector.get(dependency));
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
})();
export default Injector;
