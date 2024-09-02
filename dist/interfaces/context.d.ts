export interface IContext {
    get: (key: symbol) => any;
    set: (key: symbol, value: any) => void;
}
