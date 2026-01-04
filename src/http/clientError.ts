import type { TClientErrorStatuses } from "../constants";

import { inferStatusText } from "../utils";

export class HttpClientError<K = unknown> extends Error {
    public readonly httpCode: TClientErrorStatuses;
    public readonly message: string;
    public readonly data: K | undefined;

    constructor({
        httpCode,
        data,
        message
    }: {
        httpCode: TClientErrorStatuses;
        data?: K;
        message?: string;
    }) {
        super();

        this.httpCode = httpCode;
        this.message = !message?.trim() ? inferStatusText(httpCode) : message.trim();
        this.data = data;
    }
}
