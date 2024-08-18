import { Guard, IGuard } from "../src";

@Guard()
export class FirstGuard implements IGuard {
    enforce(): boolean | Promise<boolean> {
        console.log("Guard 01");
        console.log("===========================");
        return true;
    }
}
