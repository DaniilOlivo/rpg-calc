import { createStore } from "redux"
import reducer from "../../Redux/reducer"

const adminStore = createStore(reducer)

export default adminStore
