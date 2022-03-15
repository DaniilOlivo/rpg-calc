import { createStore } from "redux"
import reducer from "./reducer"
import { Map, List } from "immutable"

export const initState = Map({
    "char": {},
    "log": List()
})

const store = createStore(reducer, initState)

export default store
