type AnsiOptions = {
    color?: keyof typeof ansiColors;
    backgroundColor?: keyof typeof backgroundColors;
    bold?: boolean;
    underline?: boolean;
};
declare const ansiColors: Readonly<{
    black: "38;5;16";
    red: "38;5;196";
    green: "38;5;46";
    yellow: "38;5;226";
    blue: "38;5;21";
    magenta: "38;5;201";
    cyan: "38;5;51";
    white: "38;5;231";
    gray: "38;5;244";
}>;
declare const backgroundColors: Readonly<{
    black: "48;5;16";
    red: "48;5;196";
    green: "48;5;46";
    yellow: "48;5;226";
    blue: "48;5;21";
    magenta: "48;5;201";
    cyan: "48;5;51";
    white: "48;5;231";
    gray: "48;5;244";
}>;
export declare const ansiText: (text: string, options?: AnsiOptions) => string;
export {};
