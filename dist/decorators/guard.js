export const guardKey = Symbol.for("__bool:guard__");
export const Guard = () => (target) => {
    if (!("enforce" in target.prototype) || typeof target.prototype.enforce !== "function") {
        return;
    }
    const metadata = undefined;
    Reflect.defineMetadata(guardKey, metadata, target);
};
export default Guard;
