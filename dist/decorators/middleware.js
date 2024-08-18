export const middlewareKey = Symbol.for("__bool:middleware__");
export const Middleware = () => (target) => {
    if (!("enforce" in target.prototype) || typeof target.prototype.enforce !== "function") {
        return;
    }
    const metadata = undefined;
    Reflect.defineMetadata(middlewareKey, metadata, target);
};
export default Middleware;
