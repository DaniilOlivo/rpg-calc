import { setCharData } from ".."
import adminStore from "./store"
import { setCharList, setCurrent } from "./actions"

export function setListChars(charname, charData) {
    if (!charname || !charData) {
        throw new Error(`ReduxAdmin > API: Неверные агрументы ${charname}, ${charData}`)
    } 
    adminStore.dispatch(setCharList(charname, charData))
    let state = adminStore.getState()
    let chars = state.get("chars").toObject()
    let listChars = Object.values(chars)
    if (listChars.length === 1) {
        adminStore.dispatch(setCurrent(listChars[0]))
        setChar()
    } else if (listChars.length === 0) {
        throw new Error("ReduxAdmin > API: Список персонажей пуст")
    }
}

export function setChar() {
    let state = adminStore.getState()
    let currentChar = state.get("currentChar")
    if (!currentChar) throw new Error("ReduxAdmin > API: Нет текущего персонажа")
    setCharData(currentChar)
}