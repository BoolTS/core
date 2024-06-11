"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = exports.moduleKey = void 0;
exports.moduleKey = "__bool:module__";
const Module = (args) => (target, context) => {
    Reflect.defineMetadata(exports.moduleKey, args, target);
    return target;
};
exports.Module = Module;
exports.default = exports.Module;
