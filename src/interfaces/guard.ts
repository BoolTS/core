export type TGuardReturn =
    | boolean
    | "UNAUTHORIZATION"
    | "FORBIDDEN"
    | Promise<boolean | "UNAUTHORIZATION" | "FORBIDDEN">;

export interface IGuard {
    enforce(...args: any[]): TGuardReturn;
}
