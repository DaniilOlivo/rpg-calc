import { Map } from "immutable"

function reducer(state=Map(), action) {
    if (action.type === "SET_CHAR") return state.set("char", action.charData)
    if (action.type === "PUSH_LOG") return state.update("log", (arrLogs) => arrLogs.push(action.message))
    return state
}

export default reducer
