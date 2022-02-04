import { Map } from "immutable"

function reducer(state=Map(), action) {
    if (action.type === "INIT") {
        return Map(action.values)
    }
    return state
}

export default reducer
