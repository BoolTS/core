import { controllerHttpKey } from "./http";
export const controllerKey = Symbol.for("__bool:controller__");
export const Controller = (prefix) => (target) => {
    const metadata = {
        prefix: !prefix.startsWith("/") ? `/${prefix}` : prefix,
        httpMetadata: [...(Reflect.getOwnMetadata(controllerHttpKey, target.constructor) || [])]
    };
    Reflect.defineMetadata(controllerKey, metadata, target);
};
export default Controller;
