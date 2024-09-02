import { injectableKey } from "../keys";
export const Injectable = () => (target) => Reflect.defineMetadata(injectableKey, undefined, target);
export default Injectable;
