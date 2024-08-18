import { Middleware, IMiddleware } from "../src";

@Middleware()
export class FirstMiddleware implements IMiddleware {
    enforce() {
        console.log("Middleware 01");
        console.log("===========================");
    }
}
