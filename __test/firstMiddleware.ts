import type { IMiddleware } from "../src";
import { Middleware } from "../src";

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
