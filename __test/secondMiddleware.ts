import type { IMiddleware } from "../src";
import { Middleware } from "../src";

@Middleware()
export class SecondMiddleware implements IMiddleware {
    start() {
        console.log("Middleware 02 --- Start");
        console.log("===========================");
    }

    end() {
        console.log("Middleware 02 --- End");
        console.log("===========================");
    }
}
