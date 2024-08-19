export interface IMiddleware<T = any> {
    enforce(...args: any[]): T;
}
