const ansiColors = Object.freeze({
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    gray: 90
});
const backgroundColors = Object.freeze({
    black: 40,
    red: 41,
    green: 42,
    yellow: 43,
    blue: 44,
    magenta: 45,
    cyan: 46,
    white: 47,
    gray: 100
});
export const ansiText = (text, options = {}) => {
    const { color, backgroundColor, bold, underline } = options;
    let ansiCode = "";
    if (bold) {
        ansiCode += "\x1b[1m"; // Mã ANSI cho in đậm
    }
    if (underline) {
        ansiCode += "\x1b[4m"; // Mã ANSI cho gạch chân
    }
    if (color && ansiColors[color]) {
        ansiCode += `\x1b[${ansiColors[color]}m`;
    }
    // Màu nền
    if (backgroundColor && backgroundColors[backgroundColor]) {
        ansiCode += `\x1b[${backgroundColors[backgroundColor]}m`;
    }
    // Kết quả với reset
    return `${ansiCode}${text}\x1b[0m`;
};
