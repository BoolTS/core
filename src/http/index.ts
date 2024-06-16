import { Response } from "express";
import { HttpClientError } from "./clientError";
import { HttpServerError } from "./serverError";


export const errorInfer = (res: Response, data: any) => {
    if (res.headersSent) {
        return;
    }

    try {
        if (data instanceof HttpClientError) {
            res.status(data.httpCode).json(data);
            return;
        }

        if (data instanceof HttpServerError) {
            res.status(data.httpCode).json(data);
            return;
        }

        if (typeof data === "object") {
            res.status(500).json({
                httpCode: 500,
                message: "INTERNAL SERVER ERROR",
                data: !(data instanceof Error) ? data : {
                    message: data.message,
                    code: data.name,
                    cause: data.cause
                }
            });
            return;
        }

        switch (typeof data) {
            case "string":
                res.status(500).json({
                    httpCode: 500,
                    message: "INTERNAL SERVER ERROR",
                    data: {
                        message: data
                    }
                });
                return;

            case "number":
                res.status(500).json({
                    httpCode: 500,
                    message: "INTERNAL SERVER ERROR",
                    data: {
                        code: data
                    }
                });
                return;

            default:
                res.status(500).json({
                    httpCode: 500,
                    message: "INTERNAL SERVER ERROR",
                    data: undefined
                });
                return;
        }
    }
    catch (error) {
        console.error(JSON.stringify(error));
        res.end();
    }
}

export * from "./clientError";
export * from "./serverError";
