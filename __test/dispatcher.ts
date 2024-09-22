import type { IDispatcher } from "../src";

import { Dispatcher } from "../src";

@Dispatcher()
export class CustomDispatcher implements IDispatcher {
    open() {
        console.log("Dispatch -- Open");
        console.log("===========================");
    }

    close() {
        console.log("Dispatch -- Close");
        console.log("===========================");
    }
}
