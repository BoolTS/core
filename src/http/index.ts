import { HttpClientError } from "./clientError";
import { HttpServerError } from "./serverError";

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

export const jsonErrorInfer = (data: any, headers: Headers = new Headers()) => {
    headers.set("Content-Type", "application/json");

    if (data instanceof HttpClientError || data instanceof HttpServerError) {
        return new Response(JSON.stringify(data), {
            status: data.httpCode,
            statusText: data.message,
            headers: headers
        });
    }

    return new Response(
        JSON.stringify(
            (() => {
                switch (typeof data) {
                    case "object":
                        return !(data instanceof Error)
                            ? data
                            : {
                                  message: data.message,
                                  code: data.name,
                                  cause: data.cause
                              };
                    case "string":
                        return {
                            message: data
                        };
                    case "number":
                        return {
                            code: data
                        };
                    default:
                        return undefined;
                }
            })()
        ),
        {
            status: 500,
            statusText: "INTERNAL SERVER ERROR",
            headers: headers
        }
    );
};

export * from "./clientError";
export * from "./serverError";
