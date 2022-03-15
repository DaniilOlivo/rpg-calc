import { Map } from "immutable"
import { initState } from "./store"

function reducerAdmin(state=Map(), action) {
    if (action.type === "SET_CURRENT") return state.set("currentChar", action.char)
    if (action.type === "SET_CHAR") {
        return state.update("chars", (charsObj) => charsObj.set(action.charname, action.charData))
    }
    if (action.type === "RESET") return initState
    return state
}

export default reducerAdmin
