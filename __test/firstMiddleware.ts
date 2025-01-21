import type { IMiddleware } from "@dist";

import { Middleware } from "@dist";

@Middleware()
export class FirstMiddleware implements IMiddleware {
    start() {
        console.log("Middleware 01 - Start");
        console.log("===========================");
    }

    end() {
        console.log("Middleware 01 - End");
        console.log("===========================");
    }
}
