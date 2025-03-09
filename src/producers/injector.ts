import "reflect-metadata";
import {
    controllerKey,
    dispatcherKey,
    guardKey,
    injectableKey,
    injectKey,
    middlewareKey,
    webSocketKey
} from "../keys";

type TDefinition<T = any> = { new (...args: any[]): T } | string | symbol;

interface IInjector {
    set(key: TDefinition, value: any): void;
    get<T>(definition: TDefinition): T;
}

export class Injector implements IInjector {
    private readonly _mapper: Map<Function | string | symbol, any> = new Map();

    /**
     *
     * @param injectors
     */
    constructor(...injectors: Array<Injector>) {
        injectors.forEach((injector) => {
            injector.entries.forEach(([key, value]) => {
                this._mapper.set(key, value);
            });
        });
    }

    /**
     *
     * @param definition
     */
    get<T>(definition: TDefinition) {
        if (this._mapper.has(definition)) {
            return this._mapper.get(definition) as T;
        }

        if (typeof definition !== "function") {
            return undefined;
        }

        const ownMetadataKeys = Reflect.getMetadataKeys(definition);

        if (
            ![
                injectableKey,
                controllerKey,
                middlewareKey,
                guardKey,
                dispatcherKey,
                webSocketKey
            ].some((value) => ownMetadataKeys.includes(value))
        ) {
            throw Error(
                "Missing dependency declaration, please check @Injectable() used on dependency(ies)."
            );
        }

        // Initialize dependencies injection
        const dependencies: any[] = Reflect.getOwnMetadata(injectKey, definition) || [];
        const injections: any[] = dependencies.map((dependency) => this.get(dependency));
        const instance = new definition(...injections);

        this._mapper.set(definition, instance);

        return instance;
    }

    /**
     *
     * @param key
     * @param value
     */
    set(key: TDefinition, value: any) {
        if (this._mapper.has(key)) {
            throw Error(`${String(key)} already exists in injector collection.`);
        }

        this._mapper.set(key, value);
    }

    get entries() {
        return [...this._mapper.entries()];
    }
}

export default Injector;
