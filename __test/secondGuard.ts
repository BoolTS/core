import type { IGuard } from "@dist";

import { Guard } from "@dist";

@Guard()
export class SecondGuard implements IGuard {
    enforce(): boolean | Promise<boolean> {
        console.log("Guard 02");
        console.log("===========================");
        return true;
    }
}
