import { Dispatcher, IDispatcher } from "../src";

@Dispatcher()
export class BeforeDispatcher implements IDispatcher {
    execute() {
        console.log("Before dispatch");
        console.log("===========================");
    }
}
