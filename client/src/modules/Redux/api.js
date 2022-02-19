import store from "./store";
import { setPackage } from "./actions"

export function setData(data) {
    store.dispatch(setPackage(data))
}
