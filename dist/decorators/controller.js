"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.controllerKey = void 0;
const injectable_1 = require("./injectable");
exports.controllerKey = "__bool:controller__";
const Controller = (prefix) => (target, context) => {
    Reflect.defineMetadata(exports.controllerKey, !prefix.startsWith("/") ? `/${prefix}` : prefix, target);
    Reflect.defineMetadata(injectable_1.injectableKey, undefined, target);
    return target;
};
exports.Controller = Controller;
exports.default = exports.Controller;
