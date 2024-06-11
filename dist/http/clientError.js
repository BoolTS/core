"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientError = exports.httpClientErrors = void 0;
exports.httpClientErrors = Object.freeze({
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    402: "PAYMENT_REQUIRED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    406: "NOT_ACCEPTABLE",
    407: "PROXY_AUTHENCATION_REQUIRED",
    408: "REQUEST_TIMEOUT",
    409: "CONFLICT",
    410: "GONE",
    411: "LENGTH_REQUIRED",
    412: "PRECONDITION_FAILED",
    413: "PAYLOAD_TOO_LARGE",
    414: "URI_TOO_LONG",
    415: "UNSUPPORTED_MEDIA_TYPE",
    416: "RANGE_NOT_SATISFIABLE",
    417: "EXPECTATION_FAILED",
    418: "IM_A_TEAPOT",
    421: "MISDIRECTED_REQUEST",
    422: "UNPROCESSABLE_ENTITY",
    423: "LOCKED",
    424: "FAILED_DEPENDENCY",
    425: "TOO_EARLY_",
    426: "UPGRAGE_REQUIRED",
    428: "PRECONDITION_REQUIRED",
    429: "TOO_MANY_REQUESTS",
    431: "REQUEST_HEADER_FIELDS_TOO_LARGE",
    451: "UNAVAILABLE_FOR_LEGAL_REASONS"
});
class HttpClientError extends Error {
    httpCode;
    message;
    data;
    constructor({ httpCode, data }) {
        super();
        this.httpCode = httpCode;
        this.message = exports.httpClientErrors[httpCode];
        this.data = data;
    }
}
exports.HttpClientError = HttpClientError;
