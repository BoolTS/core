export declare const informationalStatuses: Readonly<{
    CONTINUE: Readonly<{
        status: 100;
        statusText: "Continue";
    }>;
    SWITCHING_PROTOCOLS: Readonly<{
        status: 101;
        statusText: "Switching Protocols";
    }>;
    EARLY_HINTS: Readonly<{
        status: 103;
        statusText: "Early Hints";
    }>;
}>;
export type TInformationalStatuses = (typeof informationalStatuses)[keyof typeof informationalStatuses]["status"];
export declare const successfulStatuses: Readonly<{
    OK: Readonly<{
        status: 200;
        statusText: "OK";
    }>;
    CREATED: Readonly<{
        status: 201;
        statusText: "Created";
    }>;
    ACCEPTED: Readonly<{
        status: 202;
        statusText: "Accepted";
    }>;
    NON_AUTHORITATIVE_INFORMATION: Readonly<{
        status: 203;
        statusText: "Non-Authoritative Information";
    }>;
    NO_CONTENT: Readonly<{
        status: 204;
        statusText: "No Content";
    }>;
    RESET_CONTENT: Readonly<{
        status: 205;
        statusText: "Reset Content";
    }>;
    PARTIAL_CONTENT: Readonly<{
        status: 206;
        statusText: "Partial Content";
    }>;
    MULTI_STATUS: Readonly<{
        status: 207;
        statusText: "Multi-Status";
    }>;
    ALREADY_REPORTED: Readonly<{
        status: 208;
        statusText: "Already Reported";
    }>;
    IM_USED: Readonly<{
        status: 226;
        statusText: "IM Used";
    }>;
}>;
export type TSuccessfulStatuses = (typeof successfulStatuses)[keyof typeof successfulStatuses]["status"];
export declare const redirectionStatuses: Readonly<{
    MULTIPLE_CHOICES: Readonly<{
        status: 300;
        statusText: "Multiple Choices";
    }>;
    MOVED_PERMANENTLY: Readonly<{
        status: 301;
        statusText: "Moved Permanently";
    }>;
    FOUND: Readonly<{
        status: 302;
        statusText: "Found";
    }>;
    SEE_OTHER: Readonly<{
        status: 303;
        statusText: "See Other";
    }>;
    NOT_MODIFIED: Readonly<{
        status: 304;
        statusText: "Not Modified";
    }>;
    UNUSED: Readonly<{
        status: 306;
        statusText: "Unused";
    }>;
    TEMPORARY_REDIRECT: Readonly<{
        status: 307;
        statusText: "Temporary Redirect";
    }>;
    PERMANENT_REDIRECT: Readonly<{
        status: 308;
        statusText: "Permanent Redirect";
    }>;
}>;
export type TRedirectionStatuses = (typeof redirectionStatuses)[keyof typeof redirectionStatuses]["status"];
export declare const clientErrorStatuses: Readonly<{
    BAD_REQUEST: Readonly<{
        status: 400;
        statusText: "Bad Request";
    }>;
    UNAUTHORIZED: Readonly<{
        status: 401;
        statusText: "Unauthorized";
    }>;
    PAYMENT_REQUIRED: Readonly<{
        status: 402;
        statusText: "Payment Required";
    }>;
    FORBIDDEN: Readonly<{
        status: 403;
        statusText: "Forbidden";
    }>;
    NOT_FOUND: Readonly<{
        status: 404;
        statusText: "Not Found";
    }>;
    METHOD_NOT_ALLOWED: Readonly<{
        status: 405;
        statusText: "Method Not Allowed";
    }>;
    NOT_ACCEPTABLE: Readonly<{
        status: 406;
        statusText: "Not Acceptable";
    }>;
    PROXY_AUTHENTICATION_REQUIRED: Readonly<{
        status: 407;
        statusText: "Proxy Authentication Required";
    }>;
    REQUEST_TIMEOUT: Readonly<{
        status: 408;
        statusText: "Request Timeout";
    }>;
    CONFLICT: Readonly<{
        status: 409;
        statusText: "Conflict";
    }>;
    GONE: Readonly<{
        status: 410;
        statusText: "Gone";
    }>;
    LENGTH_REQUIRED: Readonly<{
        status: 411;
        statusText: "Length Required";
    }>;
    PRECONDITION_FAILED: Readonly<{
        status: 412;
        statusText: "Precondition Failed";
    }>;
    CONTENT_TOO_LARGE: Readonly<{
        status: 413;
        statusText: "Content Too Large";
    }>;
    URI_TOO_LONG: Readonly<{
        status: 414;
        statusText: "URI Too Long";
    }>;
    UNSUPPORTED_MEDIA_TYPE: Readonly<{
        status: 415;
        statusText: "Unsupported Media Type";
    }>;
    RANGE_NOT_SATISFIABLE: Readonly<{
        status: 416;
        statusText: "Range Not Satisfiable";
    }>;
    EXPECTATION_FAILED: Readonly<{
        status: 417;
        statusText: "Expectation Failed";
    }>;
    I_AM_A_TEAPOT: Readonly<{
        status: 418;
        statusText: "I'm a teapot";
    }>;
    MISDIRECTED_REQUEST: Readonly<{
        status: 421;
        statusText: "Misdirected Request";
    }>;
    UNPROCESSABLE_CONTENT: Readonly<{
        status: 422;
        statusText: "Unprocessable Content";
    }>;
    LOCKED: Readonly<{
        status: 423;
        statusText: "Locked";
    }>;
    FAILED_DEPENDENCY: Readonly<{
        status: 424;
        statusText: "Failed Dependency";
    }>;
    TOO_EARLY: Readonly<{
        status: 425;
        statusText: "Too Early";
    }>;
    UPGRADE_REQUIRED: Readonly<{
        status: 426;
        statusText: "Upgrade Required";
    }>;
    PRECONDITION_REQUIRED: Readonly<{
        status: 428;
        statusText: "Precondition Required";
    }>;
    TOO_MANY_REQUESTS: Readonly<{
        status: 429;
        statusText: "Too Many Requests";
    }>;
    REQUEST_HEADER_FIELDS_TOO_LARGE: Readonly<{
        status: 431;
        statusText: "Request Header Fields Too Large";
    }>;
    UNAVAILABLE_FOR_LEGAL_REASONS: Readonly<{
        status: 451;
        statusText: "Unavailable For Legal Reasons";
    }>;
}>;
export type TClientErrorStatuses = (typeof clientErrorStatuses)[keyof typeof clientErrorStatuses]["status"];
export declare const serverErrorStatuses: Readonly<{
    INTERNAL_SERVER_ERROR: Readonly<{
        status: 500;
        statusText: "Internal Server Error";
    }>;
    NOT_IMPLEMENTED: Readonly<{
        status: 501;
        statusText: "Not Implemented";
    }>;
    BAD_GATEWAY: Readonly<{
        status: 502;
        statusText: "Bad Gateway";
    }>;
    SERVICE_UNAVAILABLE: Readonly<{
        status: 503;
        statusText: "Service Unavailable";
    }>;
    GATEWAY_TIMEOUT: Readonly<{
        status: 504;
        statusText: "Gateway Timeout";
    }>;
    HTTP_VERSION_NOT_SUPPORTED: Readonly<{
        status: 505;
        statusText: "HTTP Version Not Supported";
    }>;
    VARIANT_ALSO_NEGOTIATES: Readonly<{
        status: 506;
        statusText: "Variant Also Negotiates";
    }>;
    INSUFFICIENT_STORAGE: Readonly<{
        status: 507;
        statusText: "Insufficient Storage";
    }>;
    LOOP_DETECTED: Readonly<{
        status: 508;
        statusText: "Loop Detected";
    }>;
    NOT_EXTENDED: Readonly<{
        status: 510;
        statusText: "Not Extended";
    }>;
    NETWORK_AUTHENTICATION_REQUIRED: Readonly<{
        status: 511;
        statusText: "Network Authentication Required";
    }>;
}>;
export type TServerErrorStatuses = (typeof serverErrorStatuses)[keyof typeof serverErrorStatuses]["status"];
export declare const httpStatuses: Readonly<{
    INTERNAL_SERVER_ERROR: Readonly<{
        status: 500;
        statusText: "Internal Server Error";
    }>;
    NOT_IMPLEMENTED: Readonly<{
        status: 501;
        statusText: "Not Implemented";
    }>;
    BAD_GATEWAY: Readonly<{
        status: 502;
        statusText: "Bad Gateway";
    }>;
    SERVICE_UNAVAILABLE: Readonly<{
        status: 503;
        statusText: "Service Unavailable";
    }>;
    GATEWAY_TIMEOUT: Readonly<{
        status: 504;
        statusText: "Gateway Timeout";
    }>;
    HTTP_VERSION_NOT_SUPPORTED: Readonly<{
        status: 505;
        statusText: "HTTP Version Not Supported";
    }>;
    VARIANT_ALSO_NEGOTIATES: Readonly<{
        status: 506;
        statusText: "Variant Also Negotiates";
    }>;
    INSUFFICIENT_STORAGE: Readonly<{
        status: 507;
        statusText: "Insufficient Storage";
    }>;
    LOOP_DETECTED: Readonly<{
        status: 508;
        statusText: "Loop Detected";
    }>;
    NOT_EXTENDED: Readonly<{
        status: 510;
        statusText: "Not Extended";
    }>;
    NETWORK_AUTHENTICATION_REQUIRED: Readonly<{
        status: 511;
        statusText: "Network Authentication Required";
    }>;
    BAD_REQUEST: Readonly<{
        status: 400;
        statusText: "Bad Request";
    }>;
    UNAUTHORIZED: Readonly<{
        status: 401;
        statusText: "Unauthorized";
    }>;
    PAYMENT_REQUIRED: Readonly<{
        status: 402;
        statusText: "Payment Required";
    }>;
    FORBIDDEN: Readonly<{
        status: 403;
        statusText: "Forbidden";
    }>;
    NOT_FOUND: Readonly<{
        status: 404;
        statusText: "Not Found";
    }>;
    METHOD_NOT_ALLOWED: Readonly<{
        status: 405;
        statusText: "Method Not Allowed";
    }>;
    NOT_ACCEPTABLE: Readonly<{
        status: 406;
        statusText: "Not Acceptable";
    }>;
    PROXY_AUTHENTICATION_REQUIRED: Readonly<{
        status: 407;
        statusText: "Proxy Authentication Required";
    }>;
    REQUEST_TIMEOUT: Readonly<{
        status: 408;
        statusText: "Request Timeout";
    }>;
    CONFLICT: Readonly<{
        status: 409;
        statusText: "Conflict";
    }>;
    GONE: Readonly<{
        status: 410;
        statusText: "Gone";
    }>;
    LENGTH_REQUIRED: Readonly<{
        status: 411;
        statusText: "Length Required";
    }>;
    PRECONDITION_FAILED: Readonly<{
        status: 412;
        statusText: "Precondition Failed";
    }>;
    CONTENT_TOO_LARGE: Readonly<{
        status: 413;
        statusText: "Content Too Large";
    }>;
    URI_TOO_LONG: Readonly<{
        status: 414;
        statusText: "URI Too Long";
    }>;
    UNSUPPORTED_MEDIA_TYPE: Readonly<{
        status: 415;
        statusText: "Unsupported Media Type";
    }>;
    RANGE_NOT_SATISFIABLE: Readonly<{
        status: 416;
        statusText: "Range Not Satisfiable";
    }>;
    EXPECTATION_FAILED: Readonly<{
        status: 417;
        statusText: "Expectation Failed";
    }>;
    I_AM_A_TEAPOT: Readonly<{
        status: 418;
        statusText: "I'm a teapot";
    }>;
    MISDIRECTED_REQUEST: Readonly<{
        status: 421;
        statusText: "Misdirected Request";
    }>;
    UNPROCESSABLE_CONTENT: Readonly<{
        status: 422;
        statusText: "Unprocessable Content";
    }>;
    LOCKED: Readonly<{
        status: 423;
        statusText: "Locked";
    }>;
    FAILED_DEPENDENCY: Readonly<{
        status: 424;
        statusText: "Failed Dependency";
    }>;
    TOO_EARLY: Readonly<{
        status: 425;
        statusText: "Too Early";
    }>;
    UPGRADE_REQUIRED: Readonly<{
        status: 426;
        statusText: "Upgrade Required";
    }>;
    PRECONDITION_REQUIRED: Readonly<{
        status: 428;
        statusText: "Precondition Required";
    }>;
    TOO_MANY_REQUESTS: Readonly<{
        status: 429;
        statusText: "Too Many Requests";
    }>;
    REQUEST_HEADER_FIELDS_TOO_LARGE: Readonly<{
        status: 431;
        statusText: "Request Header Fields Too Large";
    }>;
    UNAVAILABLE_FOR_LEGAL_REASONS: Readonly<{
        status: 451;
        statusText: "Unavailable For Legal Reasons";
    }>;
    MULTIPLE_CHOICES: Readonly<{
        status: 300;
        statusText: "Multiple Choices";
    }>;
    MOVED_PERMANENTLY: Readonly<{
        status: 301;
        statusText: "Moved Permanently";
    }>;
    FOUND: Readonly<{
        status: 302;
        statusText: "Found";
    }>;
    SEE_OTHER: Readonly<{
        status: 303;
        statusText: "See Other";
    }>;
    NOT_MODIFIED: Readonly<{
        status: 304;
        statusText: "Not Modified";
    }>;
    UNUSED: Readonly<{
        status: 306;
        statusText: "Unused";
    }>;
    TEMPORARY_REDIRECT: Readonly<{
        status: 307;
        statusText: "Temporary Redirect";
    }>;
    PERMANENT_REDIRECT: Readonly<{
        status: 308;
        statusText: "Permanent Redirect";
    }>;
    OK: Readonly<{
        status: 200;
        statusText: "OK";
    }>;
    CREATED: Readonly<{
        status: 201;
        statusText: "Created";
    }>;
    ACCEPTED: Readonly<{
        status: 202;
        statusText: "Accepted";
    }>;
    NON_AUTHORITATIVE_INFORMATION: Readonly<{
        status: 203;
        statusText: "Non-Authoritative Information";
    }>;
    NO_CONTENT: Readonly<{
        status: 204;
        statusText: "No Content";
    }>;
    RESET_CONTENT: Readonly<{
        status: 205;
        statusText: "Reset Content";
    }>;
    PARTIAL_CONTENT: Readonly<{
        status: 206;
        statusText: "Partial Content";
    }>;
    MULTI_STATUS: Readonly<{
        status: 207;
        statusText: "Multi-Status";
    }>;
    ALREADY_REPORTED: Readonly<{
        status: 208;
        statusText: "Already Reported";
    }>;
    IM_USED: Readonly<{
        status: 226;
        statusText: "IM Used";
    }>;
    CONTINUE: Readonly<{
        status: 100;
        statusText: "Continue";
    }>;
    SWITCHING_PROTOCOLS: Readonly<{
        status: 101;
        statusText: "Switching Protocols";
    }>;
    EARLY_HINTS: Readonly<{
        status: 103;
        statusText: "Early Hints";
    }>;
}>;
