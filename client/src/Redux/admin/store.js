import { createStore } from "redux"
import reducerAdmin from "./reducer"

const adminStore = createStore(reducerAdmin)

export default adminStore
