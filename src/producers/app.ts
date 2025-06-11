import type { BunFile } from "bun";

import { parse as QsParse } from "qs";

type TParamsType = Record<string, string>;

type TBoolAppOptions = Required<{
    config: Record<string | symbol, any> | (() => Record<string | symbol, any>);
    prefix: string;
    debug: boolean;
    log: Partial<{
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
    queryParser: Parameters<typeof QsParse>[1];
    static: Required<{
        path: string;
    }> &
        Partial<{
            headers: TParamsType;
            cacheTimeInSeconds: number;
        }>;
    cors: Partial<{
        credentials: boolean;
        origins: string | Array<string>;
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
        headers: Array<string>;
    }>;
}>;

export class BoolApp {
    #staticMap: Map<
        string,
        Readonly<{
            expiredAt: Date;
            file: BunFile;
        }>
    > = new Map();

    readonly #options: TBoolAppOptions;

    constructor(options: TBoolAppOptions) {}
}
