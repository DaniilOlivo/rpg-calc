import { createStore } from "redux"
import { Map } from "immutable"
import reducer from "./reducer"

let defaultState = Map({
    params: {
        hp: 20,
        maxHp: 20,
    }
})

const store = createStore(reducer, defaultState)

export default store