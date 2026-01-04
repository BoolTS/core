import type { TClientErrorStatuses } from "../constants";
export declare class HttpClientError<K = unknown> extends Error {
    readonly httpCode: TClientErrorStatuses;
    readonly message: string;
    readonly data: K | undefined;
    constructor({ httpCode, data, message }: {
        httpCode: TClientErrorStatuses;
        data?: K;
        message?: string;
    });
}
