export type Level = "blue" | "red" | "green" | "yellow" | "gray"

type Colors = Record<Level, string>

const COLORS: Colors = {
    blue: "36",
    red: "31",
    green: "32",
    yellow: "33",
    gray: "90"
}

const isTTY = process && process.stdout && process.stdout.isTTY

export function normal (color: Level, label: string) {
    return colorEncoder(COLORS[color] || "32", label)
}

export function bold (color: Level, label: string) {
    return colorEncoder(COLORS[color] || "32", label, true)
}

function colorEncoder (code: string, label: string, bold= false) {
    if (isTTY) {
        return "\x1B[" + code + (bold ? ";1" : "") + "m" + label + "\x1B[0m"
    }

    return label
}
