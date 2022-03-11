import { createStore } from "redux"
import reducer from "./reducer"
import { Map, List } from "immutable"

let initState = new Map({
    "char": {},
    "log": List()
})

const store = createStore(reducer, initState)

export default store
