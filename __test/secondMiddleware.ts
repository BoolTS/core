import { Middleware, IMiddleware } from "../src";

@Middleware()
export class SecondMiddleware implements IMiddleware {
    enforce() {
        console.log("Middleware 02");
        console.log("===========================");
    }
}
