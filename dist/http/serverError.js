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
export class HttpServerError extends Error {
    httpCode;
    message;
    data;
    constructor({ httpCode, data, message }) {
        super();
        this.httpCode = httpCode;
        this.message = !message?.trim() ? httpServerErrors[httpCode] : message.trim();
        this.data = data;
    }
}
