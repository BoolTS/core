import { Guard, IGuard } from "@dist";

@Guard()
export class SecondGuard implements IGuard {
    enforce(): boolean | Promise<boolean> {
        console.log("Guard 02");
        console.log("===========================");
        return true;
    }
}
