"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = exports.injectableKey = void 0;
exports.injectableKey = "__bool:injectable__";
const Injectable = () => (target, context) => {
    Reflect.defineMetadata(exports.injectableKey, undefined, target);
    return target;
};
exports.Injectable = Injectable;
exports.default = exports.Injectable;
