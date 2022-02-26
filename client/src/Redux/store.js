import { createStore } from "redux"
import reducer from "./reducer"
import { Map } from "immutable"

let domains = new Map({
    "charMain": {}
})

const store = createStore(reducer, domains)

export default store
