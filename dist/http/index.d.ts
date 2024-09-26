export type THttpMethods = {
    GET: "GET";
    HEAD: "HEAD";
    POST: "POST";
    PUT: "PUT";
    DELETE: "DELETE";
    CONNECT: "CONNECT";
    OPTIONS: "OPTIONS";
    TRACE: "TRACE";
    PATCH: "PATCH";
};
export declare const jsonErrorInfer: (data: any, headers?: Headers) => Response;
export * from "./clientError";
export * from "./serverError";
