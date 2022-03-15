import { Map } from "immutable"
import { initState } from "./store"

function reducer(state=Map(), action) {
    if (action.type === "SET_CHAR") return state.set("char", action.charData)
    if (action.type === "PUSH_LOG") return state.update("log", (arrLogs) => arrLogs.push(action.message))
    if (action.type === "RESET") return initState
    return state
}

export default reducer
