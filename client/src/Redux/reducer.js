import { Map } from "immutable"
import { initState } from "./store"

function reducer(state=Map(), action) {
    if (action.type === "SET_USERS") return state.set("users", Map(action.users))
    if (action.type === "SET_USER") return state.set("user", action.user)
    if (action.type === "SET_CONTROLLER") return state.set("globalController", action.controller)
    if (action.type === "SET_CHARACTER") return state.set("character", action.character)
    if (action.type === "SET_FLAG") return state.get("flags").set(action.flag, action.value)
    if (action.type === "PUSH_LOG") return state.update("log", (arrLogs) => arrLogs.push(action.message))
    if (action.type === "RESET") return initState
    return state
}

export default reducer
