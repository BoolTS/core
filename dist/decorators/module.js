import { controllerKey, dispatcherKey, guardKey, injectableKey, middlewareKey, moduleKey, webSocketKey } from "../keys";
export const Module = (args) => (target) => {
    const { middlewares, guards, dispatchers, controllers, dependencies, webSockets } = args || {};
    if (middlewares) {
        for (let i = 0; i < middlewares.length; i++) {
            if (!Reflect.getOwnMetadataKeys(middlewares[i]).includes(middlewareKey)) {
                throw Error(`${middlewares[i].name} is not a middleware.`);
            }
        }
    }
    if (guards) {
        for (let i = 0; i < guards.length; i++) {
            if (!Reflect.getOwnMetadataKeys(guards[i]).includes(guardKey)) {
                throw Error(`${guards[i].name} is not a guard.`);
            }
        }
    }
    if (dispatchers) {
        for (let i = 0; i < dispatchers.length; i++) {
            if (!Reflect.getOwnMetadataKeys(dispatchers[i]).includes(dispatcherKey)) {
                throw Error(`${dispatchers[i].name} is not a dispatcher.`);
            }
        }
    }
    if (controllers) {
        for (let i = 0; i < controllers.length; i++) {
            if (!Reflect.getOwnMetadataKeys(controllers[i]).includes(controllerKey)) {
                throw Error(`${controllers[i].name} is not a controller.`);
            }
        }
    }
    if (dependencies) {
        for (let i = 0; i < dependencies.length; i++) {
            if (!Reflect.getOwnMetadataKeys(dependencies[i]).includes(injectableKey)) {
                throw Error(`${dependencies[i].name} is not an injectable.`);
            }
        }
    }
    if (webSockets) {
        for (let i = 0; i < webSockets.length; i++) {
            if (!Reflect.getOwnMetadataKeys(webSockets[i]).includes(webSocketKey)) {
                throw Error(`${webSockets[i].name} is not a websocket gateway.`);
            }
        }
    }
    Reflect.defineMetadata(moduleKey, args, target);
};
export default Module;
