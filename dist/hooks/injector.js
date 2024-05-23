import "reflect-metadata";
import { injectableKey } from "../decorators";
export const Injector = new class {
    _mapper = new Map();
    /**
     *
     * @param constructor
     */
    get(classDefinition) {
        if (this._mapper.has(classDefinition.constructor)) {
            return this._mapper.get(classDefinition.constructor);
        }
        const ownMetadataKeys = Reflect.getOwnMetadataKeys(classDefinition.constructor);
        if (!ownMetadataKeys.includes(injectableKey)) {
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }
        // Initialize dependencies injection
        const dependencies = Reflect.getOwnMetadata("design:paramtypes", classDefinition.constructor) || [];
        const injections = dependencies.map(dependency => Injector.get(dependency));
        const instance = classDefinition.constructor(...injections);
        this._mapper.set(classDefinition.constructor, instance);
        return instance;
    }
};
export default Injector;
