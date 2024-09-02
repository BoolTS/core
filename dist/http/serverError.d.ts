export declare const httpServerErrors: Readonly<{
    500: "INTERNAL_SERVER_ERROR";
    501: "NOT_IMPLEMENTED";
    502: "BAD_GATEWAY";
    503: "SERVICE_UNAVAILABLE";
    504: "GATEWAY_TIMEOUT";
    505: "HTTP_VERSION_NOT_SUPPORTED";
    506: "VARIANT_ALSO_NEGOTIATES";
    507: "INSUFFICIENT_STORAGE";
    508: "LOOP_DETECTED";
    510: "NOT_EXTENDED";
    511: "NETWORK_AUTHENTICATION_REQUIRED";
}>;
export declare class HttpServerError<T extends keyof typeof httpServerErrors = keyof typeof httpServerErrors, K = any> extends Error {
    readonly httpCode: T;
    readonly message: (typeof httpServerErrors)[T] | string;
    readonly data: K;
    constructor({ httpCode, data, message }: {
        httpCode: T;
        data: K;
        message?: string;
    });
}
