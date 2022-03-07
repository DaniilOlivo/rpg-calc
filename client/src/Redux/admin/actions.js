export function setCurrent(char) {
    return {
        type: "SET_CURRENT",
        char
    }
}

export function setChars(chars) {
    return {
        type: "SET_CHARS",
        chars
    }
}

export function updateChar(charname, charData) {
    return {
        type: "UPDATE_CHAR",
        charname,
        charData,
    }
}
