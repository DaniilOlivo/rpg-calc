import { setCharData } from ".."
import adminStore from "./store"
import { setCharList, setCurrent } from "./actions"

export function setListChars(charname, charData) {
    adminStore.dispatch(setCharList(charname, charData))
    let state = adminStore.getState()
    let chars = state.get("chars").toObject()
    let listChars = Object.values(chars)
    if (listChars.length === 1) {
        adminStore.dispatch(setCurrent(listChars[0]))
        setChar()
    }
}

export function setChar() {
    let state = adminStore.getState()
    setCharData(state.get("currentChar"))
}