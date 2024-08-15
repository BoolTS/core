export interface IMiddleware<T> {
    enforce(): T;
}
