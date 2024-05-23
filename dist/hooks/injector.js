import "reflect-metadata";
import { injectableKey } from "../decorators";
export const Injector = new class {
    _mapper = new Map();
    /**
     *
     * @param constructor
     */
    get(target) {
        if (this._mapper.has(target)) {
            return this._mapper.get(target);
        }
        const ownMetadataKeys = Reflect.getOwnMetadataKeys(target);
        if (!ownMetadataKeys.includes(injectableKey)) {
            console.error("Current metadata keys:", ownMetadataKeys, Reflect.getOwnMetadataKeys(target.constructor));
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }
        // Initialize dependencies injection
        const dependencies = Reflect.getOwnMetadata("design:paramtypes", target) || [];
        const injections = dependencies.map(dependency => Injector.get(dependency));
        const instance = new target(...injections);
        this._mapper.set(target, instance);
        return instance;
    }
};
export default Injector;
