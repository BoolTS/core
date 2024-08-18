import "reflect-metadata";

import { controllerKey, dispatcherKey, guardKey, injectableKey, injectKey, middlewareKey } from "../decorators";

interface IInjector {
    get<T>(classDefinition: { new (...args: any[]): T }): T;
}

export const Injector: IInjector = new (class {
    private readonly _mapper: Map<Function, any> = new Map();

    /**
     *
     * @param constructor
     */
    get<T>(classDefinition: { new (...args: any[]): T }) {
        if (this._mapper.has(classDefinition)) {
            return this._mapper.get(classDefinition) as T;
        }

        const ownMetadataKeys = Reflect.getMetadataKeys(classDefinition);

        if (
            ![injectableKey, controllerKey, middlewareKey, guardKey, dispatcherKey].some((value) =>
                ownMetadataKeys.includes(value)
            )
        ) {
            console.error(classDefinition);
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }

        // Initialize dependencies injection
        const dependencies: any[] = Reflect.getOwnMetadata(injectKey, classDefinition) || [];
        const injections: any[] = dependencies.map((dependency) => Injector.get(dependency));
        const instance = new classDefinition(...injections);

        this._mapper.set(classDefinition, instance);

        return instance;
    }
})();

export default Injector;
