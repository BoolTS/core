"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inject = exports.injectKey = void 0;
exports.injectKey = "design:paramtypes";
const Inject = (classDefinition) => {
    return (target, parameterName, parameterIndex) => {
        const designParameterTypes = Reflect.getMetadata(exports.injectKey, target) || [];
        designParameterTypes[parameterIndex] = classDefinition;
        Reflect.defineMetadata(exports.injectKey, designParameterTypes, target);
    };
};
exports.Inject = Inject;
exports.default = exports.Inject;
