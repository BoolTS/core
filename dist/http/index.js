"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorInfer = void 0;
const clientError_1 = require("./clientError");
const serverError_1 = require("./serverError");
const errorInfer = (res, data) => {
    if (res.headersSent) {
        return;
    }
    try {
        if (data instanceof clientError_1.HttpClientError) {
            res.status(data.httpCode).json(data);
            return;
        }
        if (data instanceof serverError_1.HttpServerError) {
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
};
exports.errorInfer = errorInfer;
__exportStar(require("./clientError"), exports);
__exportStar(require("./serverError"), exports);
