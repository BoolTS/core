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
    get<T>(
        target: new (...args: any[]) => T
    ) {
        if (this._mapper.has(target)) {
            return this._mapper.get(target) as T;
        }

        const ownMetadataKeys = Reflect.getOwnMetadataKeys(target);

        if (!ownMetadataKeys.includes(injectableKey)) {
            console.error("Current metadata keys:", ownMetadataKeys);
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }

        // Initialize dependencies injection
        const dependencies: any[] = Reflect.getOwnMetadata("design:paramtypes", target) || [];
        const injections: any[] = dependencies.map(dependency => Injector.get(dependency));
        const instance = new target(...injections);

        this._mapper.set(target, instance);

        return instance;
    }

}

export default Injector;
