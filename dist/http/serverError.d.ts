import type { TServerErrorStatuses } from "../constants";
export declare class HttpServerError<T = any> extends Error {
    readonly httpCode: TServerErrorStatuses;
    readonly message: string;
    readonly data: T | undefined;
    constructor({ httpCode, data, message }: {
        httpCode: TServerErrorStatuses;
        data?: T;
        message?: string;
    });
}
