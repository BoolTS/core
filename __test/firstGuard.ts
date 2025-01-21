import type { IGuard } from "@dist";

import { Guard } from "@dist";

@Guard()
export class FirstGuard implements IGuard {
    enforce(): boolean | Promise<boolean> {
        console.log("Guard 01");
        console.log("===========================");
        return true;
    }
}
