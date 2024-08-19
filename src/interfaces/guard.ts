export interface IGuard {
    enforce(...args: any[]): boolean | Promise<boolean>;
}
