export interface IMiddleware<T = any, K = any> {
    start?(...args: any[]): T;
    end?(...args: any[]): K;
}
