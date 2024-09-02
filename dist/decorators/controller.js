import { controllerHttpKey, controllerKey } from "../keys";
import {} from "./http";
export const Controller = (prefix) => (target) => {
    const metadata = {
        prefix: !prefix.startsWith("/") ? `/${prefix}` : prefix,
        httpMetadata: [...(Reflect.getOwnMetadata(controllerHttpKey, target.constructor) || [])]
    };
    Reflect.defineMetadata(controllerKey, metadata, target);
};
export default Controller;
