export interface IDispatcher<T = any> {
    execute(...args: any[]): T;
}
