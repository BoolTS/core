export type THttpMethods = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
export declare const httpMethods: Array<THttpMethods>;
export declare const httpMethodsStandardization: (method: string) => method is THttpMethods;
export declare const jsonErrorInfer: (data: any, headers?: Headers) => Response;
export * from "./clientError";
export * from "./serverError";
