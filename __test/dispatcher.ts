import type { IDispatcher } from "@dist";

import { Dispatcher } from "@dist";

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
