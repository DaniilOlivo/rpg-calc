import { setData } from ".."
import adminStore from "./store"
import { setChars, setCurrent } from "./actions"

export function setListChars(mapData) {
    adminStore.dispatch(setChars(mapData))
    let defaultChar = Object.values(mapData)[0]
    adminStore.dispatch(setCurrent(defaultChar))
    setChar()
}

export function setChar() {
    let state = adminStore.getState()
    setData(state.get("currentChar"))
}