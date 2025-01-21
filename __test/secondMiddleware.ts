import type { IMiddleware } from "@dist";
import { Middleware } from "@dist";

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
