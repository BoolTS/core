export type TGuardMetadata = undefined;

export const guardKey = Symbol.for("__bool:guard__");

export const Guard =
    () =>
    <T extends { new (...args: any[]): {} }>(target: T) => {
        if (!("excute" in target.prototype) || typeof target.prototype.excute !== "function") {
            return;
        }

        const metadata = undefined;

        Reflect.defineMetadata(guardKey, metadata, target);
    };

export default Guard;
