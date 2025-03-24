import type { IInterceptor } from "@dist";

import { Interceptor } from "@dist";

@Interceptor()
export class CustomInterceptor implements IInterceptor {
    open() {
        console.log("Interceptor -- Open");
        console.log("===========================");
    }

    close() {
        console.log("Interceptor -- Close");
        console.log("===========================");
    }
}
