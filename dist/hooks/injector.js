"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
require("reflect-metadata");
const decorators_1 = require("../decorators");
exports.Injector = new class {
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
        if (!ownMetadataKeys.includes(decorators_1.injectableKey)) {
            throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
        }
        // Initialize dependencies injection
        const dependencies = Reflect.getOwnMetadata(decorators_1.injectKey, classDefinition) || [];
        const injections = dependencies.map(dependency => exports.Injector.get(dependency));
        const instance = new classDefinition(...injections);
        this._mapper.set(classDefinition, instance);
        return instance;
    }
};
exports.default = exports.Injector;
