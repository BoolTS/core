import { Objects } from "../constants";

export const inferStatusText = (httpCode: number): string => {
    for (const [_key, value] of Object.entries(Objects.httpStatuses)) {
        if (value.status !== httpCode) {
            continue;
        }

        return value.statusText;
    }

    return "Unknown error";
};

type TCallable = <T>(...args: T[]) => unknown;

export const hasCallSignature = (value: any): value is TCallable => {
    return (
        typeof value === "function" &&
        !(
            value.prototype &&
            Object.getOwnPropertyDescriptor(value, "prototype")?.writable === false
        )
    );
};
