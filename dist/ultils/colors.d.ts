type AnsiOptions = {
    color?: keyof typeof ansiColors;
    backgroundColor?: keyof typeof backgroundColors;
    bold?: boolean;
    underline?: boolean;
};
declare const ansiColors: Readonly<{
    black: 30;
    red: 31;
    green: 32;
    yellow: 33;
    blue: 34;
    magenta: 35;
    cyan: 36;
    white: 37;
    gray: 90;
}>;
declare const backgroundColors: Readonly<{
    black: 40;
    red: 41;
    green: 42;
    yellow: 43;
    blue: 44;
    magenta: 45;
    cyan: 46;
    white: 47;
    gray: 100;
}>;
export declare const ansiText: (text: string, options?: AnsiOptions) => string;
export {};
