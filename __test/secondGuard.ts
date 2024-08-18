import { Guard, IGuard } from "../src";

@Guard()
export class SecondGuard implements IGuard {
    enforce(): boolean | Promise<boolean> {
        console.log("Guard 02");
        console.log("===========================");
        return true;
    }
}
