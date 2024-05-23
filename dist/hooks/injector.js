import "reflect-metadata";
import { injectableKey } from "../decorators";
export const Injector = new class {
    _mapper = new Map();
    /**
     *
     * @param constructor
     */
    get(target) {
        if (this._mapper.has(target.constructor)) {
            return this._mapper.get(target.constructor);
        }
        const ownMetadataKeys = Reflect.getOwnMetadataKeys(target.constructor);
        if (!ownMetadataKeys.includes(injectableKey)) {
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }
        // Initialize dependencies injection
        const dependencies = Reflect.getOwnMetadata("design:paramtypes", target) || [];
        const injections = dependencies.map(dependency => Injector.get(dependency));
        const instance = target.constructor(...injections);
        this._mapper.set(target.constructor, instance);
        return instance;
    }
};
export default Injector;
