import { createStore } from "redux"
import reducer from "./reducer"
import { Map, List } from "immutable"

export const initState = Map({
    "globalController": {},
    "character": {},
    "users": Map(),
    "user": {},
    "log": List(),
    "flags": Map(),
})

const store = createStore(reducer, initState)

export default store
