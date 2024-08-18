import { Dispatcher, IDispatcher } from "../src";

@Dispatcher()
export class AfterDispatcher implements IDispatcher {
    execute() {
        console.log("After dispatch");
        console.log("===========================");
    }
}
