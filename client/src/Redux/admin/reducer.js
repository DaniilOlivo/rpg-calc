import { Map } from "immutable"

function reducerAdmin(state=Map(), action) {
    if (action.type === "SET_CURRENT") return state.set("currentChar", action.char)
    if (action.type === "SET_CHAR") {
        return state.update("chars", (charsObj) => {
            charsObj[action.charname] = action.charData
            return charsObj
        })
    }
    return state
}

export default reducerAdmin
