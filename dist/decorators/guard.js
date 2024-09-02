import { guardKey } from "../keys";
export const Guard = () => (target) => {
    if (!("enforce" in target.prototype) || typeof target.prototype.enforce !== "function") {
        return;
    }
    const metadata = undefined;
    Reflect.defineMetadata(guardKey, metadata, target);
};
export default Guard;
