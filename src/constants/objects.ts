//#region [Informational]
export const informationalStatuses = Object.freeze({
    CONTINUE: Object.freeze({
        status: 100,
        statusText: "Continue"
    }),
    SWITCHING_PROTOCOLS: Object.freeze({
        status: 101,
        statusText: "Switching Protocols"
    }),
    EARLY_HINTS: Object.freeze({
        status: 103,
        statusText: "Early Hints"
    })
});

export type TInformationalStatuses =
    (typeof informationalStatuses)[keyof typeof informationalStatuses]["status"];
//#endregion

//#region [Successful]
export const successfulStatuses = Object.freeze({
    OK: Object.freeze({
        status: 200,
        statusText: "OK"
    }),
    CREATED: Object.freeze({
        status: 201,
        statusText: "Created"
    }),
    ACCEPTED: Object.freeze({
        status: 202,
        statusText: "Accepted"
    }),
    NON_AUTHORITATIVE_INFORMATION: Object.freeze({
        status: 203,
        statusText: "Non-Authoritative Information"
    }),
    NO_CONTENT: Object.freeze({
        status: 204,
        statusText: "No Content"
    }),
    RESET_CONTENT: Object.freeze({
        status: 205,
        statusText: "Reset Content"
    }),
    PARTIAL_CONTENT: Object.freeze({
        status: 206,
        statusText: "Partial Content"
    }),
    MULTI_STATUS: Object.freeze({
        status: 207,
        statusText: "Multi-Status"
    }),
    ALREADY_REPORTED: Object.freeze({
        status: 208,
        statusText: "Already Reported"
    }),
    IM_USED: Object.freeze({
        status: 226,
        statusText: "IM Used"
    })
});

export type TSuccessfulStatuses =
    (typeof successfulStatuses)[keyof typeof successfulStatuses]["status"];
//#endregion

//#region [Redirection]
export const redirectionStatuses = Object.freeze({
    MULTIPLE_CHOICES: Object.freeze({
        status: 300,
        statusText: "Multiple Choices"
    }),
    MOVED_PERMANENTLY: Object.freeze({
        status: 301,
        statusText: "Moved Permanently"
    }),
    FOUND: Object.freeze({
        status: 302,
        statusText: "Found"
    }),
    SEE_OTHER: Object.freeze({
        status: 303,
        statusText: "See Other"
    }),
    NOT_MODIFIED: Object.freeze({
        status: 304,
        statusText: "Not Modified"
    }),
    UNUSED: Object.freeze({
        status: 306,
        statusText: "Unused"
    }),
    TEMPORARY_REDIRECT: Object.freeze({
        status: 307,
        statusText: "Temporary Redirect"
    }),
    PERMANENT_REDIRECT: Object.freeze({
        status: 308,
        statusText: "Permanent Redirect"
    })
});

export type TRedirectionStatuses =
    (typeof redirectionStatuses)[keyof typeof redirectionStatuses]["status"];
//#endregion

//#region [Client error]
export const clientErrorStatuses = Object.freeze({
    BAD_REQUEST: Object.freeze({
        status: 400,
        statusText: "Bad Request"
    }),
    UNAUTHORIZED: Object.freeze({
        status: 401,
        statusText: "Unauthorized"
    }),
    PAYMENT_REQUIRED: Object.freeze({
        status: 402,
        statusText: "Payment Required"
    }),
    FORBIDDEN: Object.freeze({
        status: 403,
        statusText: "Forbidden"
    }),
    NOT_FOUND: Object.freeze({
        status: 404,
        statusText: "Not Found"
    }),
    METHOD_NOT_ALLOWED: Object.freeze({
        status: 405,
        statusText: "Method Not Allowed"
    }),
    NOT_ACCEPTABLE: Object.freeze({
        status: 406,
        statusText: "Not Acceptable"
    }),
    PROXY_AUTHENTICATION_REQUIRED: Object.freeze({
        status: 407,
        statusText: "Proxy Authentication Required"
    }),
    REQUEST_TIMEOUT: Object.freeze({
        status: 408,
        statusText: "Request Timeout"
    }),
    CONFLICT: Object.freeze({
        status: 409,
        statusText: "Conflict"
    }),
    GONE: Object.freeze({
        status: 410,
        statusText: "Gone"
    }),
    LENGTH_REQUIRED: Object.freeze({
        status: 411,
        statusText: "Length Required"
    }),
    PRECONDITION_FAILED: Object.freeze({
        status: 412,
        statusText: "Precondition Failed"
    }),
    CONTENT_TOO_LARGE: Object.freeze({
        status: 413,
        statusText: "Content Too Large"
    }),
    URI_TOO_LONG: Object.freeze({
        status: 414,
        statusText: "URI Too Long"
    }),
    UNSUPPORTED_MEDIA_TYPE: Object.freeze({
        status: 415,
        statusText: "Unsupported Media Type"
    }),
    RANGE_NOT_SATISFIABLE: Object.freeze({
        status: 416,
        statusText: "Range Not Satisfiable"
    }),
    EXPECTATION_FAILED: Object.freeze({
        status: 417,
        statusText: "Expectation Failed"
    }),
    I_AM_A_TEAPOT: Object.freeze({
        status: 418,
        statusText: "I'm a teapot"
    }),
    MISDIRECTED_REQUEST: Object.freeze({
        status: 421,
        statusText: "Misdirected Request"
    }),
    UNPROCESSABLE_CONTENT: Object.freeze({
        status: 422,
        statusText: "Unprocessable Content"
    }),
    LOCKED: Object.freeze({
        status: 423,
        statusText: "Locked"
    }),
    FAILED_DEPENDENCY: Object.freeze({
        status: 424,
        statusText: "Failed Dependency"
    }),
    TOO_EARLY: Object.freeze({
        status: 425,
        statusText: "Too Early"
    }),
    UPGRADE_REQUIRED: Object.freeze({
        status: 426,
        statusText: "Upgrade Required"
    }),
    PRECONDITION_REQUIRED: Object.freeze({
        status: 428,
        statusText: "Precondition Required"
    }),
    TOO_MANY_REQUESTS: Object.freeze({
        status: 429,
        statusText: "Too Many Requests"
    }),
    REQUEST_HEADER_FIELDS_TOO_LARGE: Object.freeze({
        status: 431,
        statusText: "Request Header Fields Too Large"
    }),
    UNAVAILABLE_FOR_LEGAL_REASONS: Object.freeze({
        status: 451,
        statusText: "Unavailable For Legal Reasons"
    })
});

export type TClientErrorStatuses =
    (typeof clientErrorStatuses)[keyof typeof clientErrorStatuses]["status"];
//#endregion

//#region [Server error]
export const serverErrorStatuses = Object.freeze({
    INTERNAL_SERVER_ERROR: Object.freeze({
        status: 500,
        statusText: "Internal Server Error"
    }),
    NOT_IMPLEMENTED: Object.freeze({
        status: 501,
        statusText: "Not Implemented"
    }),
    BAD_GATEWAY: Object.freeze({
        status: 502,
        statusText: "Bad Gateway"
    }),
    SERVICE_UNAVAILABLE: Object.freeze({
        status: 503,
        statusText: "Service Unavailable"
    }),
    GATEWAY_TIMEOUT: Object.freeze({
        status: 504,
        statusText: "Gateway Timeout"
    }),
    HTTP_VERSION_NOT_SUPPORTED: Object.freeze({
        status: 505,
        statusText: "HTTP Version Not Supported"
    }),
    VARIANT_ALSO_NEGOTIATES: Object.freeze({
        status: 506,
        statusText: "Variant Also Negotiates"
    }),
    INSUFFICIENT_STORAGE: Object.freeze({
        status: 507,
        statusText: "Insufficient Storage"
    }),
    LOOP_DETECTED: Object.freeze({
        status: 508,
        statusText: "Loop Detected"
    }),
    NOT_EXTENDED: Object.freeze({
        status: 510,
        statusText: "Not Extended"
    }),
    NETWORK_AUTHENTICATION_REQUIRED: Object.freeze({
        status: 511,
        statusText: "Network Authentication Required"
    })
});

export type TServerErrorStatuses =
    (typeof serverErrorStatuses)[keyof typeof serverErrorStatuses]["status"];
//#endregion

export const httpStatuses = Object.freeze({
    ...informationalStatuses,
    ...successfulStatuses,
    ...redirectionStatuses,
    ...clientErrorStatuses,
    ...serverErrorStatuses
});
