import "reflect-metadata";

import { injectableKey } from "../decorators";


interface IInjector {
    get<T>(target: new (...args: any[]) => T): T
}

export const Injector: IInjector = new class {

    private readonly _mapper: Map<Function, any> = new Map();

    /**
     * 
     * @param constructor 
     */
    get<T extends Object>(
        target: T
    ) {
        if (this._mapper.has(target.constructor)) {
            return this._mapper.get(target.constructor) as T;
        }

        const ownMetadataKeys = Reflect.getOwnMetadataKeys(target.constructor);

        if (!ownMetadataKeys.includes(injectableKey)) {
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }

        // Initialize dependencies injection
        const dependencies: any[] = Reflect.getOwnMetadata("design:paramtypes", target) || [];
        const injections: any[] = dependencies.map(dependency => Injector.get(dependency));
        const instance = target.constructor(...injections);

        this._mapper.set(target.constructor, instance);

        return instance;
    }

}

export default Injector;
