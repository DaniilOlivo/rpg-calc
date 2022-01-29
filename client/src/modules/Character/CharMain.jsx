import CharMainView from "./CharMain/view";
import { Provider } from "react-redux"
import store from "./CharMain/store";

const CharMain = < Provider store={store} >< CharMainView /></Provider>

export default CharMain
