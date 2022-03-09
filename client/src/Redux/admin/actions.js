export function setCurrent(char) {
    return {
        type: "SET_CURRENT",
        char
    }
}

export function setCharList(charname, charData) {
    return {
        type: "SET_CHAR",
        charname,
        charData,
    }
}
