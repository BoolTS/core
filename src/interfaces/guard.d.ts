export interface IGuard {
    enforce(): boolean | Promise<boolean>;
}
