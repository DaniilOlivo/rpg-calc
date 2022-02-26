import { createStore } from "redux"
import reducer from "../reducer"

const adminStore = createStore(reducer)

export default adminStore
