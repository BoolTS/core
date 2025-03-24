export interface IInterceptor<T = any, K = any> {
    open?(...args: any[]): T;
    close?(...args: any[]): K;
}
