import { Map } from "immutable"

function reducerAdmin(state=Map(), action) {
    if (action.type === "SET_CURRENT") return state.set("currentChar", action.char)
    if (action.type === "SET_CHARS") return state.set("chars", action.chars)
    return state
}

export default reducerAdmin
