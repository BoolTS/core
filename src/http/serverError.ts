export const httpServerErrors = Object.freeze({
    500: "INTERNAL_SERVER_ERROR",
    501: "NOT_IMPLEMENTED",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
    505: "HTTP_VERSION_NOT_SUPPORTED",
    506: "VARIANT_ALSO_NEGOTIATES",
    507: "INSUFFICIENT_STORAGE",
    508: "LOOP_DETECTED",
    510: "NOT_EXTENDED",
    511: "NETWORK_AUTHENTICATION_REQUIRED"
});

export class HttpServerError<T extends keyof typeof httpServerErrors = keyof typeof httpServerErrors, K = any> extends Error {
    public readonly httpCode: T;
    public readonly message: (typeof httpServerErrors)[T] | string;
    public readonly data: K;

    constructor({ httpCode, data, message }: { httpCode: T; data: K; message?: string }) {
        super();

        this.httpCode = httpCode;
        this.message = !message?.trim() ? httpServerErrors[httpCode] : message.trim();
        this.data = data;
    }
}
