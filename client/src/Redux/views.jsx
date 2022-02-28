import { Provider, connect } from "react-redux"
import store from "./store"

function getView(component, domain) {
    let mapStateToProps = (state) => state.get(domain)
    let Wrap = connect(mapStateToProps)(component)
    let View = <Provider store={store}>< Wrap /></Provider>
    return View
}

export default getView
