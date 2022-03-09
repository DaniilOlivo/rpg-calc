import { createStore } from "redux"
import reducerAdmin from "./reducer"
import { Map } from "immutable"

const initState = Map({
    "chars": {}
})

const adminStore = createStore(reducerAdmin, initState)

export default adminStore
