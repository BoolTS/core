import "reflect-metadata";
import { injectableKey, injectKey } from "../decorators";
export const Injector = new class {
    _mapper = new Map();
    /**
     *
     * @param constructor
     */
    get(classDefinition) {
        if (this._mapper.has(classDefinition)) {
            return this._mapper.get(classDefinition);
        }
        const ownMetadataKeys = Reflect.getMetadataKeys(classDefinition);
        if (!ownMetadataKeys.includes(injectableKey)) {
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }
        // Initialize dependencies injection
        const dependencies = Reflect.getOwnMetadata(injectKey, classDefinition) || [];
        const injections = dependencies.map(dependency => Injector.get(dependency));
        const instance = new classDefinition(...injections);
        this._mapper.set(classDefinition, instance);
        return instance;
    }
};
export default Injector;
