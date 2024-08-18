export const dispatcherKey = Symbol.for("__bool:dispatcher__");
export const Dispatcher = () => (target) => {
    if (!("execute" in target.prototype) || typeof target.prototype.execute !== "function") {
        return;
    }
    const metadata = undefined;
    Reflect.defineMetadata(dispatcherKey, metadata, target);
};
export default Dispatcher;
