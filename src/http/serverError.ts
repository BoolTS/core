import type { TServerErrorStatuses } from "../constants";

import { inferStatusText } from "../utils";

export class HttpServerError<T = any> extends Error {
    public readonly httpCode: TServerErrorStatuses;
    public readonly message: string;
    public readonly data: T | undefined;

    constructor({
        httpCode,
        data,
        message
    }: {
        httpCode: TServerErrorStatuses;
        data?: T;
        message?: string;
    }) {
        super();

        this.httpCode = httpCode;
        this.message = !message?.trim() ? inferStatusText(httpCode) : message.trim();
        this.data = data;
    }
}
