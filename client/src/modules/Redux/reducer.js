import { Map } from "immutable"

function reducer(state=Map(), action) {
    if (action.type === "SET") return Map(action.data)
    return state
}

export default reducer
